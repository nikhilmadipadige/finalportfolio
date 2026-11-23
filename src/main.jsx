import * as ReactModule from 'react';
import * as ReactDOMModule from 'react-dom/client';
import { AnimatePresence, motion } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import SignalField from './SignalField';
import './styles.css';

const React = ReactModule.default?.default ?? ReactModule.default ?? ReactModule;
const ReactDOM = ReactDOMModule.default?.default ?? ReactDOMModule.default ?? ReactDOMModule;
const { useEffect, useMemo, useRef, useState } = React;
const { createRoot } = ReactDOM;

const portrait = '/assets/nikhil-portrait.webp';
const resume = '/assets/Nikhil-Madipadige-Resume.pdf';
const github = 'https://github.com/nikhilmadipadige';
const linkedin = 'https://www.linkedin.com/in/nikhil-madipadige/';
const email = 'mailto:madipadige.nikhil4u@gmail.com';

const projects = [
  { slug: 'shieldsense', number: '01', title: 'ShieldSense', category: 'SECURITY / AI AGENT', stage: 2, state: 'security', summary: 'A threat-investigation agent that checks uploaded data against URLhaus and ThreatFox, watches for manipulation signals, and recommends a safer action.', tags: ['URLhaus', 'ThreatFox', 'risk analysis'], image: '/assets/shieldsense-preview.webp', live: 'https://shield-sense-mvp.vercel.app/' },
  { slug: 'voice-assistant', number: '02', title: 'SamurAI', category: 'VOICE / PYTHON', stage: 3, state: 'voice', summary: 'A Flask-based voice assistant that turns conversational intent into JSON commands and useful browser actions.', tags: ['Python', 'Flask', 'JSON'], image: '/manus-storage/async-images/Ak2gNtyfDlrLXwY5FpYmpH/image-2.webp', live: 'https://github.com/nikhilmadipadige/SamurAI' },
  { slug: 'facial-expression', number: '03', title: 'Expression Lab', category: 'VISION / REAL-TIME', stage: 4, state: 'vision', summary: 'A webcam and image analysis surface for facial expressions, landmarks, confidence scores, and model comparison.', tags: ['FER', 'DeepFace', 'webcam'], image: '/manus-storage/async-images/Ak2gNtyfDlrLXwY5FpYmpH/image-3.webp', live: 'https://github.com/nikhilmadipadige/facial-expression-' },
  { slug: 'supernatural', number: '04', title: 'Supernatural / Scrolly', category: 'CREATIVE WEB / GSAP', stage: 5, state: 'scrolly', summary: 'A cinematic scrollytelling experiment where pacing, image, and transition become the interface.', tags: ['GSAP', 'story', 'frontend'], image: '/manus-storage/async-images/Ak2gNtyfDlrLXwY5FpYmpH/image-4.webp', live: 'https://github.com/nikhilmadipadige/supernatural-scrollyweb' },
  { slug: 'unreal', number: '05', title: 'Star Wars / Unreal', category: 'REAL-TIME 3D / UE5', stage: 6, state: 'unreal', summary: 'A cinematic environment study exploring Lumen light, reflections, camera language, and atmosphere in Unreal Engine 5.', tags: ['UE5', 'Lumen', 'cinematics'], image: '/manus-storage/async-images/Ak2gNtyfDlrLXwY5FpYmpH/image-5.webp', live: null },
];

