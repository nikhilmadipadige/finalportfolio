import * as ReactModule from 'react';

const React = ReactModule.default?.default ?? ReactModule.default ?? ReactModule;
const { useEffect, useRef } = React;

const STATES = {
  hero: { color: '#c9ff45', secondary: '#6b7cff', scale: 1, speed: 0.18, density: 1 },
  capabilities: { color: '#f3efe7', secondary: '#c9ff45', scale: 1.08, speed: 0.26, density: 1.1 },
  shieldsense: { color: '#ff5940', secondary: '#5fb1ff', scale: 1.18, speed: 0.42, density: 1.3 },
  'voice-assistant': { color: '#7194ff', secondary: '#d7c8ff', scale: 0.96, speed: 0.62, density: .9 },
  'facial-expression': { color: '#c9ff45', secondary: '#efffe1', scale: 1.05, speed: 0.34, density: 1.15 },
  supernatural: { color: '#ff9b58', secondary: '#ff5940', scale: 1.14, speed: 0.12, density: .85 },
  unreal: { color: '#a985ff', secondary: '#7194ff', scale: 1.2, speed: 0.2, density: 1.05 },
  approach: { color: '#d9d4ca', secondary: '#7194ff', scale: .92, speed: 0.22, density: .8 },
  contact: { color: '#c9ff45', secondary: '#ff5940', scale: .8, speed: .5, density: .7 },
};

