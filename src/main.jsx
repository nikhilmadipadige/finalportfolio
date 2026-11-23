import * as ReactModule from 'react';
import * as ReactDOMModule from 'react-dom/client';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import { ArrowDownRight, ArrowUpRight, Check, Download, Github, Linkedin, Mail, Menu, MoveUpRight, X } from 'lucide-react';
import SignalField from './SignalField';
import './styles.css';

const React = ReactModule.default?.default ?? ReactModule.default ?? ReactModule;
const ReactDOM = ReactDOMModule.default?.default ?? ReactDOMModule.default ?? ReactDOMModule;
const { useEffect, useRef, useState } = React;
const { createRoot } = ReactDOM;

const portrait = '/assets/nikhil-portrait.webp';
const resume = '/assets/Nikhil-Madipadige-Resume.pdf';
const github = 'https://github.com/nikhilmadipadige';
const linkedin = 'https://www.linkedin.com/in/nikhil-madipadige/';
const email = 'mailto:madipadige.nikhil4u@gmail.com';

const projects = [
  { slug: 'shieldsense', number: '01', title: 'ShieldSense', label: 'AI security agent', category: 'SECURITY', signal: 'shieldsense', summary: 'A threat-investigation assistant that checks uploaded data against URLhaus and ThreatFox, watches for manipulation signals, and recommends a safer next action.', tags: ['AI agent', 'URLhaus', 'ThreatFox'], live: 'https://shield-sense-mvp.vercel.app/', image: '/assets/shieldsense-preview.webp', outcome: 'Turns a messy security question into a clear, risk-aware decision.' },
  { slug: 'voice-assistant', number: '02', title: 'SamurAI', label: 'Voice assistant', category: 'AI / PYTHON', signal: 'voice-assistant', summary: 'A Flask-based voice-interactive assistant with JSON command handling and a browser interface for natural, task-oriented interaction.', tags: ['Python', 'Flask', 'JSON'], live: 'https://github.com/nikhilmadipadige/SamurAI', image: '/manus-storage/async-images/Ak2gNtyfDlrLXwY5FpYmpH/image-2.webp', outcome: 'A practical experiment in turning conversational intent into actions.' },
  { slug: 'facial-expression', number: '03', title: 'Expression Lab', label: 'Computer vision', category: 'AI / VISION', signal: 'facial-expression', summary: 'A real-time facial expression detection application with model switching, landmarks, confidence scores, and webcam analysis.', tags: ['FER', 'DeepFace', 'Webcam'], live: 'https://github.com/nikhilmadipadige/facial-expression-', image: '/manus-storage/async-images/Ak2gNtyfDlrLXwY5FpYmpH/image-3.webp', outcome: 'Makes a machine-learning prediction legible through a live visual surface.' },
  { slug: 'supernatural', number: '04', title: 'Supernatural / Scrolly', label: 'Interactive web', category: 'CREATIVE WEB', signal: 'supernatural', summary: 'A cinematic scrollytelling experience built around narrative pacing, layered imagery, and responsive visual composition.', tags: ['GSAP', 'Story', 'Frontend'], live: 'https://github.com/nikhilmadipadige/supernatural-scrollyweb', image: '/manus-storage/async-images/Ak2gNtyfDlrLXwY5FpYmpH/image-4.webp', outcome: 'Uses scroll as a storytelling instrument rather than a page-length constraint.' },
  { slug: 'unreal', number: '05', title: 'Star Wars / Unreal', label: 'Real-time 3D study', category: 'UNREAL ENGINE 5', signal: 'unreal', summary: 'A cinematic Unreal Engine 5 environment study exploring Lumen lighting, reflections, composition, and camera language.', tags: ['UE5', 'Lumen', 'Cinematics'], live: null, image: '/manus-storage/async-images/Ak2gNtyfDlrLXwY5FpYmpH/image-5.webp', outcome: 'A study in building atmosphere, depth, and a believable camera moment.' },
];

const capabilities = [
  { signal: 'capabilities', number: '01', title: 'AI systems', copy: 'I prototype agents and interfaces that make useful decisions visible, testable, and easier for people to trust.', tags: 'Agents / applied AI / evaluation' },
  { signal: 'capabilities', number: '02', title: 'Automation', copy: 'I connect tools and workflows with n8n so teams spend less time moving information between systems.', tags: 'n8n / integrations / operations' },
  { signal: 'shieldsense', number: '03', title: 'Security experiments', copy: 'I explore threat intelligence, manipulation signals, and safer actions through practical builds like ShieldSense.', tags: 'ThreatFox / URLhaus / risk thinking' },
  { signal: 'unreal', number: '04', title: 'Interactive worlds', copy: 'I build interfaces, scroll experiences, and real-time scenes that give technical ideas a memorable surface.', tags: 'Motion / frontend / Unreal Engine 5' },
];

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { const onPop = () => setPath(window.location.pathname); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const navigate = (to) => { if (!to || to.startsWith('http') || to.startsWith('mailto:')) return; window.history.pushState({}, '', to); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return { path, navigate };
}

function useLenis() {
  useEffect(() => { const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, wheelMultiplier: .88 }); let raf = 0; const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); return () => { cancelAnimationFrame(raf); lenis.destroy(); }; }, []);
}

