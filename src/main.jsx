import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  Radar,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  X,
} from 'lucide-react';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const portrait = '/assets/nikhil-portrait.webp';
const resume = '/assets/Nikhil-Madipadige-Resume.pdf';
const github = 'https://github.com/nikhilmadipadige';
const linkedin = 'https://www.linkedin.com/in/nikhil-madipadige/';
const email = 'mailto:madipadige.nikhil4u@gmail.com';

const projects = [
  {
    slug: 'shieldsense',
    number: '01',
    type: 'Flagship / Security agent',
    title: 'ShieldSense',
    summary: 'A threat-investigation assistant that reads technical signals and human manipulation cues together, then recommends the safest next move.',
    tags: ['AI agent', 'Threat intelligence', 'URLhaus', 'ThreatFox'],
    href: '/work/shieldsense',
    live: 'https://shield-sense-mvp.vercel.app/',
    accent: 'cyan',
  },
  {
    slug: 'voice-assistant',
    number: '02',
    type: 'Python / Conversational systems',
    title: 'SamurAI',
    summary: 'A Flask-based voice-interactive assistant with a web interface and JSON command handling for assistant-style interactions.',
    tags: ['Python', 'Flask', 'HTML', 'JSON'],
    href: '/work/voice-assistant',
    live: 'https://github.com/nikhilmadipadige/SamurAI',
    accent: 'violet',
  },
  {
    slug: 'facial-expression',
    number: '03',
    type: 'Computer vision / Streamlit',
    title: 'Expression Lab',
    summary: 'A real-time facial expression detection application with model switching, landmarks, confidence scores, and webcam analysis.',
    tags: ['Python', 'Streamlit', 'FER', 'DeepFace'],
    href: '/work/facial-expression',
    live: 'https://github.com/nikhilmadipadige/facial-expression-',
    accent: 'lime',
  },
  {
    slug: 'supernatural',
    number: '04',
    type: 'Creative technology / Frontend',
    title: 'Supernatural / Scrolly',
    summary: 'A cinematic scrollytelling experience using GSAP, layered imagery, narrative pacing, and responsive visual composition.',
    tags: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    href: '/work/supernatural',
    live: 'https://github.com/nikhilmadipadige/supernatural-scrollyweb',
    accent: 'amber',
  },
  {
    slug: 'unreal',
    number: '05',
    type: 'Real-time 3D / Environment design',
    title: 'Star Wars / Unreal',
    summary: 'A cinematic Unreal Engine 5 environment study exploring Lumen lighting, reflections, composition, and camera language.',
    tags: ['Unreal Engine 5', 'Lumen', 'Cinematics'],
    href: '/work/unreal',
    live: null,
    accent: 'blue',
  },
];

const capabilities = [
  ['AI agents', 'Designing assistants that can interpret context, call tools, and move work forward.'],
  ['Security thinking', 'Treating permissions, secrets, data handling, and failure modes as part of the build.'],
  ['Creative frontend', 'Turning technical ideas into clear, atmospheric interfaces people want to explore.'],
  ['Rapid prototypes', 'Shipping focused MVPs with Python, Streamlit, Flask, n8n, and modern web tooling.'],
];

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (to) => {
    if (!to || to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('#')) return;
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  return { path, navigate };
}

function useSmoothMotion(path) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.05,
    });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-reveal]', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.07, ease: 'power3.out' });
      gsap.utils.toArray('[data-scroll-reveal]').forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 34 }, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%', toggleActions: 'play none none reverse' },
        });
      });
      gsap.utils.toArray('[data-parallax]').forEach((element) => {
        gsap.to(element, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      gsap.utils.toArray('[data-line]').forEach((element) => {
        gsap.fromTo(element, { scaleX: 0 }, {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none reverse' },
        });
      });
      gsap.utils.toArray('[data-horizontal]').forEach((section) => {
        const track = section.querySelector('.reel-track');
        if (!track) return;
        if (window.innerWidth <= 780) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 72);
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1.05,
            invalidateOnRefresh: true,
          },
        });
      });
    });
    return () => ctx.revert();
  }, [path]);
}

