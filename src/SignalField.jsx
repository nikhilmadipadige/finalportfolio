import * as ReactModule from 'react';

const React = ReactModule.default?.default ?? ReactModule.default ?? ReactModule;
const { useEffect, useRef } = React;

const SCENES = [
  { tint: '#cfd6df', secondary: '#657080', morph: 0.08, energy: 0.18, network: 0.08, scan: 0.02, orbit: 0.28 },
  { tint: '#e4e8ed', secondary: '#9aa4b1', morph: 0.35, energy: 0.34, network: 0.72, scan: 0.18, orbit: 0.5 },
  { tint: '#d6dbe3', secondary: '#b64c4d', morph: 0.78, energy: 0.82, network: 0.55, scan: 0.96, orbit: 0.7 },
  { tint: '#d7dde5', secondary: '#6c86b0', morph: 0.54, energy: 0.68, network: 0.96, scan: 0.34, orbit: 0.84 },
  { tint: '#e0e3e7', secondary: '#9cb99b', morph: 0.86, energy: 0.62, network: 0.76, scan: 0.62, orbit: 0.58 },
  { tint: '#d8dce3', secondary: '#b07c56', morph: 0.42, energy: 0.36, network: 0.28, scan: 0.16, orbit: 0.42 },
  { tint: '#d4d8e2', secondary: '#8178b1', morph: 0.94, energy: 0.88, network: 0.8, scan: 0.28, orbit: 0.92 },
  { tint: '#dce2e8', secondary: '#78818c', morph: 0.16, energy: 0.22, network: 0.1, scan: 0.02, orbit: 0.25 },
];

const vertexShader = `
uniform float uTime;
uniform float uEnergy;
uniform float uMorph;
uniform vec2 uPointer;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 p = position;
  float wave = sin(p.x * 4.1 + uTime * 0.7) + sin(p.y * 5.3 - uTime * 0.52) + sin(p.z * 6.4 + uTime * 0.38);
  float ripple = wave * 0.025 * (1.0 + uEnergy * 1.7);
  float dataPulse = sin((p.x + p.y + p.z) * 13.0 - uTime * 1.8) * uMorph * 0.028;
  p += normal * (ripple + dataPulse);
  p.xy += uPointer * 0.055 * (1.0 - abs(normal.z));
  vec4 worldPosition = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vPosition = p;
  gl_Position = projectionMatrix * worldPosition;
}
`;

const fragmentShader = `
uniform vec3 uTint;
uniform float uTime;
uniform float uEnergy;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 n = normalize(vNormal);
  vec3 lightA = normalize(vec3(-0.5, 0.8, 1.0));
  vec3 lightB = normalize(vec3(0.75, -0.3, 0.8));
  float diffuse = max(dot(n, lightA), 0.0) * 0.72 + max(dot(n, lightB), 0.0) * 0.34;
  float fresnel = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.4);
  float bands = smoothstep(0.25, 0.9, sin(vPosition.y * 7.0 + uTime * 0.18) * 0.5 + 0.5) * uEnergy * 0.08;
  vec3 base = mix(vec3(0.025, 0.03, 0.038), uTint / 2.2, 0.34 + diffuse * 0.48);
  base += uTint * (fresnel * 0.52 + bands);
  float grain = fract(sin(dot(vPosition.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453) * 0.025;
  gl_FragColor = vec4(base + grain, 0.96);
}
`;

