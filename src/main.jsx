import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, Download, Github, Linkedin, Mail, MapPin, Menu, MoveUpRight, X } from 'lucide-react';
import './styles.css';

const portrait = '/assets/nikhil-portrait.webp';
const resume = '/assets/Nikhil-Madipadige-Resume.pdf';
const github = 'https://github.com/nikhilmadipadige';
const linkedin = 'https://www.linkedin.com/in/nikhil-madipadige/';
const email = 'mailto:madipadige.nikhil4u@gmail.com';

const projects = [
  { slug: 'shieldsense', number: '01', title: 'ShieldSense', kicker: 'SECURITY / AI AGENT', category: 'Security', accent: 'red', summary: 'A threat-investigation assistant that reads technical signals and human manipulation cues together, then recommends the safest next move.', tags: ['AI agent', 'URLhaus', 'ThreatFox'], live: 'https://shield-sense-mvp.vercel.app/' },
  { slug: 'voice-assistant', number: '02', title: 'SamurAI', kicker: 'PYTHON / CONVERSATIONAL', category: 'AI', accent: 'blue', summary: 'A Flask-based voice-interactive assistant with JSON command handling and a browser interface.', tags: ['Python', 'Flask', 'JSON'], live: 'https://github.com/nikhilmadipadige/SamurAI' },
  { slug: 'facial-expression', number: '03', title: 'Expression Lab', kicker: 'COMPUTER VISION / STREAMLIT', category: 'AI', accent: 'lime', summary: 'A real-time facial expression detection application with model switching, landmarks, confidence scores, and webcam analysis.', tags: ['FER', 'DeepFace', 'Webcam'], live: 'https://github.com/nikhilmadipadige/facial-expression-' },
  { slug: 'supernatural', number: '04', title: 'Supernatural / Scrolly', kicker: 'CREATIVE WEB / GSAP', category: 'Creative', accent: 'orange', summary: 'A cinematic scrollytelling experience built around narrative pacing, layered imagery, and responsive visual composition.', tags: ['GSAP', 'Story', 'Frontend'], live: 'https://github.com/nikhilmadipadige/supernatural-scrollyweb' },
  { slug: 'unreal', number: '05', title: 'Star Wars / Unreal', kicker: 'REAL-TIME 3D / CINEMA', category: 'Worlds', accent: 'violet', summary: 'A cinematic Unreal Engine 5 environment study exploring Lumen lighting, reflections, composition, and camera language.', tags: ['UE5', 'Lumen', 'Cinematics'], live: null },
];

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { const onPop = () => setPath(window.location.pathname); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const navigate = (to) => { if (!to || to.startsWith('http') || to.startsWith('mailto:')) return; window.history.pushState({}, '', to); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return { path, navigate };
}

function Art({ project, compact = false }) {
  const art = {
    shieldsense: <><img src="/assets/shieldsense-preview.webp" alt="ShieldSense interface" /><div className="art-scan" /><div className="art-orbit orbit-a" /><div className="art-orbit orbit-b" /><span className="art-stamp">THREAT / 02</span></>,
    'voice-assistant': <><div className="voice-orb" /><div className="voice-bars">{Array.from({ length: 13 }).map((_, i) => <i key={i} style={{ '--i': i }} />)}</div><span className="art-stamp">LISTEN / THINK / RESPOND</span></>,
    'facial-expression': <><div className="face-grid" /><div className="face-box" /><div className="face-scan" /><span className="face-label">EXPRESSION / HAPPY<br /><b>0.86 CONFIDENCE</b></span></>,
    supernatural: <><div className="scrolly-photo" /><div className="scrolly-word">STORY<br /><em>IN MOTION</em></div><span className="art-stamp">SCROLL / SEQUENCE</span></>,
    unreal: <><div className="unreal-sky" /><div className="unreal-sun" /><div className="unreal-ridge ridge-one" /><div className="unreal-ridge ridge-two" /><div className="unreal-floor" /><span className="art-stamp">LUMEN / 5.3</span></>,
  }[project.slug];
  return <div className={`project-art art-${project.accent} ${compact ? 'is-compact' : ''}`}>{art}</div>;
}

function SmartLink({ to, children, className = '', onClick, external = false }) {
  const isExternal = external || to?.startsWith('http') || to?.startsWith('mailto:');
  if (isExternal) return <a href={to} className={className} target={to?.startsWith('http') ? '_blank' : undefined} rel={to?.startsWith('http') ? 'noreferrer' : undefined}>{children}</a>;
  return <a href={to} className={className} onClick={(e) => { e.preventDefault(); onClick?.(to); }}>{children}</a>;
}

function Header({ navigate, onMenu }) {
  return <header className="heavy-header"><SmartLink to="/" onClick={navigate} className="heavy-logo"><span>NM</span><b>NIKHIL</b><i>/{' '}SYSTEMS</i></SmartLink><div className="header-center"><span>PORTFOLIO / 2026</span><span className="header-line" /><span>HYDERABAD → WORLDWIDE</span></div><div className="header-right"><span className="live-label"><i /> AVAILABLE FOR WORK</span><button className="header-menu" onClick={onMenu}><Menu size={20} /></button></div></header>;
}

function Rail({ navigate }) {
  return <aside className="heavy-rail"><div className="rail-index">INDEX / 00—05</div><div className="rail-monogram">NM</div><nav><SmartLink to="/" onClick={navigate}>INDEX <span>00</span></SmartLink><SmartLink to="/work" onClick={navigate}>WORK <span>05</span></SmartLink><SmartLink to="/about" onClick={navigate}>PROFILE <span>01</span></SmartLink><SmartLink to="/contact" onClick={navigate}>CONTACT <span>→</span></SmartLink></nav><div className="rail-portrait"><img src={portrait} alt="Nikhil" /><span>OPEN TO WORK</span></div><div className="rail-bottom"><a href={github} target="_blank" rel="noreferrer"><Github size={15} /></a><a href={linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} /></a><a href={email}><Mail size={15} /></a></div></aside>;
}

function Intro({ navigate }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  return <section ref={ref} className="heavy-intro"><div className="intro-noise" /><motion.div className="intro-copy" style={{ y }} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }}><span className="eyebrow">NIKHIL MADIPADIGE / COMPUTER SCIENCE + CYBERSECURITY</span><h1>Build<br /><em>the</em><br />signal.</h1><p>I make AI agents, security tools, and interactive worlds for people who want technology to feel less abstract.</p><div className="intro-actions"><SmartLink to="/work" onClick={navigate} className="heavy-button">ENTER THE WORK <ArrowDownRight size={18} /></SmartLink><SmartLink to="/contact" onClick={navigate} className="text-button">HIRE ME <ArrowUpRight size={16} /></SmartLink></div></motion.div><motion.div className="intro-object" style={{ y, rotate }} initial={{ opacity: 0, scale: .82, rotate: 8 }} animate={{ opacity: 1, scale: 1, rotate: 2 }} transition={{ duration: 1.2, delay: .15, ease: [.22, 1, .36, 1] }}><div className="object-shadow" /><img src={portrait} alt="Nikhil performing with a guitar" /><div className="object-copy"><span>01 / CREATOR</span><b>TECHNICAL<br />CURIOSITY</b></div><div className="object-line" /></motion.div><div className="intro-aside"><span>SCROLL TO MOVE</span><i /></div><div className="intro-corner">A PORTFOLIO FOR<br />PEOPLE WHO BUILD</div></section>;
}

