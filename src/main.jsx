import * as ReactModule from 'react';
import * as ReactDOMModule from 'react-dom/client';
import { AnimatePresence, motion } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import SignalField from './SignalField';
import './styles.css';

const React = ReactModule.default?.default ?? ReactModule.default ?? ReactModule;
const ReactDOM = ReactDOMModule.default?.default ?? ReactDOMModule.default ?? ReactDOMModule;
const { createRoot } = ReactDOM;
const { useCallback, useEffect, useMemo, useRef, useState } = React;

const portrait = '/assets/nikhil-portrait.webp';
const resume = '/assets/Nikhil-Madipadige-Resume.pdf';
const github = 'https://github.com/nikhilmadipadige';
const linkedin = 'https://www.linkedin.com/in/nikhil-madipadige/';
const email = 'mailto:madipadige.nikhil4u@gmail.com';

const projects = [
  { slug: 'shieldsense', number: '01', title: 'ShieldSense', category: 'SECURITY / AI AGENT', summary: 'A threat-investigation agent that checks uploaded data against URLhaus and ThreatFox, watches for manipulation signals, and recommends a safer action.', tags: ['URLhaus', 'ThreatFox', 'risk analysis'], image: '/assets/shieldsense-preview.webp', live: 'https://shield-sense-mvp.vercel.app/' },
  { slug: 'voice-assistant', number: '02', title: 'SamurAI', category: 'VOICE / PYTHON', summary: 'A Flask-based voice assistant that turns conversational intent into JSON commands and useful browser actions.', tags: ['Python', 'Flask', 'JSON'], image: '/assets/project-images/samurai.jpg', live: 'https://github.com/nikhilmadipadige/SamurAI' },
  { slug: 'facial-expression', number: '03', title: 'Expression Lab', category: 'VISION / REAL-TIME', summary: 'A webcam and image analysis surface for facial expressions, landmarks, confidence scores, and model comparison.', tags: ['FER', 'DeepFace', 'webcam'], image: '/assets/project-images/expression-lab.jpg', live: 'https://github.com/nikhilmadipadige/facial-expression-' },
  { slug: 'supernatural', number: '04', title: 'Supernatural / Scrolly', category: 'CREATIVE WEB / GSAP', summary: 'A cinematic scrollytelling experiment where pacing, image, and transition become the interface.', tags: ['GSAP', 'story', 'frontend'], image: '/assets/project-images/supernatural.png', live: 'https://supernatural-scrollyweb.vercel.app/' },
  { slug: 'unreal', number: '05', title: 'Star Wars / Unreal', category: 'REAL-TIME 3D / UE5', summary: 'A cinematic environment study exploring Lumen light, reflections, camera language, and atmosphere in Unreal Engine 5.', tags: ['UE5', 'Lumen', 'cinematics'], image: '/assets/project-images/unreal.jpeg', live: null },
];