function Cursor() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return undefined;
    const move = (event) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div className="cursor" aria-hidden="true"><span /><i /></div>;
}

function Link({ to, children, className = '', external = false, onClick }) {
  const isExternal = external || to?.startsWith('http') || to?.startsWith('mailto:') || to?.startsWith('#');
  const props = isExternal
    ? { href: to, ...(external && to?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {}) }
    : { href: to, onClick: (event) => { event.preventDefault(); onClick?.(to); } };
  return <a className={className} {...props}>{children}</a>;
}

function Header({ navigate }) {
  const [open, setOpen] = useState(false);
  const go = (to) => { setOpen(false); navigate(to); };
  return (
    <header className={`site-header ${open ? 'is-open' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="wordmark" onClick={go}>
          <span className="wordmark-mark">NM</span>
          <span className="wordmark-copy"><strong>Nikhil</strong><small>/ systems</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link to="/work" onClick={go}>Work</Link>
          <Link to="/about" onClick={go}>About</Link>
          <Link to="/contact" onClick={go}>Contact</Link>
        </nav>
        <div className="header-actions">
          <span className="availability"><span className="pulse-dot" /> Open for build sprints</span>
          <button className="menu-toggle" type="button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <Link to="/work" onClick={go}>Work <ArrowUpRight size={16} /></Link>
        <Link to="/about" onClick={go}>About <ArrowUpRight size={16} /></Link>
        <Link to="/contact" onClick={go}>Contact <ArrowUpRight size={16} /></Link>
      </nav>
    </header>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <div className="footer-wordmark">NIKHIL<span>.</span></div>
          <p>AI agents. Security tools.<br />Interfaces with a pulse.</p>
        </div>
        <div className="footer-cta">
          <span className="eyebrow">Have a hard problem?</span>
          <Link to="/contact" className="footer-link" onClick={navigate}>Let’s build something useful <ArrowUpRight size={18} /></Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Hyderabad, India / available worldwide</span>
        <div className="footer-socials">
          <a href={github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
          <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
          <a href={email}>Email <ArrowUpRight size={14} /></a>
        </div>
        <span>© {new Date().getFullYear()} NM Systems</span>
      </div>
    </footer>
  );
}

function Kicker({ children, icon: Icon = Sparkles }) {
  return <span className="kicker"><Icon size={14} /> {children}</span>;
}

function ButtonLink({ to, children, variant = 'primary', external = false, navigate }) {
  return <Link to={to} external={external} onClick={navigate} className={`button button-${variant}`}>
    {children} <ArrowUpRight size={16} />
  </Link>;
}

function ArrowLink({ to, children, external = false, navigate }) {
  return <Link to={to} external={external} onClick={navigate} className="arrow-link">{children}<ArrowUpRight size={15} /></Link>;
}

function Hero({ navigate }) {
  return (
    <section className="hero page-pad">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-meta" data-reveal>
            <Kicker icon={Radar}>AI / SECURITY / CREATIVE TECH</Kicker>
            <span className="hero-location">HYDERABAD, INDIA — 2026</span>
          </div>
          <h1 data-reveal>I build safer systems <em>with a creative edge.</em></h1>
          <p className="hero-lede" data-reveal>
            I’m Nikhil Madipadige — a cybersecurity student and AI automation builder creating agents, security tools, and interfaces that make complex technology easier to use.
          </p>
          <div className="hero-actions" data-reveal>
            <ButtonLink to="/work" navigate={navigate}>Explore the work</ButtonLink>
            <ButtonLink to="/contact" variant="ghost" navigate={navigate}>Start a project</ButtonLink>
          </div>
          <div className="hero-proof" data-reveal>
            <span>Strong in n8n + AI agents</span>
            <span className="proof-line" />
            <span>Building at the edge of security</span>
          </div>
        </div>
        <div className="hero-visual" data-reveal>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-portrait-wrap">
            <img src={portrait} alt="Nikhil Madipadige performing with a guitar" />
            <div className="portrait-glass"><span>BUILD / SHIP / LEARN</span><strong>01</strong></div>
          </div>
          <div className="hero-stamp"><span>NM</span><small>systems / studio</small></div>
          <div className="hero-side-note">SCROLL TO TRACE<br /><span>THE SIGNAL</span></div>
        </div>
      </div>
      <div className="hero-bottom" data-reveal>
        <span className="scroll-label"><ArrowDownRight size={16} /> Scroll to explore</span>
        <span className="hero-index">01 <i /> 05</span>
      </div>
    </section>
  );
}

function SignalSection() {
  return (
    <section className="signal-section page-pad" data-scroll-reveal>
      <div className="signal-intro">
        <Kicker icon={Workflow}>THE OPERATING SYSTEM</Kicker>
        <h2>From signal to <span>something useful.</span></h2>
      </div>
      <div className="signal-grid">
        <div className="signal-copy">
          <p className="large-copy">Good technology does more than detect a problem. It gives people enough context to make a better next move.</p>
          <p>I work across AI agents, cybersecurity, computer vision, frontend systems, and real-time 3D. The common thread is simple: build the thing, make it understandable, and leave it safer than you found it.</p>
        </div>
        <WorkflowDiagram />
      </div>
    </section>
  );
}

function WorkflowDiagram({ compact = false }) {
  return (
    <div className={`workflow ${compact ? 'workflow-compact' : ''}`}>
      <div className="workflow-label">NIKHIL / FLOW 001</div>
      <div className="workflow-track">
        <div className="workflow-node"><span>01</span><strong>INPUT</strong><small>message / data</small></div>
        <div className="workflow-connector"><i /></div>
        <div className="workflow-node active"><span>02</span><strong>AGENT</strong><small>reason / inspect</small></div>
        <div className="workflow-connector"><i /></div>
        <div className="workflow-node"><span>03</span><strong>ACTION</strong><small>safe next move</small></div>
      </div>
      <div className="workflow-foot"><span><span className="live-dot" /> SYSTEM READY</span><span>LOW FRICTION / HIGH SIGNAL</span></div>
    </div>
  );
}

function ProjectCard({ project, navigate, featured = false }) {
  return (
    <article className={`project-card project-${project.accent} ${featured ? 'project-featured' : ''}`} data-scroll-reveal>
      <div className="project-card-top">
        <span className="project-number">{project.number} / {project.type}</span>
        <span className="project-status"><span className="live-dot" /> BUILD LOG</span>
      </div>
      <div className="project-card-body">
        <div className="project-art" aria-hidden="true">
          {project.slug === 'shieldsense' ? <ShieldArt /> : null}
          {project.slug === 'voice-assistant' ? <VoiceArt /> : null}
          {project.slug === 'facial-expression' ? <FaceArt /> : null}
          {project.slug === 'supernatural' ? <ScrollyArt /> : null}
          {project.slug === 'unreal' ? <UnrealArt /> : null}
        </div>
        <div className="project-card-copy">
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          <div className="project-card-actions">
            <ArrowLink to={project.href} navigate={navigate}>Read the build log</ArrowLink>
            {project.live && <ArrowLink to={project.live} external>Live / source</ArrowLink>}
          </div>
        </div>
      </div>
    </article>
  );
}

function ShieldArt() {
  return <div className="shield-art"><img className="shield-live-image" src="/assets/shieldsense-preview.webp" alt="ShieldSense threat detection interface" /><div className="shield-rings"><span /><span /><span /></div><div className="shield-core"><ShieldCheck size={28} /><span>SAFE<br />MOVE</span></div><div className="signal-pill signal-top">THREAT TRACE <b>ACTIVE</b></div><div className="signal-pill signal-bottom">HUMAN SIGNAL <b>READ</b></div></div>;
}
function VoiceArt() {
  return <div className="voice-art"><div className="voice-wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="voice-command">“LISTEN / THINK / RESPOND”</div><div className="voice-orb"><Sparkles size={22} /></div></div>;
}
function FaceArt() {
  return <div className="face-art"><div className="face-grid" /><div className="face-brackets"><span /><span /><span /><span /></div><div className="face-scanline" /><div className="face-readout">EXPRESSION / HAPPY<br /><b>0.86 CONFIDENCE</b></div></div>;
}
function ScrollyArt() {
  return <div className="scrolly-art"><div className="scrolly-image" /><div className="scrolly-type">STORY<br /><em>IN MOTION</em></div><div className="scrolly-line" /></div>;
}
function UnrealArt() {
  return <div className="unreal-art"><div className="unreal-sun" /><div className="unreal-grid" /><div className="unreal-mountains" /><span className="unreal-caption">LUMEN / 5.3</span></div>;
}

function FeaturedWork({ navigate }) {
  return (
    <section className="work-preview page-pad">
      <div className="section-head" data-scroll-reveal>
        <div><Kicker icon={Terminal}>SELECTED BUILDS</Kicker><h2>Work with a point of view.</h2></div>
        <ArrowLink to="/work" navigate={navigate}>See all projects</ArrowLink>
      </div>
      <ProjectCard project={projects[0]} navigate={navigate} featured />
      <div className="project-grid">
        {projects.slice(1, 4).map(project => <ProjectCard key={project.slug} project={project} navigate={navigate} />)}
      </div>
      <div className="mini-build" data-scroll-reveal>
        <div><span className="eyebrow">ALSO IN THE LAB</span><strong>n8n workflows / Linux / networking / R&amp;D</strong></div>
        <span className="mini-build-note">The best work usually starts as a useful question.</span>
      </div>
    </section>
  );
}

function ConversionBand({ navigate }) {
  return (
    <section className="conversion-band page-pad" data-scroll-reveal>
      <div className="conversion-mark"><span>NM</span><i /></div>
      <div className="conversion-copy"><Kicker icon={Sparkles}>FOR PEOPLE BUILDING WHAT’S NEXT</Kicker><h2>Have a messy problem?<br /><em>Good. Let’s make it legible.</em></h2></div>
      <ButtonLink to="/contact" navigate={navigate}>Start a conversation</ButtonLink>
    </section>
  );
}

function ReelPanel({ project, navigate }) {
  return <Link to={project.href} onClick={navigate} className={`reel-panel reel-${project.accent}`}>
    <div className="reel-panel-art">{project.slug === 'shieldsense' ? <ShieldArt /> : project.slug === 'voice-assistant' ? <VoiceArt /> : project.slug === 'facial-expression' ? <FaceArt /> : project.slug === 'supernatural' ? <ScrollyArt /> : <UnrealArt />}</div>
    <div className="reel-panel-overlay" />
    <div className="reel-panel-meta"><span>{project.number} / {project.type}</span><ArrowUpRight size={18} /></div>
    <div className="reel-panel-copy"><h3>{project.title}</h3><p>{project.summary}</p><div className="tag-list">{project.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div></div>
    <span className="reel-panel-index">SCROLL / VIEW BUILD</span>
  </Link>;
}

function CinemaHome({ navigate }) {
  return <main className="cinema-home">
    <section className="cinema-hero page-pad">
      <div className="cinema-hero-copy" data-reveal><span className="cinema-overline">NIKHIL MADIPADIGE / 2026</span><h1>Ideas become<br /><em>real things.</em></h1><p>I build AI agents, security tools, and interactive experiences that make complex technology easier to understand and use.</p><div className="hero-actions"><ButtonLink to="/work" navigate={navigate}>View the reel</ButtonLink><ButtonLink to="/contact" variant="ghost" navigate={navigate}>Work with me</ButtonLink></div></div>
      <div className="cinema-portrait" data-reveal><img src={portrait} alt="Nikhil Madipadige performing with a guitar" /><div className="cinema-portrait-caption"><span>HYDERABAD / INDIA</span><strong>01</strong></div><div className="cinema-portrait-line" /></div>
      <div className="cinema-scroll-cue"><span>SCROLL</span><i /></div>
    </section>
    <section className="reel-section" data-horizontal>
      <div className="reel-intro page-pad"><div><span className="cinema-overline">SELECTED WORK / 05 BUILDS</span><h2>Make it work.<br /><em>Make it felt.</em></h2></div><p>Security, agents, computer vision, story, and real-time worlds — each project starts as a technical question and becomes something you can experience.</p></div>
      <div className="reel-pin"><div className="reel-track">{projects.map(project => <ReelPanel key={project.slug} project={project} navigate={navigate} />)}</div></div>
    </section>
    <section className="studio-section page-pad"><div className="studio-heading"><span className="cinema-overline">WHAT I CAN HELP SHIP</span><h2>Useful systems.<br /><em>Good atmosphere.</em></h2></div><div className="studio-services"><div><span>01</span><strong>AI workflows</strong><p>Agents and automations that connect input, reasoning, and action.</p></div><div><span>02</span><strong>Security prototypes</strong><p>Threat-aware tools that help people make a safer next move.</p></div><div><span>03</span><strong>Interactive web</strong><p>Interfaces, stories, and experiences with a point of view.</p></div></div></section>
    <ConversionBand navigate={navigate} />
  </main>;
}

function Home({ navigate }) {
  return <CinemaHome navigate={navigate} />;
}

function GalleryRow({ project, navigate }) {
  return <Link to={project.href} onClick={navigate} className={`gallery-row gallery-${project.accent}`}>
    <div className="gallery-row-number">{project.number}</div>
    <div className="gallery-row-copy"><span>{project.type}</span><h2>{project.title}</h2><p>{project.summary}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
    <div className="gallery-row-art">{project.slug === 'shieldsense' ? <ShieldArt /> : project.slug === 'voice-assistant' ? <VoiceArt /> : project.slug === 'facial-expression' ? <FaceArt /> : project.slug === 'supernatural' ? <ScrollyArt /> : <UnrealArt />}</div>
    <ArrowUpRight className="gallery-row-arrow" size={22} />
  </Link>;
}

function Work({ navigate }) {
  return <main className="inner-page gallery-page"><section className="page-hero page-pad"><span className="cinema-overline">WORK / 05 BUILDS</span><h1>A body of work<br /><em>in motion.</em></h1><p>AI agents, security tools, computer vision, cinematic web, and real-time worlds. Explore the systems, experiments, and interfaces behind each project.</p></section><section className="gallery-list page-pad">{projects.map(project => <GalleryRow key={project.slug} project={project} navigate={navigate} />)}</section><ConversionBand navigate={navigate} /></main>;
}

function CaseStudyLayout({ project, children, navigate }) {
  return <main className="inner-page case-study"><section className={`case-hero page-pad case-${project.accent}`}><div className="case-hero-top"><Kicker icon={project.slug === 'shieldsense' ? ShieldCheck : Terminal}>{project.type}</Kicker><span className="case-number">{project.number} / 05</span></div><h1>{project.title}</h1><p className="case-intro">{project.summary}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="case-hero-art">{project.slug === 'shieldsense' ? <ShieldArt /> : project.slug === 'voice-assistant' ? <VoiceArt /> : project.slug === 'facial-expression' ? <FaceArt /> : project.slug === 'supernatural' ? <ScrollyArt /> : <UnrealArt />}</div></section>{children}<section className="case-next page-pad"><span className="eyebrow">KEEP EXPLORING</span><div className="case-next-grid">{projects.filter(item => item.slug !== project.slug).slice(0, 2).map(item => <Link key={item.slug} to={item.href} onClick={navigate} className="next-card"><span>{item.number} / {item.type}</span><strong>{item.title}</strong><ArrowUpRight size={18} /></Link>)}</div></section></main>;
}

function ShieldSensePage({ navigate }) {
  const workflowSteps = [
    ['01', 'Receive', 'A user uploads a message, URL, or piece of data that deserves a closer look.'],
    ['02', 'Investigate', 'Technical indicators are extracted and checked against URLhaus and ThreatFox.'],
    ['03', 'Read context', 'The surrounding language is checked for pressure, impersonation, and manipulation signals.'],
    ['04', 'Recommend', 'The system translates the read into a calm, risk-aware next action.'],
  ];
  return <CaseStudyLayout project={projects[0]} navigate={navigate}>
    <section className="case-section page-pad case-two-col"><div><Kicker icon={Radar}>THE THESIS</Kicker><h2>One message.<br /><em>Two contexts.</em></h2></div><div className="case-copy"><p className="large-copy">A bad link is not the whole story.</p><p>ShieldSense is an AI-powered threat investigation assistant designed to read technical threat signals and human-manipulation signals together. It helps people understand what a message is doing, not just whether a URL has been reported before.</p><p>The goal is decision support: make the safest next move easier to see without pretending that an automated verdict replaces human judgment.</p></div></section>
    <section className="case-section page-pad"><div className="section-head"><div><Kicker icon={Workflow}>THE PIPELINE</Kicker><h2>From upload<br /><em>to safe move.</em></h2></div><span className="section-note">A calm path through a noisy signal.</span></div><div className="case-workflow">{workflowSteps.map(([num, title, text]) => <div className="case-step" key={num}><span>{num}</span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div></section>
    <section className="case-section page-pad evidence-section"><div className="evidence-panel"><div className="evidence-panel-head"><span>TECHNICAL TRACE</span><span className="live-dot" /></div><div className="evidence-row"><span>DOMAIN AGE</span><b>RECENT</b><i className="bar"><em style={{ width: '32%' }} /></i></div><div className="evidence-row"><span>REDIRECT CHAIN</span><b>03 HOPS</b><i className="bar"><em style={{ width: '71%' }} /></i></div><div className="evidence-row"><span>IDENTITY MATCH</span><b>LOW</b><i className="bar"><em style={{ width: '24%' }} /></i></div></div><div className="evidence-note"><Kicker icon={ShieldCheck}>RECOMMENDED ACTION / ELEVATED RISK</Kicker><h3>Pause the request.<br /><em>Verify independently.</em></h3><p>ShieldSense puts the evidence beside a clear next move so the user is not left with a scary score and no plan.</p><div className="action-list"><span><CheckCircle2 size={15} /> Do not open the link</span><span><CheckCircle2 size={15} /> Contact through a known channel</span><span><CheckCircle2 size={15} /> Report if needed</span></div></div></section>
    <section className="case-section page-pad case-two-col"><div><Kicker icon={Terminal}>SECURITY NOTES</Kicker><h2>Design the guardrails<br /><em>into the agent.</em></h2></div><div className="case-copy"><p>For a security-facing agent, a confident answer is not enough. The system needs clear boundaries around what it can inspect, what it can recommend, and what still requires a person.</p><div className="guardrail-list"><span><b>01</b> Minimize what gets stored.</span><span><b>02</b> Keep secrets outside the workflow.</span><span><b>03</b> Treat uploaded content as untrusted.</span><span><b>04</b> Require confirmation for irreversible actions.</span></div></div></section>
    <section className="case-cta page-pad"><div><Kicker icon={ExternalLink}>LIVE CONCEPT</Kicker><h2>See ShieldSense<br /><em>in its own habitat.</em></h2></div><ButtonLink to="https://shield-sense-mvp.vercel.app/" external>Open the live concept</ButtonLink></section>
  </CaseStudyLayout>;
}

function GenericCaseStudy({ project, navigate }) {
  const content = {
    'voice-assistant': {
      icon: Sparkles,
      thesis: ['Make the assistant', 'feel like a system.'],
      lead: 'A Flask prototype for conversational interaction, structured commands, and the small details that make a browser-based assistant feel responsive.',
      details: ['Python + Flask backend', 'HTML interface hosted on a local server', 'JSON-based command and response handling', 'Voice-oriented interaction model'],
      next: 'Connect the command layer to more useful tools and make the boundary between a spoken request and a safe action explicit.',
    },
    'facial-expression': {
      icon: ScanFace,
      thesis: ['Perception needs', 'a visible readout.'],
      lead: 'A Streamlit computer vision lab that makes model output inspectable: choose FER or DeepFace, turn the camera on, and see the signal with confidence and processing time.',
      details: ['Real-time webcam loop', 'FER and DeepFace model selection', 'Face detection and landmarks', 'Expression scores, confidence, and timing'],
      next: 'Add a stronger evaluation layer and make the responsible-use limitations as visible as the prediction itself.',
    },
    supernatural: {
      icon: Sparkles,
      thesis: ['A page can be', 'a moving image.'],
      lead: 'A cinematic web experience inspired by Supernatural, built around scroll pacing, layered imagery, cursor choreography, ambient grain, and GSAP timelines.',
      details: ['GSAP + ScrollTrigger animation', 'Responsive narrative sections', 'Layered image direction', 'Custom cursor and ambient texture'],
      next: 'Keep pushing the balance between spectacle and performance so the story feels immersive on every screen.',
    },
    unreal: {
      icon: Sparkles,
      thesis: ['Build the frame', 'before the shot.'],
      lead: 'A real-time 3D environment study in Unreal Engine 5, using Lumen lighting and cinematic camera composition to explore atmosphere and scale.',
      details: ['Unreal Engine 5 environment design', 'Lumen lighting and reflections', 'Cinematic camera shots', 'Real-time rendering exploration'],
      next: 'Turn the environment study into a short sequence with a clearer narrative arc, sound, and a more complete lighting breakdown.',
    },
  }[project.slug];
  const Icon = content.icon;
  return <CaseStudyLayout project={project} navigate={navigate}><section className="case-section page-pad case-two-col"><div><Kicker icon={Icon}>THE IDEA</Kicker><h2>{content.thesis[0]}<br /><em>{content.thesis[1]}</em></h2></div><div className="case-copy"><p className="large-copy">{content.lead}</p><p>This project is part of a wider practice: explore a technical idea, give it a usable surface, and document what the prototype taught me.</p></div></section><section className="case-section page-pad"><div className="section-head"><div><Kicker icon={Terminal}>WHAT’S INSIDE</Kicker><h2>The parts that<br /><em>make it real.</em></h2></div></div><div className="detail-grid">{content.details.map((detail, index) => <div className="detail-card" key={detail}><span>0{index + 1}</span><strong>{detail}</strong></div>)}</div></section><section className="case-section page-pad build-note"><div className="build-note-art">{project.slug === 'voice-assistant' ? <VoiceArt /> : project.slug === 'facial-expression' ? <FaceArt /> : project.slug === 'supernatural' ? <ScrollyArt /> : <UnrealArt />}</div><div className="case-copy"><Kicker icon={Workflow}>NEXT ITERATION</Kicker><h3>What I would build next.</h3><p>{content.next}</p>{project.live && <ButtonLink to={project.live} external variant="ghost">View source on GitHub</ButtonLink>}</div></section></CaseStudyLayout>;
}

function About({ navigate }) {
  return <main className="inner-page"><section className="page-hero page-pad about-hero"><div><Kicker icon={Sparkles}>ABOUT / NM SYSTEMS</Kicker><h1>Technical curiosity,<br /><em>with follow-through.</em></h1></div><div className="about-hero-image"><img src={portrait} alt="Nikhil Madipadige" /><span>MADE IN HYDERABAD</span></div></section><section className="about-story page-pad case-two-col"><div><Kicker icon={Radar}>THE SHORT VERSION</Kicker><h2>Build it.<br /><em>Understand it.</em></h2></div><div className="case-copy"><p className="large-copy">I’m a Computer Science student specializing in Cybersecurity, building at the intersection of intelligent systems, security, and creative technology.</p><p>I’m strongest in n8n and AI agents, and I’m comfortable moving from an idea to a working prototype with Python, Flask, Streamlit, frontend tools, and real-time 3D. I like projects that have a human on the other side of the interface and a clear reason to exist.</p><p>Right now I’m looking for freelance build sprints, collaborations, and internships where I can ship useful work quickly and keep learning in public.</p></div></section><section className="capability-section page-pad"><div className="section-head"><div><Kicker icon={Workflow}>WHAT I BRING</Kicker><h2>A broad toolkit.<br /><em>A clear filter.</em></h2></div></div><div className="capability-grid">{capabilities.map(([title, text], index) => <div className="capability-card" key={title} data-scroll-reveal><span>0{index + 1}</span><strong>{title}</strong><p>{text}</p></div>)}</div></section><section className="timeline-section page-pad"><div className="section-head"><div><Kicker icon={Terminal}>CURRENTLY</Kicker><h2>In the middle<br /><em>of the build.</em></h2></div></div><div className="timeline"><div><span>2026 → now</span><strong>B.Tech / Computer Science (Cyber Security)</strong><p>St. Peter’s Engineering College</p></div><div><span>Community</span><strong>R&amp;D Cell / Techfest, IIT Bombay</strong><p>Research-minded collaboration and outreach.</p></div><div><span>Next</span><strong>Freelance build sprints</strong><p>AI automation, security prototypes, and interactive sites.</p></div></div></section><ConversionBand navigate={navigate} /></main>;
}

function Contact({ navigate }) {
  return <main className="inner-page contact-page"><section className="page-hero page-pad"><Kicker icon={Mail}>CONTACT / BUILD WITH ME</Kicker><h1>Let’s make the<br /><em>hard thing clear.</em></h1><p>Have an automation that should exist, a security idea that needs a prototype, or a digital experience that needs more atmosphere? Send the signal.</p><div className="contact-actions"><ButtonLink to={email}>Email me directly</ButtonLink><ButtonLink to={resume} external variant="ghost">Download résumé <Download size={16} /></ButtonLink></div></section><section className="contact-grid page-pad"><div className="contact-panel"><span className="eyebrow">OPEN FOR</span><h2>Freelance projects<br /><em>& thoughtful collaborations.</em></h2><div className="contact-list"><a href={email}><Mail size={18} /><span>madipadige.nikhil4u@gmail.com</span><ArrowUpRight size={16} /></a><a href={linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /><span>linkedin.com/in/nikhil-madipadige</span><ArrowUpRight size={16} /></a><a href={github} target="_blank" rel="noreferrer"><Github size={18} /><span>github.com/nikhilmadipadige</span><ArrowUpRight size={16} /></a></div></div><div className="availability-card"><div className="availability-orbit"><span /><span /><span /></div><Kicker icon={Radar}>CURRENT SIGNAL</Kicker><strong>Available for focused build sprints.</strong><p>Best fit: AI automation, agent workflows, security-aware prototypes, and interactive frontend experiences.</p><span className="availability-code">STATUS / OPEN_01</span></div></section><section className="contact-bottom page-pad"><span>Good work starts with a clear first message.</span><Link to="/work" onClick={navigate}>See what I build <ArrowUpRight size={16} /></Link></section></main>;
}

function NotFound({ navigate }) {
  return <main className="inner-page"><section className="page-hero page-pad"><Kicker icon={Terminal}>404 / SIGNAL LOST</Kicker><h1>That route<br /><em>doesn’t exist.</em></h1><ButtonLink to="/" navigate={navigate}>Back to the signal</ButtonLink></section></main>;
}

function App() {
  const { path, navigate } = usePath();
  useSmoothMotion(path);
  const view = useMemo(() => {
    if (path === '/') return <Home navigate={navigate} />;
    if (path === '/work') return <Work navigate={navigate} />;
    if (path === '/about') return <About navigate={navigate} />;
    if (path === '/contact') return <Contact navigate={navigate} />;
    if (path === '/work/shieldsense') return <ShieldSensePage navigate={navigate} />;
    const project = projects.find(item => `/work/${item.slug}` === path);
    if (project) return <GenericCaseStudy project={project} navigate={navigate} />;
    return <NotFound navigate={navigate} />;
  }, [path, navigate]);
  return <><Cursor /><Header navigate={navigate} />{view}<Footer navigate={navigate} /></>;
}

createRoot(document.getElementById('root')).render(<App />);