function Marquee() { return <div className="heavy-marquee"><div>{Array.from({ length: 5 }).map((_, i) => <React.Fragment key={i}><span>AI AGENTS</span><b>×</b><span>SECURITY</span><b>×</b><span>INTERACTIVE WORLDS</span><b>×</b></React.Fragment>)}</div></div>; }

function ProjectCard({ project, index, navigate, onOpen }) {
  const x = useMotionValue(0); const y = useMotionValue(0); const sx = useSpring(x, { stiffness: 180, damping: 20 }); const sy = useSpring(y, { stiffness: 180, damping: 20 });
  return <motion.article className={`heavy-card card-${project.accent} ${index === 0 ? 'card-wide' : ''}`} layoutId={`card-${project.slug}`} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .04); y.set((e.clientY - r.top - r.height / 2) * .04); }} onPointerLeave={() => { x.set(0); y.set(0); }} whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }} onClick={() => onOpen(project)}><motion.div className="card-inner" style={{ x: sx, y: sy }}><Art project={project} /><div className="card-overlay" /><div className="card-top"><span>{project.number}</span><MoveUpRight size={19} /></div><div className="card-copy"><span>{project.kicker}</span><h3>{project.title}</h3><p>{project.summary}</p><div className="tag-row">{project.tags.map(tag => <b key={tag}>{tag}</b>)}</div></div></motion.div></motion.article>;
}