export default function SignalField({ stage = 0 }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let cancelled = false;
    let teardown = () => {};

    const setup = async () => {
      const THREE = await import('three');
      if (cancelled) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
      } catch (error) {
        canvas.dataset.webgl = 'unavailable';
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.1 : 1.45));
      renderer.setClearColor(0x030405, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 0, 6.9);
      const root = new THREE.Group();
      scene.add(root);

      const geometry = new THREE.IcosahedronGeometry(1.22, 5);
      const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 }, uEnergy: { value: 0.18 }, uMorph: { value: 0.08 },
          uPointer: { value: new THREE.Vector2() }, uTint: { value: new THREE.Color('#cfd6df') },
        },
        vertexShader, fragmentShader, transparent: true, side: THREE.DoubleSide,
      });
      const core = new THREE.Mesh(geometry, coreMaterial);
      root.add(core);

      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({ color: '#d5dbe3', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending }));
      wire.scale.setScalar(1.008);
      root.add(wire);

      const source = geometry.attributes.position.array;
      const pointPositions = new Float32Array(source.length);
      for (let i = 0; i < source.length; i += 3) {
        pointPositions[i] = source[i] * (1 + (Math.random() - 0.5) * 0.08);
        pointPositions[i + 1] = source[i + 1] * (1 + (Math.random() - 0.5) * 0.08);
        pointPositions[i + 2] = source[i + 2] * (1 + (Math.random() - 0.5) * 0.08);
      }
      const pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
      const pointMaterial = new THREE.PointsMaterial({ color: '#aeb9c9', size: 0.018, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
      const points = new THREE.Points(pointGeometry, pointMaterial);
      root.add(points);

      const rings = [
        new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.008, 8, 160), new THREE.MeshBasicMaterial({ color: '#dbe0e7', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending })),
        new THREE.Mesh(new THREE.TorusGeometry(2.12, 0.006, 8, 160), new THREE.MeshBasicMaterial({ color: '#8995a4', transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending })),
        new THREE.Mesh(new THREE.TorusGeometry(2.52, 0.004, 8, 160), new THREE.MeshBasicMaterial({ color: '#b7c0ca', transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending })),
      ];
      rings.forEach((ring, index) => { ring.rotation.set(index * 0.8, index * 0.42, index * 0.28); root.add(ring); });

      const starCount = window.innerWidth < 700 ? 360 : 720;
      const stars = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i += 1) {
        const radius = 4 + Math.random() * 7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        stars[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
        stars[i * 3 + 1] = Math.cos(phi) * radius;
        stars[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
      const starMaterial = new THREE.PointsMaterial({ color: '#bac2cc', size: 0.012, transparent: true, opacity: 0.24, depthWrite: false, sizeAttenuation: true });
      const starField = new THREE.Points(starGeometry, starMaterial);
      scene.add(starField);

      const nodeGroup = new THREE.Group();
      const nodeMaterial = new THREE.MeshBasicMaterial({ color: '#c5ced9', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
      const nodePositions = [[-2.2, 1.1, 0.1], [-1.4, -1.4, 0.3], [1.8, 1.3, -0.1], [2.3, -0.7, 0.2], [0.2, 2.1, -0.4], [0.6, -2, 0.4]];
      nodePositions.forEach(([x, y, z]) => { const node = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 8), nodeMaterial); node.position.set(x, y, z); nodeGroup.add(node); });
      const nodeLines = [];
      [[0, 1], [0, 4], [4, 2], [2, 3], [1, 3], [1, 5], [5, 3]].forEach(([a, b]) => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...nodePositions[a]), new THREE.Vector3(...nodePositions[b])]);
        const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: '#9eabb9', transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending }));
        nodeLines.push(line); nodeGroup.add(line);
      });
      scene.add(nodeGroup);

      const scanGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.4, 0, 0.2), new THREE.Vector3(3.4, 0, 0.2)]);
      const scan = new THREE.Line(scanGeometry, new THREE.LineBasicMaterial({ color: '#dce3ea', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending }));
      scene.add(scan);

      let width = 0; let height = 0;
      const resize = () => { width = window.innerWidth; height = window.innerHeight; renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
      resize(); window.addEventListener('resize', resize, { passive: true });
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (event) => { pointer.tx = (event.clientX / Math.max(width, 1) - 0.5) * 2; pointer.ty = (event.clientY / Math.max(height, 1) - 0.5) * 2; };
      window.addEventListener('pointermove', onPointer, { passive: true });
      let visible = true;
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
      observer.observe(canvas);
      const state = { tint: new THREE.Color('#cfd6df'), secondary: new THREE.Color('#657080'), morph: 0.08, energy: 0.18, network: 0.08, scan: 0.02, orbit: 0.28, stage: 0 };
      const clock = new THREE.Clock(); let raf = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visible) return;
        const time = clock.getElapsedTime();
        const target = SCENES[Math.max(0, Math.min(SCENES.length - 1, stageRef.current))];
        const targetTint = new THREE.Color(target.tint); const targetSecondary = new THREE.Color(target.secondary);
        state.tint.lerp(targetTint, 0.035); state.secondary.lerp(targetSecondary, 0.035);
        state.morph += (target.morph - state.morph) * 0.035; state.energy += (target.energy - state.energy) * 0.035; state.network += (target.network - state.network) * 0.035; state.scan += (target.scan - state.scan) * 0.035; state.orbit += (target.orbit - state.orbit) * 0.035; state.stage += (stageRef.current - state.stage) * 0.04;
        pointer.x += (pointer.tx - pointer.x) * 0.045; pointer.y += (pointer.ty - pointer.y) * 0.045;
        coreMaterial.uniforms.uTime.value = time; coreMaterial.uniforms.uEnergy.value = state.energy; coreMaterial.uniforms.uMorph.value = state.morph; coreMaterial.uniforms.uPointer.value.set(pointer.x, -pointer.y); coreMaterial.uniforms.uTint.value.copy(state.tint);
        root.rotation.y = time * (0.06 + state.energy * 0.08) + pointer.x * 0.12; root.rotation.x = pointer.y * 0.07 + Math.sin(time * 0.18) * 0.025; root.scale.setScalar(0.98 + state.morph * 0.1);
        core.rotation.z = Math.sin(time * 0.12) * 0.08;
        wire.rotation.copy(core.rotation); wire.material.color.copy(state.secondary); wire.material.opacity = 0.06 + state.morph * 0.42;
        points.rotation.y = -time * 0.025; pointMaterial.color.copy(state.secondary); pointMaterial.opacity = 0.05 + state.morph * 0.48; pointMaterial.size = 0.014 + state.morph * 0.022;
        rings.forEach((ring, index) => { ring.material.color.copy(index === 1 ? state.secondary : state.tint); ring.material.opacity = (0.025 + state.orbit * 0.08) / (index + 1); ring.rotation.x += (0.00035 + index * 0.00018) * (reduced ? 0 : 1); ring.rotation.z -= (0.00055 + index * 0.00022) * (reduced ? 0 : 1); ring.scale.setScalar(1 + Math.sin(time * 0.32 + index) * (0.018 + state.energy * 0.012)); });
        starField.rotation.y = time * 0.004; starMaterial.opacity = 0.12 + state.energy * 0.18;
        nodeGroup.rotation.y = time * 0.035; nodeGroup.rotation.x = pointer.y * 0.04; nodeMaterial.opacity = 0.08 + state.network * 0.56; nodeLines.forEach((line) => { line.material.color.copy(state.secondary); line.material.opacity = 0.04 + state.network * 0.34; });
        scan.material.color.copy(state.secondary); scan.material.opacity = 0.02 + state.scan * 0.42; scan.position.y = Math.sin(time * (0.3 + state.energy * 0.4)) * 1.55;
        camera.position.x += (pointer.x * 0.24 - camera.position.x) * 0.018; camera.position.y += (-pointer.y * 0.14 - camera.position.y) * 0.018; camera.position.z += ((6.9 - state.morph * 0.75) - camera.position.z) * 0.018; camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();
      teardown = () => { cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onPointer); renderer.dispose(); geometry.dispose(); coreMaterial.dispose(); wire.geometry.dispose(); wire.material.dispose(); pointGeometry.dispose(); pointMaterial.dispose(); rings.forEach((ring) => { ring.geometry.dispose(); ring.material.dispose(); }); starGeometry.dispose(); starMaterial.dispose(); nodeGroup.children.forEach((node) => { node.geometry?.dispose?.(); node.material?.dispose?.(); }); scanGeometry.dispose(); scan.material.dispose(); };
    };
    setup();
    return () => { cancelled = true; teardown(); };
  }, []);

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />;
}