export default function SignalField({ mode = 'hero' }) {
  const canvasRef = useRef(null);
  const modeRef = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let cancelled = false;
    let teardown = () => {};
    const setup = async () => {
      const THREE = await import('three');
      if (cancelled) return;
      const colorTargets = Object.fromEntries(Object.entries(STATES).map(([key, value]) => [key, { ...value, color: new THREE.Color(value.color), secondary: new THREE.Color(value.secondary) }]));
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
      camera.position.set(0, 0, 7.4);
      const root = new THREE.Group(); scene.add(root);
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 3), new THREE.MeshBasicMaterial({ color: 0xc9ff45, wireframe: true, transparent: true, opacity: .2 }));
      const coreShell = new THREE.Mesh(new THREE.IcosahedronGeometry(.76, 2), new THREE.MeshBasicMaterial({ color: 0xc9ff45, transparent: true, opacity: .055, blending: THREE.AdditiveBlending, depthWrite: false }));
      root.add(core, coreShell);
      const rings = [];
      [1.45, 1.95, 2.55].forEach((radius, index) => { const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, index === 0 ? .012 : .009, 8, 128), new THREE.MeshBasicMaterial({ color: 0x6b7cff, transparent: true, opacity: .24 - index * .045, blending: THREE.AdditiveBlending, depthWrite: false })); ring.rotation.set(index * .7, index * .45, index * .28); root.add(ring); rings.push(ring); });
      const count = 680; const positions = new Float32Array(count * 3); const base = new Float32Array(count * 3); const phase = new Float32Array(count);
      for (let i = 0; i < count; i += 1) { const radius = 1.55 + Math.random() * 2.6; const theta = Math.random() * Math.PI * 2; const phi = Math.acos((Math.random() * 2) - 1); const index = i * 3; base[index] = Math.sin(phi) * Math.cos(theta) * radius; base[index + 1] = Math.cos(phi) * radius; base[index + 2] = Math.sin(phi) * Math.sin(theta) * radius; positions[index] = base[index]; positions[index + 1] = base[index + 1]; positions[index + 2] = base[index + 2]; phase[i] = Math.random() * Math.PI * 2; }
      const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({ color: 0xc9ff45, size: .028, sizeAttenuation: true, transparent: true, opacity: .72, blending: THREE.AdditiveBlending, depthWrite: false });
      const particles = new THREE.Points(particleGeometry, particleMaterial); root.add(particles);
      const beamGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.5, 0, 0), new THREE.Vector3(3.5, 0, 0)]);
      const beams = [0, 1, 2].map((index) => { const beam = new THREE.Line(beamGeometry, new THREE.LineBasicMaterial({ color: 0xff5940, transparent: true, opacity: .09, blending: THREE.AdditiveBlending })); beam.rotation.set(index * .6, index * .4, index * .7); beam.position.z = -1.2 - index * .35; root.add(beam); return beam; });
      let width = 0; let height = 0; const resize = () => { width = window.innerWidth; height = window.innerHeight; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); }; resize(); window.addEventListener('resize', resize, { passive: true });
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 }; const onPointer = (event) => { pointer.tx = (event.clientX / Math.max(width, 1) - .5) * 2; pointer.ty = (event.clientY / Math.max(height, 1) - .5) * 2; }; window.addEventListener('pointermove', onPointer, { passive: true });
      let visible = true; const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 }); observer.observe(canvas);
      const state = { color: new THREE.Color('#c9ff45'), secondary: new THREE.Color('#6b7cff'), scale: 1, speed: .18, density: 1 }; const clock = new THREE.Clock(); let raf = 0;
      const animate = () => { raf = requestAnimationFrame(animate); if (!visible) return; const time = clock.getElapsedTime(); const target = colorTargets[modeRef.current] || colorTargets.hero; state.color.lerp(target.color, .035); state.secondary.lerp(target.secondary, .035); state.scale += (target.scale - state.scale) * .035; state.speed += (target.speed - state.speed) * .035; state.density += (target.density - state.density) * .035; pointer.x += (pointer.tx - pointer.x) * .045; pointer.y += (pointer.ty - pointer.y) * .045; root.rotation.y = time * state.speed * .18 + pointer.x * .14; root.rotation.x = pointer.y * .08; root.scale.setScalar(state.scale); core.rotation.x = time * state.speed * .42; core.rotation.y = -time * state.speed * .58; coreShell.rotation.x = -time * state.speed * .3; coreShell.rotation.z = time * state.speed * .25; core.material.color.copy(state.color); coreShell.material.color.copy(state.color); rings.forEach((ring, index) => { ring.material.color.copy(index === 1 ? state.color : state.secondary); ring.rotation.x += (.0007 + index * .00025) * (reduced ? 0 : 1); ring.rotation.z -= (.0009 + index * .0003) * (reduced ? 0 : 1); ring.scale.setScalar(1 + Math.sin(time * state.speed + index) * .035); }); particleMaterial.color.copy(state.secondary); particleMaterial.size = .023 + state.density * .006; const attr = particleGeometry.attributes.position; for (let i = 0; i < count; i += 1) { const index = i * 3; const p = phase[i]; attr.array[index] = base[index] + Math.sin(time * state.speed + p) * .018; attr.array[index + 1] = base[index + 1] + Math.cos(time * state.speed * .8 + p) * .018; attr.array[index + 2] = base[index + 2] + Math.sin(time * state.speed * .65 + p) * .025; } attr.needsUpdate = true; particles.rotation.y = -time * state.speed * .12; beams.forEach((beam, index) => { beam.material.color.copy(state.color); beam.rotation.y += .0007 * (index + 1) * (reduced ? 0 : 1); beam.rotation.x += .0004 * (index + 1) * (reduced ? 0 : 1); }); camera.position.x += ((pointer.x * .35) - camera.position.x) * .02; camera.position.y += ((-pointer.y * .22) - camera.position.y) * .02; camera.lookAt(0, 0, 0); renderer.render(scene, camera); };
      animate();
      teardown = () => { cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onPointer); renderer.dispose(); particleGeometry.dispose(); particleMaterial.dispose(); beamGeometry.dispose(); beams.forEach((beam) => beam.material.dispose()); rings.forEach((ring) => { ring.geometry.dispose(); ring.material.dispose(); }); core.geometry.dispose(); core.material.dispose(); coreShell.geometry.dispose(); coreShell.material.dispose(); };
    };
    setup();
    return () => { cancelled = true; teardown(); };
  }, []);
  return <canvas ref={canvasRef} className="signal-field" aria-hidden="true" />;
}