const stages = [
  { id: 'intro', label: 'ORIGIN', eyebrow: 'NIKHIL MADIPADIGE / PERSONAL TECHNOLOGY PRACTICE', title: <>Ideas<br /><span>made physical.</span></>, copy: 'AI systems, security tools, automation, and interactive worlds — built as working experiments, not promises.', state: 'origin' },
  { id: 'practice', label: 'SIGNAL', eyebrow: '01 / A POINT OF VIEW', title: <>I build the<br /><span>first real version.</span></>, copy: 'The useful part is where a vague idea becomes something a person can touch, test, and trust.', state: 'practice' },
  ...projects.map((project) => ({ id: project.slug, label: project.number, eyebrow: project.category, title: <>{project.title}</>, copy: project.summary, state: project.state, project })),
  { id: 'contact', label: 'OPEN CHANNEL', eyebrow: '08 / CONTACT', title: <>Bring the<br /><span>messy version.</span></>, copy: 'For a build sprint, an unusual interface, or a system that needs a more human surface.', state: 'contact' },
];

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true, syncTouch: false, wheelMultiplier: 0.76 });
    let raf = 0;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { const onPop = () => setPath(window.location.pathname); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const navigate = (to) => {
    if (!to || to.startsWith('http') || to.startsWith('mailto:')) return;
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return { path, navigate };
}

function useStageCount() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const height = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = window.scrollY / height;
      setActive(Math.min(stages.length - 1, Math.max(0, Math.round(progress * (stages.length - 1)))));
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { if (frame) cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return active;
}

function SmartLink({ to, children, className = '', onClick, ...props }) {
  const external = to?.startsWith('http') || to?.startsWith('mailto:');
  if (external) return <a href={to} className={className} target={to.startsWith('http') ? '_blank' : undefined} rel={to.startsWith('http') ? 'noreferrer' : undefined} {...props}>{children}</a>;
  return <a href={to} className={className} onClick={(event) => { event.preventDefault(); onClick?.(to); }} {...props}>{children}</a>;
}

function Loader({ done }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (time) => {
      const next = Math.min(100, Math.round(((time - start) / 1250) * 100));
      setCount(next);
      if (next < 100) frame = requestAnimationFrame(tick); else setTimeout(done, 180);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [done]);
  return <motion.div className="loader" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}><div className="loader-mark">n</div><div className="loader-foot"><span>INITIALISING / NIKHIL MADIPADIGE</span><b>{String(count).padStart(3, '0')}%</b></div></motion.div>;
}