function WorkGrid({ navigate, onOpen }) {
  const [filter, setFilter] = useState('ALL');
  const filters = ['ALL', 'AI', 'SECURITY', 'CREATIVE', 'WORLDS'];
  const visible = projects.filter((p) => filter === 'ALL' || p.category.toUpperCase() === filter);
  return <section className="heavy-work" id="work"><div className="work-heading"><div><span className="eyebrow">SELECTED WORK / 05 OBJECTS</span><h2>Some things<br /><em>I made.</em></h2></div><p>Click into the work. Drag your attention around. Every build starts with a signal and ends with something tangible.</p></div><div className="filter-row">{filters.map((filterName) => <button key={filterName} className={filter === filterName ? 'active' : ''} onClick={() => setFilter(filterName)}>{filterName}</button>)}</div><motion.div layout className="heavy-grid">{visible.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} navigate={navigate} onOpen={onOpen} />)}</motion.div></section>;
}

function ProjectModal({ project, close, navigate }) {
  return <motion.div className="project-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}><motion.article className={`project-modal modal-${project.accent}`} layoutId={`card-${project.slug}`} onClick={(e) => e.stopPropagation()} initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}><button className="modal-close" onClick={close}><X size={22} /></button><div className="modal-visual"><Art project={project} /></div><div className="modal-info"><span className="eyebrow">{project.number} / {project.kicker}</span><h2>{project.title}</h2><p>{project.summary}</p><div className="modal-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="modal-actions"><SmartLink to={`/work/${project.slug}`} onClick={(to) => { close(); navigate(to); }} className="heavy-button">OPEN CASE STUDY <ArrowUpRight size={17} /></SmartLink>{project.live && <SmartLink to={project.live} external className="text-button">LIVE / SOURCE <ArrowUpRight size={16} /></SmartLink>}</div></div></motion.article></motion.div>;
}

function Home({ navigate, openProject }) { return <main><Intro navigate={navigate} /><Marquee /><WorkGrid navigate={navigate} onOpen={openProject} /><section className="heavy-statement"><span className="eyebrow">THE WORKING PRINCIPLE</span><h2>Make complex things<br /><em>feel obvious.</em></h2><SmartLink to="/contact" onClick={navigate} className="heavy-button">START A CONVERSATION <ArrowUpRight size={18} /></SmartLink></section></main>; }

function Work({ navigate, openProject }) { return <main className="work-page"><div className="page-intro"><span className="eyebrow">WORK / 05 OBJECTS</span><h1>Built for<br /><em>the real world.</em></h1><p>AI agents, threat intelligence, computer vision, cinematic web, and real-time 3D. Browse the experiments.</p></div><WorkGrid navigate={navigate} onOpen={openProject} /></main>; }