function SmartLink({ to, children, className = '', onClick, external = false, ...props }) {
  const isExternal = external || to?.startsWith('http') || to?.startsWith('mailto:');
  if (isExternal) return <a href={to} className={className} target={to?.startsWith('http') ? '_blank' : undefined} rel={to?.startsWith('http') ? 'noreferrer' : undefined} {...props}>{children}</a>;
  return <a href={to} className={className} onClick={(event) => { event.preventDefault(); onClick?.(to); }} {...props}>{children}</a>;
}

function Header({ navigate, onMenu }) {
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, [0, 150], [0, 1]);
  const shadow = useTransform(progress, [0, 1], ['0 0 0 rgba(0,0,0,0)', '0 10px 30px rgba(0,0,0,.2)']);
  return <motion.header className="site-header" style={{ boxShadow: shadow }}><SmartLink to="/" onClick={navigate} className="brand"><strong>Nikhil Madipadige</strong><span>Cybersecurity / AI / Creative Technology</span></SmartLink><nav><SmartLink to="/" onClick={navigate}>Home</SmartLink><SmartLink to="/work" onClick={navigate}>Work</SmartLink><SmartLink to="/about" onClick={navigate}>About</SmartLink><SmartLink to="/contact" onClick={navigate}>Contact</SmartLink></nav><div className="header-availability"><i /> Open to work</div><button className="menu-toggle" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button></motion.header>;
}

function MobileMenu({ navigate, close }) { const links = [['/', 'Home'], ['/work', 'Work'], ['/about', 'About'], ['/contact', 'Contact']]; return <motion.div className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><button onClick={close}><X size={18} /></button>{links.map(([to, label]) => <SmartLink key={to} to={to} onClick={(path) => { close(); navigate(path); }}>{label}</SmartLink>)}</motion.div>; }

function Hero({ navigate }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const opacity = useTransform(scrollYProgress, [0, .7], [1, .25]);
  return <section ref={ref} className="hero section-anchor" data-signal="hero"><motion.div className="hero-copy" style={{ y, opacity }}><span className="kicker">NIKHIL MADIPADIGE / PERSONAL TECHNOLOGY PRACTICE</span><h1>I help ambitious<br /><em>ideas become</em><br />working systems.</h1><p className="hero-lede">AI agents, automation, cybersecurity, and interactive experiences — built from the messy first version to something your team can actually use.</p><div className="hero-actions"><SmartLink to="/work" onClick={navigate} className="button button-primary">See selected work <ArrowDownRight size={17} /></SmartLink><SmartLink to="/contact" onClick={navigate} className="button button-text">Start a conversation <ArrowUpRight size={16} /></SmartLink></div><div className="hero-proof"><span><b>Based in</b> Hyderabad, India</span><span><b>Focus</b> AI + cybersecurity</span><span><b>Now</b> building in public</span></div></motion.div><motion.div className="hero-orbit-label" initial={{ opacity: 0, rotate: -25 }} animate={{ opacity: 1, rotate: 0 }} transition={{ delay: .7, duration: 1.1 }}><span>01</span><b>MAKE THE<br />COMPLEX<br />VISIBLE</b></motion.div><div className="hero-scroll">Scroll to explore <ArrowDownRight size={14} /></div></section>;
}

function SectionHeader({ eyebrow, title, copy }) { return <div className="section-header"><span className="kicker">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>; }

function CapabilitySection() {
  return <section className="capabilities section-anchor" data-signal="capabilities"><SectionHeader eyebrow="WHAT I CAN HELP WITH" title={<>The thinking.<br /><em>The build.</em></>} copy="I work best with people who have a meaningful problem, an ambitious direction, and a willingness to make the first version real." /><div className="capability-list">{capabilities.map((item) => <motion.article key={item.number} className="capability-row" data-signal={item.signal} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}><span className="capability-number">{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p><b>{item.tags}</b><ArrowUpRight size={18} /></motion.article>)}</div></section>;
}

function SceneImage({ project }) { return <div className={`scene-image scene-${project.signal}`}><img src={project.image} alt={`${project.title} project visual`} /><div className="scene-image-overlay" /><span className="scene-image-label">{project.number} / {project.category}</span></div>; }

