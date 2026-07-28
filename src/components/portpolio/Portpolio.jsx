import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    num: '01',
    year: '2025 · ML / GENERATIVE',
    title: 'Diffusion Model Fine-tuning (DDPM)',
    desc: 'Fine-tuned pretrained DDPM UNet on a custom butterflies dataset. Implemented DDIM sampling, gradient accumulation, and torchvision preprocessing for improved efficiency and quality.',
    tags: ['PyTorch', 'Hugging Face', 'DDPM', 'DDIM'],
    category: 'ML'
  },
  {
    num: '02',
    year: '2025 · GANs',
    title: 'DCGAN Face Generation (CelebA)',
    desc: 'Built DCGAN to generate photorealistic faces from 200k+ CelebA images. Addressed mode collapse and training stability through architectural adjustments and regularization.',
    tags: ['PyTorch', 'GANs', 'Deep Conv'],
    category: 'ML'
  },
  {
    num: '03',
    year: '2024 · COMPUTER VISION',
    title: 'Video Action Recognition (UCF101)',
    desc: 'Implemented R(2+1)D model with transfer learning from Kinetics-400 on UCF101 dataset, achieving strong performance in temporal action classification.',
    tags: ['PyTorch', 'R(2+1)D', 'OpenCV', '3D CNN'],
    category: 'ML'
  },
  {
    num: '04',
    year: '2024 · HEALTHCARE ML',
    title: 'Heart Disease Prediction System',
    desc: 'Built and compared multiple classifiers on clinical data. Achieved 85–90% accuracy, providing reliable predictive insights for medical diagnostics.',
    tags: ['scikit-learn', 'pandas', 'NumPy'],
    category: 'ML'
  },
  {
    num: '05',
    year: '2024 · FULL-STACK',
    title: 'E-Commerce Platform',
    desc: 'Developed complete platform with product listing, cart, and checkout. Integrated SSLCommerz for secure payments and designed scalable REST APIs.',
    tags: ['React', 'Node.js', 'MySQL', 'SSLCommerz'],
    category: 'Devops/Fullstack'
  },
  {
    num: '06',
    year: '2023 · SOCIAL',
    title: 'Social Media Web App',
    desc: 'Built platform with user authentication, post creation, and infinite scrollable feeds. Leveraged Appwrite BaaS and TanStack Query for efficient caching and real-time updates.',
    tags: ['React', 'Appwrite', 'TanStack'],
    category: 'Devops/Fullstack'
  },
  {
    num: '07',
    year: '2023 · REAL-TIME',
    title: 'Real-Time Messaging App',
    desc: 'Developed robust chat app supporting one-on-one and group messaging. Implemented WebSocket communication via Socket.io for low-latency interactions.',
    tags: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    category: 'Devops/Fullstack'
  }
];