const scenes = ['hero', 'intro', 'burst', 'statement', 'list', 'projects', 'about-name', 'about-bio', 'contact'];

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { const onPop = () => setPath(window.location.pathname); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const navigate = useCallback((to) => { if (!to || to.startsWith('http') || to.startsWith('mailto:')) return; window.history.pushState({}, '', to); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  return { path, navigate };
}

function useLenis() {
  const lenisRef = useRef(null);
  useEffect(() => { const lenis = new Lenis({ duration: 1.25, smoothWheel: true, syncTouch: false, wheelMultiplier: 0.76 }); lenisRef.current = lenis; let raf = 0; const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); return () => { cancelAnimationFrame(raf); lenis.destroy(); }; }, []);
  return lenisRef;
}

function Loader({ done }) {
  const [count, setCount] = useState(0);
  useEffect(() => { let frame = 0; const started = performance.now(); const tick = (time) => { const value = Math.min(100, Math.round(((time - started) / 1250) * 100)); setCount(value); if (value < 100) frame = requestAnimationFrame(tick); else setTimeout(done, 120); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }, []);
  return <motion.div className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}><strong>n</strong><div><span>{String(count).padStart(3, '0')}</span> LOADING</div></motion.div>;
}

function GlitchWordmark() {
  const [label, setLabel] = useState('nikhil');
  const timer = useRef(null);
  const scramble = () => { const chars = 'αβγδεζηθικλμνξοπρστφχψω'; let tick = 0; clearInterval(timer.current); timer.current = setInterval(() => { tick += 1; setLabel(tick > 7 ? 'nikhil' : Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')); if (tick > 7) clearInterval(timer.current); }, 45); };
  useEffect(() => { const interval = setInterval(scramble, 6200); return () => { clearInterval(interval); clearInterval(timer.current); }; }, []);
  return <a href="#hero" className="wordmark" onMouseEnter={scramble}>{label}</a>;
}

function Cursor() {
  const ref = useRef(null); const labelRef = useRef(null); const target = useRef({ x: 0, y: 0 }); const current = useRef({ x: 0, y: 0 });
  useEffect(() => { const move = (event) => { target.current = { x: event.clientX, y: event.clientY }; const item = event.target.closest('[data-cursor]'); if (labelRef.current) labelRef.current.textContent = item?.dataset.cursor || ''; ref.current?.classList.toggle('is-large', Boolean(item)); }; window.addEventListener('pointermove', move, { passive: true }); let raf = 0; const loop = () => { current.current.x += (target.current.x - current.current.x) * .18; current.current.y += (target.current.y - current.current.y) * .18; if (ref.current) { ref.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`; } raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); }; }, []);
  return <div className="cursor" ref={ref}><i /><span ref={labelRef} /></div>;
}

function HUD({ active, tour }) {
  const index = scenes.indexOf(active);
  const label = index === 0 ? '' : index < 3 ? '01 POINT OF VIEW' : index < 5 ? '02 PRACTICE' : index < 6 ? '03 WORK' : index < 8 ? '04 ABOUT' : '05 CONTACT';
  return <header className={`hud ${index > 0 ? 'is-compact' : ''}`}><GlitchWordmark /><nav><a href="#about-name">About</a><a href="#statement">Practice</a><a href="#projects">Work</a><a href={resume}>Resume</a><a href="#contact">Contact</a></nav><div className="hud-mark"><b>n</b>{label && <span>{label}</span>}<em>{Array.from({ length: 5 }, (_, item) => <i key={item} className={item <= Math.min(4, Math.floor((index / 8) * 5)) ? 'is-filled' : ''} />)}</em></div><button className="tour-trigger" onClick={tour}>{index === 0 ? '▶ TAKE THE TOUR' : '⌄'}</button>{index === 0 && <span className="location">HYDERABAD, IN · WORLDWIDE</span>}</header>;
}

function Scene({ id, children, className = '' }) { return <section id={id} data-scene={id} className={`scene ${className}`}>{children}</section>; }
function Reveal({ children, className = '' }) { return <motion.div className={className} initial={{ opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .45, once: false }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }}>{children}</motion.div>; }

function Experience({ navigate }) {
  const lenisRef = useLenis(); const [active, setActive] = useState(0); const [ready, setReady] = useState(false); const tourTimer = useRef(null);
  useEffect(() => { const nodes = [...document.querySelectorAll('[data-scene]')]; const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.dataset.scene); }), { rootMargin: '-50% 0px -50% 0px' }); nodes.forEach((node) => observer.observe(node)); return () => observer.disconnect(); }, []);
  useEffect(() => { const onKey = (event) => { if (event.key.toLowerCase() === 'm') tour(); }; const stop = () => { if (tourTimer.current) clearInterval(tourTimer.current); tourTimer.current = null; }; window.addEventListener('keydown', onKey); ['wheel', 'touchstart', 'keydown'].forEach((name) => window.addEventListener(name, stop, { passive: true })); return () => { window.removeEventListener('keydown', onKey); ['wheel', 'touchstart', 'keydown'].forEach((name) => window.removeEventListener(name, stop)); }; }, []);
  const tour = () => { if (tourTimer.current) { clearInterval(tourTimer.current); return; } const start = window.scrollY; const end = document.documentElement.scrollHeight - window.innerHeight; const begin = performance.now(); const duration = 50000; tourTimer.current = setInterval(() => { const progress = Math.min(1, (performance.now() - begin) / duration); const eased = progress < .5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2; lenisRef.current?.scrollTo(start + (end - start) * eased, { immediate: true }); if (progress >= 1) { clearInterval(tourTimer.current); tourTimer.current = null; } }, 16); };
  return <div className="experience"><AnimatePresence>{!ready && <Loader done={() => setReady(true)} />}</AnimatePresence><SignalField stage={active} /><div className="backdrop-wash" /><HUD active={active} tour={tour} /><Cursor /><main>
    <Scene id="hero" className="hero"><div className="hero-copy"><p className="eyebrow">NIKHIL MADIPADIGE / PERSONAL TECHNOLOGY PRACTICE</p><h1>AI systems, security tools, automation, and interactive worlds.</h1></div><button className="hero-play" onClick={tour}>◉<span>CLICK OR PRESS M TO TAKE THE TOUR</span></button></Scene>
    <Scene id="intro" className="intro"><Reveal><p>Ideas become useful when a person can touch, test, and trust them.</p></Reveal></Scene>
    <Scene id="burst" className="burst"><Reveal><h2>Make the<br /><span>first real version.</span></h2></Reveal></Scene>
    <Scene id="statement" className="statement"><Reveal><h2>Curious enough<br /><span>to build it.</span></h2><p>Computer Science student specializing in Cybersecurity, exploring AI agents, automation, computer vision, interactive web, and real-time 3D through hands-on work.</p></Reveal></Scene>
    <Scene id="list" className="list"><Reveal><h2>What I make<br /><span>useful systems<br />with atmosphere.</span></h2><div className="list-body"><strong>01<small>/03</small></strong><ul><li>AI agents</li><li>Security tools</li><li>Interactive worlds</li></ul></div></Reveal></Scene>
    <Scene id="projects" className="projects"><Reveal><h2>Selected<br /><span>work.</span></h2></Reveal><div className="project-stack">{projects.map((project, index) => <article className="project-card" key={project.slug} style={{ '--stack': index }}><div className="project-card-head"><span>{project.number}</span><small>{project.category}</small></div><h3>{project.title}</h3><div className="project-card-body"><div><p>{project.summary}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-card-links"><a data-cursor="CASE STUDY" href={`/work/${project.slug}`} onClick={(event) => { event.preventDefault(); navigate(`/work/${project.slug}`); }}>Case study →</a>{project.live && <a data-cursor="OPEN PROJECT" href={project.live} target="_blank" rel="noreferrer">Open project →</a>}</div></div><img src={project.image} alt={`${project.title} project visual`} /></div></article>)}</div></Scene>
    <Scene id="about-name" className="about-name"><img src={portrait} alt="Nikhil performing with a guitar" /><h2><span>Nikhil</span><span>Madipadige</span></h2></Scene>
    <Scene id="about-bio" className="about-bio"><Reveal><p>My work sits between a technical question and the visual surface that helps people understand it. I’m looking for freelance build sprints, collaborations, internships, and teams that want someone curious enough to take a first version seriously.</p><div className="about-links"><a href={resume}>Resume ↗</a><a href={github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></Reveal></Scene>
    <Scene id="contact" className="contact"><Reveal><h2>Let’s make the<br /><span>first version real.</span></h2><p>AI workflows, security prototypes, interactive websites, and ideas that need a technical partner.</p><a className="email" data-cursor="EMAIL" href={email}>madipadige.nikhil4u@gmail.com ↗</a><small>HYDERABAD, IN · WORLDWIDE</small></Reveal></Scene>
  </main></div>;
}

function DetailPage({ project, navigate }) { return <div className="detail-page"><a className="detail-back" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>← RETURN TO FIELD</a><span className="eyebrow">{project.number} / {project.category}</span><h1>{project.title}</h1><p>{project.summary}</p><img src={project.image} alt={`${project.title} project visual`} /><div className="detail-proof"><span>ROLE<strong>Builder / technical creative</strong></span><span>STACK<strong>{project.tags.join(' · ')}</strong></span><span>STATUS<strong>{project.live ? 'Live / source available' : 'Environment study'}</strong></span></div>{project.live && <a className="detail-link" href={project.live} target="_blank" rel="noreferrer">OPEN PROJECT ↗</a>}</div>; }
function AboutPage({ navigate }) { return <div className="detail-page"><a className="detail-back" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>← RETURN TO FIELD</a><span className="eyebrow">PROFILE / NIKHIL MADIPADIGE</span><h1>Curious enough<br /><span>to build it.</span></h1><img src={portrait} alt="Nikhil performing with a guitar" /><p>Computer Science student specializing in Cybersecurity, exploring AI agents, automation, computer vision, interactive web, and real-time 3D through hands-on work.</p><div className="detail-links"><a href={resume}>RESUME ↗</a><a href={github} target="_blank" rel="noreferrer">GITHUB ↗</a><a href={linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></div>; }
function ContactPage({ navigate }) { return <div className="detail-page"><a className="detail-back" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>← RETURN TO FIELD</a><span className="eyebrow">OPEN CHANNEL / CONTACT</span><h1>Let’s make the<br /><span>first version real.</span></h1><a className="email" href={email}>madipadige.nikhil4u@gmail.com ↗</a><p>AI workflows, security prototypes, interactive websites, and ideas that need a technical partner.</p></div>; }
function App() { const { path, navigate } = usePath(); const project = projects.find((item) => path === `/work/${item.slug}`); if (path === '/' || path === '/work') return <Experience navigate={navigate} />; if (project) return <DetailPage project={project} navigate={navigate} />; if (path === '/about') return <AboutPage navigate={navigate} />; return <ContactPage navigate={navigate} />; }

createRoot(document.getElementById('root')).render(<App />);