function ProjectChapter({ project, index, navigate, onOpen }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [55, -55]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [.2, 1]);
  return <section ref={ref} className={`project-chapter chapter-${project.signal} section-anchor`} data-signal={project.signal}><div className="chapter-index"><span>{project.number}</span><i /><span>{project.category}</span></div><div className="chapter-content"><motion.div className="chapter-copy" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .75, ease: [.22, 1, .36, 1] }}><span className="kicker">{project.label}</span><h2>{project.title}</h2><p>{project.summary}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="chapter-outcome"><span>What it proves</span><b>{project.outcome}</b></div><div className="chapter-actions">{project.live && <SmartLink to={project.live} external className="button button-primary">Open project <ArrowUpRight size={16} /></SmartLink>}<button type="button" className="button button-text" onClick={() => onOpen(project)}>View case study <MoveUpRight size={16} /></button></div></motion.div><motion.div className="chapter-visual" style={{ y: imageY }} initial={{ opacity: 0, scale: .94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .3 }} transition={{ duration: 1, ease: [.22, 1, .36, 1] }} onClick={() => onOpen(project)}><SceneImage project={project} /><div className="chapter-visual-caption"><span>SCROLL / {project.number}</span><span>INTERACTIVE STUDY</span></div></motion.div></div><motion.div className="chapter-progress" style={{ scaleX: lineScale }} /></section>;
}

function SelectedWork({ navigate, onOpen }) { return <section className="selected-work section-anchor" data-signal="shieldsense"><SectionHeader eyebrow="SELECTED WORK / REAL BUILDS" title={<>Things I’ve<br /><em>actually made.</em></>} copy="A few experiments across AI, security, computer vision, creative web, and real-time 3D. Each one started as a question and ended as something people can interact with." />{projects.map((project, index) => <ProjectChapter key={project.slug} project={project} index={index} navigate={navigate} onOpen={onOpen} />)}</section>; }

function Approach() { const steps = [['01', 'Frame the real problem', 'Start with the user, the constraint, and the decision the system needs to support.'], ['02', 'Make a useful first version', 'Prototype the smallest version that gives a team something concrete to react to.'], ['03', 'Push until it feels clear', 'Add the interaction, motion, and technical depth that make the result understandable and memorable.']]; return <section className="approach section-anchor" data-signal="approach"><SectionHeader eyebrow="HOW I WORK" title={<>Less theatre.<br /><em>More traction.</em></>} copy="I’m early in my career, which means I care about learning quickly, communicating clearly, and shipping something useful rather than pretending I know everything." /><div className="approach-list">{steps.map(([number, title, copy]) => <motion.div className="approach-step" key={number} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .65 }}><span>{number}</span><h3>{title}</h3><p>{copy}</p><Check size={16} /></motion.div>)}</div></section>; }

function CTA({ navigate }) { return <section className="final-cta section-anchor" data-signal="contact"><div><span className="kicker">HAVE A HARD PROBLEM OR A STRANGE IDEA?</span><h2>Bring me the<br /><em>messy first version.</em></h2><p>I can help you turn it into something your team can test, share, and improve.</p><SmartLink to="/contact" onClick={navigate} className="button button-primary">Let’s talk <ArrowUpRight size={17} /></SmartLink></div><div className="cta-aside"><span>nick@dev ~</span><b>ready when you are_</b></div></section>; }

function Home({ navigate, onOpen }) { return <main><Hero navigate={navigate} /><CapabilitySection /><SelectedWork navigate={navigate} onOpen={onOpen} /><Approach /><CTA navigate={navigate} /></main>; }