export default function Portpolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [activeSection, setActiveSection] = useState('hero');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [bootLines, setBootLines] = useState([]);
  
  const loaderRef = useRef(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const problemsRef = useRef(null);
  const projectsRef = useRef(null);

  // Custom Cursor mouse coordinates
  const mouseRef = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Holographic Loader Counter & Console Log
  useEffect(() => {
    let start = 0;
    const end = 100;
    const duration = 1600;
    const range = end - start;
    const increment = 1;
    const stepTime = Math.abs(Math.floor(duration / range));

    const timer = setInterval(() => {
      start += increment;
      setLoadingProgress(start);

      if (start === 5) {
        setBootLines(prev => [...prev, '> INITIALIZING INTERFACE SYSTEM...']);
      } else if (start === 25) {
        setBootLines(prev => [...prev, '> SYNAPSE DEPLOYED NOMINAL...']);
      } else if (start === 50) {
        setBootLines(prev => [...prev, '> LOADED ML NETWORKS & DEVOPS...']);
      } else if (start === 75) {
        setBootLines(prev => [...prev, '> PORTAL SECURITY MATRIX STABLE...']);
      } else if (start === 95) {
        setBootLines(prev => [...prev, '> FUTURISTIC PORTFOLIO ONLINE.']);
      }

      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // 1. Initial Loader Fade Out and Hero Animation Trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          opacity: 0,
          visibility: 'hidden',
          duration: 0.6,
          onComplete: () => {
            setIsLoading(false);
            animateHero();
          }
        });
      }
    }, 1700);

    return () => clearTimeout(timer);
  }, []);

  // Hero entrance animation
  const animateHero = () => {
    gsap.to('.hero h1 .line span', {
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.15
    });
    gsap.fromTo('.hero-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
    gsap.fromTo('.hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.8 });
    gsap.fromTo('.hero-cta', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 1 });
  };

  // Scroll Spy Intersection Observer
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'research', 'education', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // 2. Custom Cursor Lerp Loop & Hover State Delegation
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const mouse = mouseRef.current;

    const handleMouseMove = (e) => {
      mouse.mx = e.clientX;
      mouse.my = e.clientY;
      if (dot) {
        dot.style.left = mouse.mx + 'px';
        dot.style.top = mouse.my + 'px';
      }
    };

    let animId;
    const animCursor = () => {
      mouse.rx += (mouse.mx - mouse.rx) * 0.15;
      mouse.ry += (mouse.my - mouse.ry) * 0.15;
      if (ring) {
        ring.style.left = mouse.rx + 'px';
        ring.style.top = mouse.ry + 'px';
      }
      animId = requestAnimationFrame(animCursor);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .project, .skill-card, .research-item, .ach, .tilt');
      if (target) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    animCursor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 3. Canvas Particles Background System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    let resizeAnimId;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        c: Math.random() > 0.5 ? '124,92,255' : '0,224,255'
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},.6)`;
        ctx.fill();
      });

      // connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,92,255,${0.15 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      resizeAnimId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(resizeAnimId);
    };
  }, []);

  // 4. GSAP Parallax Orbs & Scroll Reveal Animations
  useEffect(() => {
    // Create GSAP context scope for simple reversion
    let ctx = gsap.context(() => {
      // Parallax Orbs
      gsap.to('.orb-1', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        },
        y: 400,
        x: 200
      });

      gsap.to('.orb-2', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        },
        y: -300,
        x: -150
      });

      gsap.to('.orb-3', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        },
        y: 200,
        x: -200
      });

      // Scroll Reveal
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Stats Counter animation on scroll trigger
      const statsObj = { problems: 0, projects: 0 };
      gsap.to(statsObj, {
        problems: 300,
        projects: 7,
        duration: 2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          if (problemsRef.current) {
            problemsRef.current.innerText = Math.floor(statsObj.problems) + '+';
          }
          if (projectsRef.current) {
            projectsRef.current.innerText = Math.floor(statsObj.projects) + '+';
          }
        }
      });
    });

    return () => ctx.revert();
  }, []);

  // 5. Active Tab change triggers ScrollTrigger refresh
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [activeTab]);

  // 6. Hero Parallax on Mouse Move
  const handleHeroMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    gsap.to('.orb-1', { x: x * 2, y: y * 2, duration: 1 });
    gsap.to('.orb-2', { x: -x * 2, y: -y * 2, duration: 1 });
  };

  // 7. Tilt Effect Handler
  const handleTiltMouseMove = (e) => {
    if (window.innerWidth <= 768) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    const rx = ((y - cy) / cy) * -6;
    const ry = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  };

  const handleTiltMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  };

  // 8. Magnetic Button Handler
  const handleMagneticMouseMove = (e) => {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMagneticMouseLeave = (e) => {
    const btn = e.currentTarget;
    btn.style.transform = 'translate(0, 0)';
  };

  // 9. Smooth Scrolling navigation clicks
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Loader */}
      <div className="loader" id="loader" ref={loaderRef}>
        <div className="loader-spinner">
          <div className="spinner-ring outer"></div>
          <div className="spinner-ring inner"></div>
          <div className="spinner-core">{loadingProgress}%</div>
        </div>
        <div className="loader-text" style={{ letterSpacing: '4px', marginBottom: '8px' }}>
          INITIALIZING // SAA.2026
        </div>
        <div className="loader-terminal">
          {bootLines.slice(-3).map((line, idx) => (
            <div key={idx} className="terminal-line">{line}</div>
          ))}
        </div>
      </div>

      {/* Custom cursor */}
      <div className="cursor-dot" id="cursorDot" ref={dotRef}></div>
      <div
        className={`cursor-ring ${isHovered ? 'hover' : ''}`}
        id="cursorRing"
        ref={ringRef}
      ></div>

      {/* Background */}
      <div className="bg-grid"></div>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <canvas id="particles" ref={canvasRef}></canvas>
      <div className="grain"></div>

      {/* Navigation */}
      <nav>
        <div className="logo">SAA.</div>
        <div className="links">
          <a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={(e) => scrollToSection(e, 'about')}>About</a>
          <a href="#skills" className={activeSection === 'skills' ? 'active' : ''} onClick={(e) => scrollToSection(e, 'skills')}>Skills</a>
          <a href="#projects" className={activeSection === 'projects' ? 'active' : ''} onClick={(e) => scrollToSection(e, 'projects')}>Work</a>
          <a href="#research" className={activeSection === 'research' ? 'active' : ''} onClick={(e) => scrollToSection(e, 'research')}>Research</a>
          <a href="#education" className={activeSection === 'education' ? 'active' : ''} onClick={(e) => scrollToSection(e, 'education')}>Journey</a>
          <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero" ref={heroRef} onMouseMove={handleHeroMouseMove}>
        <div className="container">
          <div className="hero-tag">
            <span className="dot"></span>Available for opportunities · 2026
          </div>
          <h1>
            <div className="line">
              <span>Shahad Abir</span>
            </div>
            <div className="line">
              <span className="grad">Akash.</span>
            </div>
            <div className="line">
              <span
                style={{
                  fontSize: '.45em',
                  color: 'var(--muted)',
                  fontWeight: '400',
                  letterSpacing: '0'
                }}
              >
                Full-Stack Engineer · ML Developer · Systems Thinker
              </span>
            </div>
          </h1>
          <div className="hero-sub">
            <p>
              Computer Science undergraduate at{' '}
              <strong style={{ color: 'var(--ink)' }}>CUET</strong>, crafting
              real-time systems, diffusion models, and cloud-native applications. I
              turn complex problems into elegant, performant software.
            </p>
            <div className="meta">
              <span>// LOCATION</span>Chittagong, Bangladesh
              <br />
              <span>// STATUS</span>Expected Grad 2027
              <br />
              <span>// FOCUS</span>Full-Stack · ML · DevOps
            </div>
          </div>
          <div className="hero-cta">
            <button
              className="btn btn-primary magnetic"
              onClick={(e) => scrollToSection(e, 'projects')}
              onMouseMove={handleMagneticMouseMove}
              onMouseLeave={handleMagneticMouseLeave}
            >
              <span>Explore Work →</span>
            </button>
            <button
              className="btn btn-ghost magnetic"
              onClick={(e) => scrollToSection(e, 'contact')}
              onMouseMove={handleMagneticMouseMove}
              onMouseLeave={handleMagneticMouseLeave}
            >
              <span>Get in Touch</span>
            </button>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-track">
          <span className="filled">REACT</span>
          <span>•</span>
          <span>NODE.JS</span>
          <span>•</span>
          <span className="filled">PYTORCH</span>
          <span>•</span>
          <span>SOCKET.IO</span>
          <span>•</span>
          <span className="filled">DOCKER</span>
          <span>•</span>
          <span>DIFFUSION</span>
          <span>•</span>
          <span className="filled">GAN</span>
          <span>•</span>
          <span>MICROSERVICES</span>
          <span>•</span>
          <span className="filled">REACT</span>
          <span>•</span>
          <span>NODE.JS</span>
          <span>•</span>
          <span className="filled">PYTORCH</span>
          <span>•</span>
          <span>SOCKET.IO</span>
          <span>•</span>
          <span className="filled">DOCKER</span>
          <span>•</span>
          <span>DIFFUSION</span>
          <span>•</span>
          <span className="filled">GAN</span>
          <span>•</span>
          <span>MICROSERVICES</span>
          <span>•</span>
        </div>
      </div>

      {/* About Section */}
      <section id="about">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-num">// 01 — ABOUT</div>
              <h2 className="section-title">
                Building the <span className="grad">future</span>,
                <br />
                one commit at a time.
              </h2>
            </div>
          </div>
          <div className="about-grid">
            <div className="about-text reveal">
              <p>
                I'm a <strong>motivated Computer Science undergraduate</strong> at
                Chittagong University of Engineering & Technology with a passion
                for building systems that scale. From real-time chat apps to
                diffusion-based image synthesis, I love working at the
                intersection of <strong>engineering and research</strong>.
              </p>
              <p>
                My toolkit spans the full stack —{' '}
                <strong>React, Node.js, Socket.io</strong> for blazing-fast web
                apps; <strong>PyTorch & scikit-learn</strong> for ML pipelines;
                and <strong>Docker, Nginx, CI/CD</strong> for cloud-native
                deployments. I'm currently exploring{' '}
                <strong>generative models, LLMs, and distributed systems</strong>.
              </p>
              <p>
                When I'm not coding, you'll find me solving LeetCode puzzles,
                competing in hackathons, or volunteering with Lions Club
                Chittagong.
              </p>
            </div>
            <div
              className="about-card reveal tilt"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <div className="card-sys">// PROFILE.SYS</div>
              <h3 className="card-name">Shahad Abir Akash</h3>
              <p className="card-sub">CS Undergrad · CUET</p>
              <div className="about-stats">
                <div className="stat">
                  <div className="num" ref={problemsRef}>0+</div>
                  <div className="lbl">Problems Solved</div>
                </div>
                <div className="stat">
                  <div className="num" ref={projectsRef}>0+</div>
                  <div className="lbl">Projects Shipped</div>
                </div>
                <div className="stat">
                  <div className="num">5.0</div>
                  <div className="lbl">HSC GPA</div>
                </div>
                <div className="stat">
                  <div className="num">∞</div>
                  <div className="lbl">Curiosity</div>
                </div>
              </div>
              <div className="card-actions">
                <a href="/cv and resume/CV_Akash.pdf" download="CV_Akash.pdf" className="btn-card primary">
                  <span>Download CV</span>
                </a>
                <a href="/cv and resume/cv_latex.pdf" download="CV_Akash_Resume.pdf" className="btn-card ghost">
                  <span>Download Resume</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-num">// 02 — ARSENAL</div>
              <h2 className="section-title">
                Tech <span className="grad">stack</span>.
              </h2>
            </div>
          </div>
          <div className="skills-wrap">
            <div
              className="skill-card reveal tilt"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <h3>
                <span className="ico">⌘</span>Languages
              </h3>
              <div className="skill-list">
                <span>C</span>
                <span>C++</span>
                <span>JavaScript</span>
                <span>Python</span>
                <span>Bash</span>
              </div>
            </div>
            <div
              className="skill-card reveal tilt"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <h3>
                <span className="ico">◈</span>Frontend
              </h3>
              <div className="skill-list">
                <span>React</span>
                <span>React Native</span>
                <span>HTML5</span>
                <span>CSS3</span>
                <span>TanStack Query</span>
              </div>
            </div>
            <div
              className="skill-card reveal tilt"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <h3>
                <span className="ico">⚡</span>Backend & Real-time
              </h3>
              <div className="skill-list">
                <span>Node.js</span>
                <span>Express.js</span>
                <span>Socket.io</span>
                <span>REST APIs</span>
                <span>Microservices</span>
              </div>
            </div>
            <div
              className="skill-card reveal tilt"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <h3>
                <span className="ico">◉</span>Databases
              </h3>
              <div className="skill-list">
                <span>MySQL</span>
                <span>MongoDB</span>
                <span>Appwrite</span>
                <span>NoSQL</span>
              </div>
            </div>
            <div
              className="skill-card reveal tilt"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <h3>
                <span className="ico">☁</span>DevOps & Cloud
              </h3>
              <div className="skill-list">
                <span>Docker</span>
                <span>Nginx</span>
                <span>CI/CD</span>
                <span>Cloud Deploy</span>
                <span>Microservices</span>
              </div>
            </div>
            <div
              className="skill-card reveal tilt"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <h3>
                <span className="ico">◐</span>Monitoring
              </h3>
              <div className="skill-list">
                <span>Prometheus</span>
                <span>Grafana</span>
                <span>ELK Stack</span>
                <span>Kibana</span>
                <span>Jaeger</span>
              </div>
            </div>
            <div
              className="skill-card reveal tilt"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <h3>
                <span className="ico">✦</span>ML / Data
              </h3>
              <div className="skill-list">
                <span>PyTorch</span>
                <span>scikit-learn</span>
                <span>NumPy</span>
                <span>pandas</span>
                <span>Hugging Face</span>
              </div>
            </div>
            <div
              className="skill-card reveal tilt"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <h3>
                <span className="ico">⌬</span>Tools
              </h3>
              <div className="skill-list">
                <span>Git</span>
                <span>GitHub</span>
                <span>Linux</span>
                <span>Agile</span>
                <span>Debugging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work Section */}
      <section id="projects">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-num">// 03 — SELECTED WORK</div>
              <h2 className="section-title">
                Things I've <span className="grad">built</span>.
              </h2>
            </div>
          </div>

          {/* Project Filtering Tabs */}
          <div className="project-tabs">
            <button
              className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`}
              onClick={() => setActiveTab('All')}
            >
              All
            </button>
            <button
              className={`tab-btn ${activeTab === 'ML' ? 'active' : ''}`}
              onClick={() => setActiveTab('ML')}
            >
              ML
            </button>
            <button
              className={`tab-btn ${activeTab === 'Devops/Fullstack' ? 'active' : ''}`}
              onClick={() => setActiveTab('Devops/Fullstack')}
            >
              Devops/Fullstack
            </button>
          </div>

          <div className="projects">
            {projectsData.map((p) => {
              const isHidden = activeTab !== 'All' && p.category !== activeTab;
              return (
                <div
                  key={p.num}
                  className={`project reveal tilt ${isHidden ? 'hide' : ''}`}
                  onMouseMove={handleTiltMouseMove}
                  onMouseLeave={handleTiltMouseLeave}
                >
                  <div className="project-num">{p.num}</div>
                  <div>
                    <div className="project-year">{p.year}</div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                  <div className="project-tags">
                    {p.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-num">// 04 — RESEARCH INTERESTS</div>
              <h2 className="section-title">
                What I'm <span className="grad">exploring</span>.
              </h2>
            </div>
          </div>
          <div className="research-grid">
            <div className="research-item reveal">
              <h4>Generative Models</h4>
              <p>
                Diffusion-based image synthesis and novel sampling strategies
                for high-fidelity generation.
              </p>
            </div>
            <div className="research-item reveal">
              <h4>Large Language Models</h4>
              <p>
                Training, fine-tuning, and optimization techniques for modern LLM
                architectures.
              </p>
            </div>
            <div className="research-item reveal">
              <h4>Distributed Systems</h4>
              <p>
                WebSocket architectures and scalable backend systems for real-time
                applications.
              </p>
            </div>
            <div className="research-item reveal">
              <h4>Cloud-Native Apps</h4>
              <p>
                Microservices, containerization, and resilient cloud-native
                application design.
              </p>
            </div>
            <div className="research-item reveal">
              <h4>DevOps Architecture</h4>
              <p>
                CI/CD pipelines, observability, and infrastructure as code for
                production systems.
              </p>
            </div>
            <div className="research-item reveal">
              <h4>Algorithms & DS</h4>
              <p>
                Advanced data structures, competitive programming, and
                algorithmic problem solving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Journey Section */}
      <section id="education">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-num">// 05 — JOURNEY</div>
              <h2 className="section-title">
                The <span className="grad">path</span>.
              </h2>
            </div>
          </div>
          <div className="timeline">
            <div className="tl-item reveal">
              <div className="year">2022 — 2027 (EXPECTED)</div>
              <h4>B.Sc. in Computer Science</h4>
              <div className="place">
                Chittagong University of Engineering & Technology (CUET)
              </div>
              <div className="desc">
                Core focus on algorithms, systems, AI/ML, and software
                engineering. Active in hackathons and open-source contributions.
              </div>
            </div>
            <div className="tl-item reveal">
              <div className="year">2021</div>
              <h4>HSC — Science</h4>
              <div className="place">
                Gov. Hazi Muhammad Mohsin College · GPA: 5.0
              </div>
              <div className="desc">
                Excelled in higher secondary education with a strong foundation in
                mathematics and physics.
              </div>
            </div>
            <div className="tl-item reveal">
              <div className="year">2019</div>
              <h4>SSC — Science</h4>
              <div className="place">Khaja Ajmery High School · GPA: 5.0</div>
              <div className="desc">
                Perfect academic record. First exposure to programming and
                competitive problem solving.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-num">// 06 — RECOGNITION</div>
              <h2 className="section-title">
                Milestones & <span className="grad">wins</span>.
              </h2>
            </div>
          </div>
          <div className="achievements">
            <div className="ach reveal">
              <div className="ic">⚡</div>
              <p>
                Solved <strong style={{ color: 'var(--ink)' }}>300+ problems</strong>{' '}
                on LeetCode and other online platforms.
              </p>
            </div>
            <div className="ach reveal">
              <div className="ic">🏆</div>
              <p>
                Participated in regional{' '}
                <strong style={{ color: 'var(--ink)' }}>
                  Bangladesh Physics & Math Olympiad
                </strong>
                .
              </p>
            </div>
            <div className="ach reveal">
              <div className="ic">⚙</div>
              <p>
                Microservices Architecture{' '}
                <strong style={{ color: 'var(--ink)' }}>
                  Hackathon participant
                </strong>
                .
              </p>
            </div>
            <div className="ach reveal">
              <div className="ic">🎯</div>
              <p>
                Multiple{' '}
                <strong style={{ color: 'var(--ink)' }}>hackathon finalist</strong>{' '}
                across various domains.
              </p>
            </div>
            <div className="ach reveal">
              <div className="ic">♥</div>
              <p>
                Active member of{' '}
                <strong style={{ color: 'var(--ink)' }}>
                  Lions Club Chittagong
                </strong>{' '}
                — community service & outreach.
              </p>
            </div>
            <div className="ach reveal">
              <div className="ic">✦</div>
              <p>
                Maintainer of multiple{' '}
                <strong style={{ color: 'var(--ink)' }}>open-source</strong> GitHub
                repositories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-num" style={{ textAlign: 'center', marginBottom: '20px' }}>
            // 07 — LET'S CONNECT
          </div>
          <h2>
            Got a wild idea?
            <br />
            <span className="grad">Let's build it.</span>
          </h2>
          <p>
            I'm currently seeking internship or junior software engineer roles.
            Whether you have a project, a question, or just want to say hi — my
            inbox is always open.
          </p>
          <button
            className="btn btn-primary magnetic"
            onClick={() => (window.location.href = 'mailto:u2104035@student.cuet.ac.bd')}
            onMouseMove={handleMagneticMouseMove}
            onMouseLeave={handleMagneticMouseLeave}
          >
            <span>Send me an email →</span>
          </button>
          <div className="contact-links">
            <a href="tel:+8801828511380">☏ +880 18285 11380</a>
            <a href="https://github.com/A-k-a-sh" target="_blank" rel="noreferrer">
              ⎇ GitHub
            </a>
            <a href="https://linkedin.com/in/abir-akash-564360334" target="_blank" rel="noreferrer">
              ✦ LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>© 2026 SHAHAD ABIR AKASH — ALL SYSTEMS NOMINAL</div>
        <div>CRAFTED WITH ♥ & LOTS OF COFFEE</div>
      </footer>
    </>
  );
}