function Frame({ active, menu, setMenu, navigate, onIndex }) {
  const current = stages[active];
  return <>
    <header className="frame-header">
      <SmartLink to="/" onClick={navigate} className="wordmark"><span className="wordmark-mark">n</span><span>NIKHIL MADIPADIGE</span></SmartLink>
      <div className="frame-status"><i /> <span>BUILDING / IN PUBLIC</span></div>
      <button className="index-trigger" onClick={onIndex} aria-label="Open project index">INDEX <span>({String(active + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')})</span></button>
    </header>
    <div className="frame-corner frame-corner-left"><span>HYDERABAD / INDIA</span><span>24° 34' N / 73° 42' E</span></div>
    <div className="frame-corner frame-corner-right"><span>{current.label}</span><span>SCENE / {current.state.toUpperCase()}</span></div>
    <div className="frame-progress"><span style={{ transform: `scaleY(${(active + 1) / stages.length})` }} /></div>
    <div className="frame-bottom"><span>SCROLL TO MOVE THROUGH THE SYSTEM</span><span className="frame-key">M / INDEX</span></div>
    <AnimatePresence>{menu && <motion.div className="index-panel" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}><button className="index-close" onClick={() => setMenu(false)}>CLOSE / ×</button><div className="index-title"><small>SYSTEM INDEX</small><strong>Move through<br /><em>the work.</em></strong></div><nav>{stages.map((stage, index) => <button key={stage.id} onClick={() => { setMenu(false); window.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' }); }} className={index === active ? 'is-active' : ''}><span>{String(index + 1).padStart(2, '0')}</span><b>{stage.label}</b><i>{stage.state}</i></button>)}</nav><div className="index-links"><SmartLink to="/about" onClick={navigate}>Profile</SmartLink><SmartLink to="/contact" onClick={navigate}>Contact</SmartLink><a href={github} target="_blank" rel="noreferrer">GitHub ↗</a></div></motion.div>}</AnimatePresence>
  </>;
}

function StageContent({ stage, index, navigate }) {
  const project = stage.project;
  return <section className={`scene-stage scene-stage-${stage.state}`} data-stage-index={index}>
    <div className="stage-copy">
      <motion.div key={`${stage.id}-copy`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.5, once: false }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
        <span className="stage-eyebrow">{stage.eyebrow}</span>
        <h1>{stage.title}</h1>
        <p>{stage.copy}</p>
        {index === 0 && <div className="stage-actions"><button className="micro-button" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>ENTER THE FIELD <span>↓</span></button><span className="stage-note">A CONTINUOUS PORTFOLIO / 2026</span></div>}
        {index === 1 && <div className="signal-list"><span><b>01</b> frame the problem</span><span><b>02</b> make a useful system</span><span><b>03</b> make it feel inevitable</span></div>}
        {project && <div className="project-meta"><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-links">{project.live && <a href={project.live} target="_blank" rel="noreferrer">OPEN PROJECT ↗</a>}<SmartLink to={`/work/${project.slug}`} onClick={navigate}>CASE STUDY ↗</SmartLink></div></div>}
        {index === stages.length - 1 && <div className="contact-actions"><a className="contact-address" href={email}>madipadige.nikhil4u@gmail.com ↗</a><div><SmartLink to="/about" onClick={navigate}>PROFILE ↗</SmartLink><a href={linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></div>}
      </motion.div>
    </div>
    {project && <motion.div className="project-evidence" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.45, once: false }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}><img src={project.image} alt={`${project.title} evidence`} /><span>{project.number} / EVIDENCE FRAME</span></motion.div>}
    {index === 1 && <div className="practice-note"><span>WHAT I MAKE</span><b>Agents / automation<br />security / atmosphere</b></div>}
  </section>;
}

function ImmersiveExperience({ navigate }) {
  const active = useStageCount();
  const [indexOpen, setIndexOpen] = useState(false);
  const [ready, setReady] = useState(false);
  useLenis();
  useEffect(() => { const onKey = (event) => { if (event.key.toLowerCase() === 'm') setIndexOpen((value) => !value); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, []);
  return <div className="immersive-app"><AnimatePresence>{!ready && <Loader done={() => setReady(true)} />}</AnimatePresence><SignalField stage={active} /><div className="scene-vignette" /><Frame active={active} menu={indexOpen} setMenu={setIndexOpen} navigate={navigate} onIndex={() => setIndexOpen(true)} /><main className="scene-track">{stages.map((stage, index) => <StageContent key={stage.id} stage={stage} index={index} navigate={navigate} />)}</main></div>;
}

function DetailPage({ project, navigate }) {
  return <div className="detail-page"><div className="detail-shell"><SmartLink to="/" onClick={navigate} className="detail-back">← RETURN TO FIELD</SmartLink><span className="stage-eyebrow">{project.number} / {project.category}</span><h1>{project.title}</h1><p>{project.summary}</p><img src={project.image} alt={`${project.title} project visual`} /><div className="detail-proof"><span>ROLE<strong>Builder / technical creative</strong></span><span>STACK<strong>{project.tags.join(' · ')}</strong></span><span>STATUS<strong>{project.live ? 'Live / source available' : 'Environment study'}</strong></span></div>{project.live && <a className="micro-button" href={project.live} target="_blank" rel="noreferrer">OPEN PROJECT ↗</a>}</div></div>;
}

function AboutPage({ navigate }) {
  return <div className="detail-page"><div className="detail-shell about-shell"><SmartLink to="/" onClick={navigate} className="detail-back">← RETURN TO FIELD</SmartLink><span className="stage-eyebrow">PROFILE / NIKHIL MADIPADIGE</span><h1>Curious enough<br /><em>to build it.</em></h1><div className="about-layout"><img src={portrait} alt="Nikhil performing with a guitar" /><div><p>Computer Science student specializing in Cybersecurity, exploring AI agents, automation, computer vision, interactive web, and real-time 3D through hands-on work.</p><p>My work sits between a technical question and the visual surface that helps people understand it. I’m looking for freelance build sprints, collaborations, internships, and teams that want someone curious enough to take a first version seriously.</p><div className="detail-links"><a href={resume}>RESUME ↓</a><a href={github} target="_blank" rel="noreferrer">GITHUB ↗</a><a href={linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></div></div></div></div>;
}

function ContactPage({ navigate }) { return <div className="detail-page contact-detail"><div className="detail-shell"><SmartLink to="/" onClick={navigate} className="detail-back">← RETURN TO FIELD</SmartLink><span className="stage-eyebrow">OPEN CHANNEL / CONTACT</span><h1>Let’s make the<br /><em>first version real.</em></h1><a className="contact-address" href={email}>madipadige.nikhil4u@gmail.com ↗</a><p>AI workflows, security prototypes, interactive websites, and ideas that need a technical partner.</p><span className="detail-location">HYDERABAD / INDIA — AVAILABLE WORLDWIDE</span></div></div>; }

function App() {
  const { path, navigate } = usePath();
  const project = projects.find((item) => path === `/work/${item.slug}`);
  const page = path === '/' || path === '/work' ? <ImmersiveExperience navigate={navigate} /> : project ? <DetailPage project={project} navigate={navigate} /> : path === '/about' ? <AboutPage navigate={navigate} /> : <ContactPage navigate={navigate} />;
  return page;
}

createRoot(document.getElementById('root')).render(<App />);