function ProjectModal({ project, close, navigate }) { return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}><motion.article className={`project-modal modal-${project.signal}`} initial={{ y: 40, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: .97 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={close} aria-label="Close"><X size={20} /></button><SceneImage project={project} /><div className="modal-details"><span className="kicker">{project.number} / {project.label}</span><h2>{project.title}</h2><p>{project.summary}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><SmartLink to={`/work/${project.slug}`} onClick={(path) => { close(); navigate(path); }} className="button button-primary">Read the case study <ArrowUpRight size={16} /></SmartLink></div></motion.article></motion.div>; }

function Work({ navigate, onOpen }) { return <main className="subpage"><div className="subpage-intro"><span className="kicker">SELECTED WORK / 05 BUILDS</span><h1>Work that makes<br /><em>the idea legible.</em></h1><p>A closer look at the AI, security, automation, visual, and 3D experiments that shape how I think.</p></div><SelectedWork navigate={navigate} onOpen={onOpen} /></main>; }

function About({ navigate }) { return <main className="subpage about-page"><div className="subpage-intro"><span className="kicker">ABOUT / NIKHIL MADIPADIGE</span><h1>Curious enough<br /><em>to build it.</em></h1><p>Computer Science student specializing in Cybersecurity, exploring AI agents, automation, computer vision, interactive web, and real-time 3D through hands-on work.</p></div><section className="about-grid"><div className="about-portrait"><img src={portrait} alt="Nikhil performing with a guitar" /><span>Hyderabad / India</span></div><div className="about-copy"><h2>Not a master of everything.<br /><em>Good at getting things done.</em></h2><p>My foundation started with Java and C++. Now I work mostly in Python, frontend tools, n8n, AI agents, and Unreal Engine. I like moving between a technical question and the visual surface that helps people understand it.</p><p>I’m looking for freelance build sprints, collaborations, internships, and teams that want someone curious enough to take a first version seriously.</p><div className="about-links"><SmartLink to={resume} external>Resume <Download size={15} /></SmartLink><SmartLink to={linkedin} external>LinkedIn <ArrowUpRight size={15} /></SmartLink><SmartLink to={github} external>GitHub <ArrowUpRight size={15} /></SmartLink></div></div></section><CTA navigate={navigate} /></main>; }

function Contact() { return <main className="contact-page section-anchor" data-signal="contact"><span className="kicker">CONTACT / OPEN CHANNEL</span><h1>Let’s make the<br /><em>first version real.</em></h1><p>For AI workflows, security prototypes, interactive websites, and ideas that need a technical partner.</p><a className="contact-email" href={email}>madipadige.nikhil4u@gmail.com <ArrowUpRight size={23} /></a><div className="contact-meta"><span>Hyderabad / India</span><span>Available worldwide</span><span>Response in 24—48h</span></div></main>; }

function CaseStudy({ project, navigate }) { return <main className={`case-page case-${project.signal}`}><div className="case-hero"><span className="kicker">{project.number} / {project.label}</span><h1>{project.title}</h1><p>{project.summary}</p><SceneImage project={project} /></div><section className="case-proof"><div><span>ROLE</span><b>Builder / creative technologist</b></div><div><span>STACK</span><b>{project.tags.join(' · ')}</b></div><div><span>STATUS</span><b>{project.live ? 'Live project / source available' : 'Environment study'}</b></div><div><span>OUTCOME</span><b>{project.outcome}</b></div></section><section className="case-read"><span className="kicker">THE READ</span><h2>Make the idea<br /><em>legible.</em></h2><p>{project.summary} I’m interested in the space between a powerful technical system and the human surface that makes it useful.</p>{project.live && <SmartLink to={project.live} external className="button button-primary">Open project <ArrowUpRight size={16} /></SmartLink>}</section><SmartLink to="/work" onClick={navigate} className="back-link"><ArrowUpRight size={16} /> Back to work</SmartLink></main>; }

function App() {
  useLenis();
  const { path, navigate } = usePath();
  const [menu, setMenu] = useState(false); const [open, setOpen] = useState(null); const [signal, setSignal] = useState('hero');
  const project = projects.find((item) => `/work/${item.slug}` === path);
  useEffect(() => { const nodes = [...document.querySelectorAll('[data-signal]')]; const observer = new IntersectionObserver((entries) => { const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (visible?.target?.dataset?.signal) setSignal(visible.target.dataset.signal); }, { threshold: [.12, .3, .6], rootMargin: '-18% 0px -22% 0px' }); nodes.forEach((node) => observer.observe(node)); return () => observer.disconnect(); }, [path]);
  const view = path === '/' ? <Home navigate={navigate} onOpen={setOpen} /> : path === '/work' ? <Work navigate={navigate} onOpen={setOpen} /> : path === '/about' ? <About navigate={navigate} /> : path === '/contact' ? <Contact /> : project ? <CaseStudy project={project} navigate={navigate} /> : <Home navigate={navigate} onOpen={setOpen} />;
  return <div className="app"><SignalField mode={signal} /><div className="site-layer"><Header navigate={navigate} onMenu={() => setMenu(true)} /><AnimatePresence>{menu && <MobileMenu navigate={navigate} close={() => setMenu(false)} />}</AnimatePresence>{view}<AnimatePresence>{open && <ProjectModal project={open} close={() => setOpen(null)} navigate={navigate} />}</AnimatePresence><footer className="site-footer"><span>© 2026 Nikhil Madipadige</span><span>Built with curiosity / Motion + Three.js</span><span><a href={email}>Email</a> · <a href={github} target="_blank" rel="noreferrer">GitHub</a> · <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a></span></footer></div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
