import * as ReactModule from 'react';
import * as THREE from 'three';

const React = ReactModule.default?.default ?? ReactModule.default ?? ReactModule;
const { useEffect, useRef } = React;

const TARGETS = {
  hero: { light: 0, burst: 0, sphere: 0.62, wire: 0.18, knot: 0.12, snow: 0.8, camera: 6.9 },
  intro: { light: 0, burst: 0, sphere: 0.74, wire: 0.1, knot: 0, snow: 0.16, camera: 6.15 },
  burst: { light: 0, burst: 1, sphere: 0.02, wire: 0, knot: 0, snow: 0.04, camera: 7.2 },
  statement: { light: 1, burst: 0, sphere: 0.02, wire: 0, knot: 0, snow: 0.02, camera: 7.8 },
  list: { light: 0, burst: 0, sphere: 0.4, wire: 0.1, knot: 0.08, snow: 0.22, camera: 7.3 },
  projects: { light: 0, burst: 0, sphere: 0.18, wire: 0.08, knot: 0.12, snow: 0.1, camera: 7.5 },
  'about-name': { light: 0, burst: 0, sphere: 0.52, wire: 0.1, knot: 0, snow: 0.5, camera: 7.1 },
  'about-bio': { light: 0, burst: 0, sphere: 0.35, wire: 0.06, knot: 0, snow: 0.24, camera: 7.4 },
  contact: { light: 0, burst: 0, sphere: 0.72, wire: 1, knot: 0.52, snow: 0.05, camera: 7.8 },
};