function About({ navigate }) { return <main className="text-page"><div className="page-intro"><span className="eyebrow">PROFILE / NIKHIL MADIPADIGE</span><h1>Curious by<br /><em>construction.</em></h1><p>I’m a Computer Science student specializing in Cybersecurity. I build at the intersection of intelligent systems, safety, and creative technology.</p></div><section className="about-heavy"><div className="about-photo"><img src={portrait} alt="Nikhil" /><span>HYDERABAD / INDIA</span></div><div className="about-copy"><span className="eyebrow">THE SHORT VERSION</span><h2>Give an idea<br /><em>a surface.</em></h2><p>I’m strongest in n8n and AI agents, and I’m comfortable moving from a technical idea to a working prototype with Python, Flask, Streamlit, frontend tools, and Unreal Engine.</p><p>I’m looking for freelance build sprints, collaborations, and internships where I can ship useful work quickly and keep learning in public.</p><div className="about-links"><SmartLink to={resume} external>RÉSUMÉ <Download size={15} /></SmartLink><SmartLink to={linkedin} external>LINKEDIN <ArrowUpRight size={15} /></SmartLink><SmartLink to={github} external>GITHUB <ArrowUpRight size={15} /></SmartLink></div></div></section></main>; }

function Contact() { return <main className="contact-heavy"><span className="eyebrow">CONTACT / OPEN CHANNEL</span><h1>Make something<br /><em>impossible to ignore.</em></h1><p>Have an AI workflow, security idea, or interactive experience that needs a first version? Send the signal.</p><SmartLink to={email} external className="contact-email">madipadige.nikhil4u@gmail.com <ArrowUpRight size={25} /></SmartLink><div className="contact-grid-heavy"><span>HYDERABAD / INDIA</span><span>AVAILABLE WORLDWIDE</span><span>RESPONSE / 24—48H</span></div></main>; }

function CaseStudy({ project, navigate }) { return <main className={`case-heavy case-${project.accent}`}><section className="case-top"><span className="eyebrow">{project.number} / {project.kicker}</span><h1>{project.title}</h1><p>{project.summary}</p><div className="case-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></section><section className="case-art-wrap"><Art project={project} /></section><section className="case-copy-heavy"><div><span className="eyebrow">THE READ</span><h2>Make the signal<br /><em>understandable.</em></h2></div><div><p>{project.summary} The project turns a technical idea into a visible, inspectable experience with a clear next action.</p><p>This build is part of a wider practice: explore a system, give it a human surface, then keep pushing until the interface has a point of view.</p>{project.live && <SmartLink to={project.live} external className="heavy-button">OPEN LIVE / SOURCE <ArrowUpRight size={18} /></SmartLink>}</div></section><SmartLink to="/work" onClick={navigate} className="case-back"><ArrowUpRight size={18} /> BACK TO WORK</SmartLink></main>; }

function App() {
  const { path, navigate } = usePath(); const [menu, setMenu] = useState(false); const [open, setOpen] = useState(null);
  const project = projects.find((p) => `/work/${p.slug}` === path);
  const view = path === '/' ? <Home navigate={navigate} openProject={setOpen} /> : path === '/work' ? <Work navigate={navigate} openProject={setOpen} /> : path === '/about' ? <About navigate={navigate} /> : path === '/contact' ? <Contact /> : project ? <CaseStudy project={project} navigate={navigate} /> : <Home navigate={navigate} openProject={setOpen} />;
  return <div className="app"><Header navigate={navigate} onMenu={() => setMenu(!menu)} /><Rail navigate={navigate} /><AnimatePresence>{menu && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}><SmartLink to="/" onClick={() => { setMenu(false); navigate('/'); }}>INDEX</SmartLink><SmartLink to="/work" onClick={() => { setMenu(false); navigate('/work'); }}>WORK</SmartLink><SmartLink to="/about" onClick={() => { setMenu(false); navigate('/about'); }}>PROFILE</SmartLink><SmartLink to="/contact" onClick={() => { setMenu(false); navigate('/contact'); }}>CONTACT</SmartLink></motion.div>}</AnimatePresence>{view}<AnimatePresence>{open && <ProjectModal project={open} close={() => setOpen(null)} navigate={navigate} />}</AnimatePresence><footer className="heavy-footer"><span>© 2026 / NIKHIL MADIPADIGE</span><span>BUILT WITH INTENT / MOTION</span><span><a href={email}>EMAIL</a> · <a href={github} target="_blank" rel="noreferrer">GITHUB</a></span></footer></div>;
}

createRoot(document.getElementById('root')).render(<App />);