export default function SignalField({ stage = 'hero' }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(stage);

  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: 'high-performance' });
    } catch {
      canvas.dataset.webgl = 'unavailable';
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x080909, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const environmentFaces = Array.from({ length: 6 }, (_, faceIndex) => {
      const face = document.createElement('canvas');
      face.width = 512;
      face.height = 512;
      const context = face.getContext('2d');
      const gradient = context.createLinearGradient(0, 0, 512, 512);
      const palettes = [ ['#101719', '#c9d9d7'], ['#0a0d0e', '#f7f5e9'], ['#20272b', '#6e8990'], ['#070909', '#d1b59d'], ['#121a1d', '#edf4f2'], ['#050606', '#7f9ca0'] ];
      gradient.addColorStop(0, palettes[faceIndex][0]);
      gradient.addColorStop(0.46, palettes[faceIndex][0]);
      gradient.addColorStop(0.5, palettes[faceIndex][1]);
      gradient.addColorStop(0.56, palettes[faceIndex][0]);
      gradient.addColorStop(1, '#020303');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 512);
      return face;
    });
    const environment = new THREE.CubeTexture(environmentFaces);
    environment.colorSpace = THREE.SRGBColorSpace;
    environment.needsUpdate = true;
    scene.environment = environment;
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const world = new THREE.Group();
    scene.add(world);

    const ambient = new THREE.AmbientLight(0xffffff, 0.28);
    const key = new THREE.DirectionalLight(0xffffff, 4.6);
    key.position.set(3, 4, 6);
    const coolRim = new THREE.PointLight(0x9ed8ff, 34, 12, 2);
    coolRim.position.set(-3.8, 2.5, 3.6);
    const warmRim = new THREE.PointLight(0xffd4ad, 28, 10, 2);
    warmRim.position.set(3.4, -1.4, 3.1);
    const topStrip = new THREE.PointLight(0xffffff, 42, 9, 2);
    topStrip.position.set(0, 5.2, 1.8);
    scene.add(ambient, key, coolRim, warmRim, topStrip);

    const chromeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.045, metalness: 1, clearcoat: 1, clearcoatRoughness: 0.035, transparent: false, opacity: 1, flatShading: false, side: THREE.DoubleSide, depthWrite: false });
    const sphereGeometry = new THREE.SphereGeometry(1.22, 96, 64);
    const sphere = new THREE.Mesh(sphereGeometry, chromeMaterial);
    world.add(sphere);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.5, 0.16, 160, 28, 2, 3),
      new THREE.MeshStandardMaterial({ color: 0xd7d8d2, metalness: 0.86, roughness: 0.12, emissive: 0x454847, emissiveIntensity: 0.32, transparent: true, opacity: 0.45 }),
    );
    knot.position.set(0, 1.05, 0);
    world.add(knot);

    const snowCount = window.innerWidth < 700 ? 70 : 140;
    const snowPositions = new Float32Array(snowCount * 3);
    for (let i = 0; i < snowCount; i += 1) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 8;
      snowPositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1;
    }
    const snowGeometry = new THREE.BufferGeometry();
    snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowMaterial = new THREE.PointsMaterial({ color: 0xf4f4f0, size: window.innerWidth < 700 ? 0.025 : 0.038, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending });
    const snow = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snow);

    const starMaterial = new THREE.MeshPhysicalMaterial({ color: 0xeaf7ff, roughness: 0.035, metalness: 1, iridescence: 1, iridescenceIOR: 1.45, iridescenceThicknessRange: [120, 520], clearcoat: 1, clearcoatRoughness: 0.025, transparent: true, opacity: 0.84 });
    const makeStar = (scale, position) => {
      const shape = new THREE.Shape();
      const points = [];
      for (let i = 0; i < 16; i += 1) {
        const angle = (i / 16) * Math.PI * 2;
        const cardinal = i % 4 === 0;
        const radius = cardinal ? 1.45 : i % 2 === 0 ? 0.42 : 0.18;
        points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
      }
      shape.moveTo(points[0][0], points[0][1]);
      points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
      shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.14, bevelThickness: 0.08, curveSegments: 24 });
      const star = new THREE.Mesh(geometry, starMaterial);
      star.scale.setScalar(scale);
      star.position.set(...position);
      star.rotation.z = Math.PI / 4;
      scene.add(star);
      return star;
    };
    const stars = [
      makeStar(0.22, [-1.65, 1.55, -0.7]),
      makeStar(0.16, [1.65, 0.72, -0.8]),
      makeStar(0.19, [-1.55, -1.45, -0.8]),
    ];

    const resize = () => {
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      canvas.dataset.webgl = `running:${width}x${height}`;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointer = (event) => {
      pointer.targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointer.targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const state = { ...TARGETS.hero };
    const clock = new THREE.Clock();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const time = clock.elapsedTime;
      const easing = 1 - Math.exp(-dt * 3.2);
      const target = TARGETS[stageRef.current] || TARGETS.hero;
      Object.keys(state).forEach((keyName) => { state[keyName] += (target[keyName] - state[keyName]) * easing; });

      pointer.x += (pointer.targetX - pointer.x) * easing * 0.9;
      pointer.y += (pointer.targetY - pointer.y) * easing * 0.9;
      const pulse = reduced ? 1 : 1 + Math.sin(time * 0.8) * 0.045;
      world.scale.setScalar(state.sphere * pulse);
      const activeStage = stageRef.current;
      const stageX = activeStage === 'hero' ? 0 : activeStage === 'contact' ? 2.2 : activeStage === 'about-name' ? 1.8 : activeStage === 'about-bio' ? 1.7 : activeStage === 'intro' ? 2.25 : activeStage === 'statement' ? 1.6 : 1.35;
      const stageY = activeStage === 'contact' ? -1.8 : activeStage === 'about-name' ? -0.6 : activeStage === 'about-bio' ? 0.8 : activeStage === 'intro' ? 0.8 : 0;
      world.position.x += (stageX - world.position.x) * easing;
      world.position.y += (stageY - world.position.y) * easing;
      world.rotation.y += (time * 0.12 + pointer.x * 0.24 - world.rotation.y) * easing;
      world.rotation.x += (pointer.y * 0.12 - world.rotation.x) * easing;
      sphere.rotation.z = reduced ? 0 : time * 0.08;
      chromeMaterial.opacity = Math.min(0.96, state.sphere * 0.95 + 0.22);
      knot.visible = state.knot > 0.01;
      knot.material.opacity = state.knot;
      knot.rotation.x += reduced ? 0 : dt * 0.28;
      knot.rotation.y += reduced ? 0 : dt * 0.4;
      knot.position.y = stageRef.current === 'contact' ? 1.05 : 0;
      snowMaterial.opacity = state.snow * 0.42;
      const starStages = [['hero', 'intro'], ['statement', 'list'], ['projects', 'about-bio']];
      stars.forEach((star, index) => {
        star.visible = starStages[index].includes(activeStage);
        star.rotation.x += reduced ? 0 : dt * (0.12 + index * 0.04);
        star.rotation.y += reduced ? 0 : dt * (0.18 + index * 0.05);
        starMaterial.opacity = 0.84;
      });

      if (!reduced) {
        const positions = snowGeometry.attributes.position.array;
        for (let i = 0; i < snowCount; i += 1) {
          positions[i * 3 + 1] -= dt * 0.12;
          if (positions[i * 3 + 1] < -3.7) positions[i * 3 + 1] = 3.7;
          positions[i * 3] += Math.sin(time * 0.18 + i) * dt * 0.006;
        }
        snowGeometry.attributes.position.needsUpdate = true;
      }
      snow.rotation.y = pointer.x * 0.03;
      camera.position.z += (state.camera - camera.position.z) * easing;
      camera.lookAt(activeStage === 'contact' ? 0 : activeStage === 'hero' ? 0 : 1.0, activeStage === 'contact' ? -1.3 : 0, 0);

      const light = state.light;
      renderer.setClearColor(new THREE.Color(0x080909).lerp(new THREE.Color(0xf2f0e7), light), 1);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      renderer.dispose();
      sphereGeometry.dispose();
      chromeMaterial.dispose();
      starMaterial.dispose();
      stars.forEach((star) => star.geometry.dispose());
      knot.geometry.dispose();
      knot.material.dispose();
      snowGeometry.dispose();
      snowMaterial.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />;
}
