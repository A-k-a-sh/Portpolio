import React, { useState, useEffect, useRef } from 'react';
// Corrected imports for framer-motion utilities
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Menu, X, ChevronRight, Brain, Code, Palette, Smartphone } from 'lucide-react';

// Firebase imports (Placeholder for environment variables)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- CUSTOM HOOK FOR TILT AND GLOW EFFECT ---
const useTiltMotion = (ref) => {
    const x = useMotionValue(0.5); // Normalized X position (0 to 1)
    const y = useMotionValue(0.5); // Normalized Y position (0 to 1)

    // Ranges for tilt (increased intensity for visual appeal)
    const rotateXRange = [-12, 12];
    const rotateYRange = [12, -12]; // Inverse for a natural feel

    // Calculate rotation based on normalized cursor position (0 to 1)
    const rotateX = useTransform(y, [0, 1], rotateXRange, { clamp: true });
    const rotateY = useTransform(x, [0, 1], rotateYRange, { clamp: true });

    // Spring configuration for smooth motion (slightly stiffer for quick response)
    const springConfig = { damping: 12, stiffness: 180, mass: 0.1 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    // Custom box shadow transformation for glow on hover (center of the card is max glow)
    const shadow = useTransform(
        [x, y],
        [
            [0, 1],
            [0, 1],
        ],
        [
            '0 0 15px rgba(126, 34, 206, 0.2)', // Low glow edge
            '0 0 50px rgba(126, 34, 206, 0.7)', // Max glow center
            '0 0 15px rgba(126, 34, 206, 0.2)', // Low glow edge
        ],
        {
            clamp: true,
        }
    );
    const springShadow = useSpring(shadow, { stiffness: 100, damping: 15 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = ref.current;

        // Calculate position relative to the card, normalized to (0 to 1)
        const positionX = (clientX - offsetLeft) / offsetWidth;
        const positionY = (clientY - offsetTop) / offsetHeight;

        x.set(positionX);
        y.set(positionY);
    };

    const handleMouseLeave = () => {
        // Reset to center (0.5) to smoothly return to normal
        x.set(0.5);
        y.set(0.5);
    };

    return {
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        style: {
            transformStyle: "preserve-3d",
            perspective: 1000,
            rotateX: springRotateX,
            rotateY: springRotateY,
            boxShadow: springShadow,
            cursor: 'pointer',
            // The z-translation adds depth perception on tilt
            transform: 'translateZ(0px)',
        }
    };
};

const SkillOrb = ({ skill, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            style={{
                animation: `float 3s ease-in-out infinite ${index * 0.2}s`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`relative px-6 py-3 rounded-full border-2 border-purple-500/50 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm transition-all duration-300 cursor-pointer ${isHovered ? 'scale-110 shadow-2xl shadow-purple-500/50 border-purple-400' : ''}`}>
                <span className="text-white font-semibold">{skill}</span>
                {isHovered && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 animate-pulse" />
                )}
            </div>
        </div>
    );
};

const ProjectCard = ({ title, description, tags, link, github }) => {
    // 1. Create the ref
    const ref = useRef(null);
    // 2. Pass the ref to the tilt hook and get handlers/style
    const tiltProps = useTiltMotion(ref);

    return (
        <motion.div
            // 3. Attach the ref and the tilt handlers/style
            ref={ref}
            onMouseMove={tiltProps.onMouseMove}
            onMouseLeave={tiltProps.onMouseLeave}
            style={tiltProps.style}
            // Animation and base styles
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.1 }}
            className="relative group p-px rounded-xl transition-all duration-300 hover:border-transparent"
        >
            {/* Dynamic Glow Overlay (The visible border/glow effect on hover) */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

            {/* Card Content Layer */}
            <div className="relative bg-gray-900/90 p-6 rounded-xl border border-white/10 flex flex-col h-full transform translateZ(20px) backdrop-blur-sm">
                <div className="flex-grow">
                    <h3 className="text-2xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:from-blue-300 group-hover:to-cyan-300 transition-colors">
                        {title}
                    </h3>
                    <p className="text-gray-300 mb-4 text-base leading-relaxed">{description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50 group-hover:shadow-md group-hover:shadow-purple-700/30 transition-shadow">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-start gap-4 mt-4 pt-4 border-t border-gray-700/50">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors flex items-center group/link">
                        <ExternalLink size={20} className="mr-2" /> <span className="underline-offset-4 group-hover/link:underline">Live Demo</span>
                    </a>
                    <a href={github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors flex items-center group/link">
                        <Github size={20} className="mr-2" /> <span className="underline-offset-4 group-hover/link:underline">Source Code</span>
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

const SectionTitle = ({ children }) => (
    <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl sm:text-5xl font-extrabold mb-10 translate-z-0 text-center relative z-20"
    >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            {children}
        </span>
        {/* Decorative underline/wave */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-70" />
    </motion.h2>
);

// Education Card component for the timeline (Updated to use tilt)
const EducationCard = ({ degree, institution, years, description, gpa, index }) => {
    const isLeft = index % 2 === 0;

    // 1. Create the ref
    const ref = useRef(null);
    // 2. Pass the ref to the tilt hook and get handlers/style
    const tiltProps = useTiltMotion(ref);

    return (
        <motion.div
            // 3. Attach the ref and the tilt handlers/style
            ref={ref}
            onMouseMove={tiltProps.onMouseMove}
            onMouseLeave={tiltProps.onMouseLeave}
            style={tiltProps.style}
            // Animation: Slide in from left or right based on index
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className={`relative w-full sm:w-[calc(50%-24px)] p-6 bg-gray-800/70 rounded-xl border border-white/10 backdrop-blur-sm transition-colors duration-300 ${isLeft ? 'sm:mr-auto sm:text-left' : 'sm:ml-auto sm:text-right'} hover:border-purple-500/50`}
        >
            {/* Timeline Dot */}
            <div className={`absolute w-6 h-6 rounded-full bg-purple-600 border-4 border-gray-950 flex items-center justify-center top-6 z-10 
        ${isLeft
                    ? 'left-0 transform -translate-x-1/2 sm:left-[calc(100%+12px)] sm:translate-x-1/2'
                    : 'left-0 transform -translate-x-1/2 sm:left-[-12px] sm:-translate-x-1/2'
                }`}
            />

            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-1">{degree}</h3>
            <p className="text-lg font-semibold text-cyan-400 mb-2">{institution}</p>
            <p className="text-sm text-gray-400 mb-3">{years} <span className="text-gray-500">|</span> GPA: {gpa}</p>
            <p className="text-gray-300">{description}</p>
        </motion.div>
    );
};


const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mainRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: mainRef });
    const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    // State for global cursor tracking
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const navItems = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Education', href: '#education' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ];

    const education = [
        {
            degree: 'M.S. in Computer Science',
            institution: 'State University of Technology',
            years: '2018 - 2020',
            description: 'Focused on distributed systems and AI applications, culminating in a thesis on real-time data streaming architectures.',
            gpa: '4.0/4.0',
        },
        {
            degree: 'B.S. in Software Engineering',
            institution: 'City College of Engineering',
            years: '2014 - 2018',
            description: 'Concentrated on object-oriented programming, data structures, and algorithms. Completed a major project building a full-stack job board application.',
            gpa: '3.8/4.0',
        },
        {
            degree: 'AWS Certified Developer',
            institution: 'Amazon Web Services',
            years: '2022',
            description: 'Certified in developing and deploying cloud applications on AWS, demonstrating proficiency in core AWS services, development tools, and best practices.',
            gpa: 'N/A',
        },
    ];

    const skills = [
        'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js',
        'Express', 'PostgreSQL', 'MongoDB', 'Python', 'Docker', 'AWS',
        'GraphQL', 'Framer Motion', 'Git', 'Agile'
    ];

    const projects = [
        {
            title: 'AI Chatbot Platform',
            description: 'A scalable SaaS platform for custom AI chatbots, featuring secure user authentication, real-time context management, and a robust API for integration.',
            tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Vercel'],
            link: '#',
            github: '#',
        },
        {
            title: 'E-commerce API',
            description: 'A high-performance RESTful API supporting all e-commerce operations, including product catalog management, user carts, and payment gateway integration.',
            tags: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Jest'],
            link: '#',
            github: '#',
        },
        {
            title: 'Data Visualization Dashboard',
            description: 'An interactive dashboard built for internal analytics, providing real-time data metrics and customizable charts using D3.js.',
            tags: ['React', 'D3.js', 'Redux', 'MUI'],
            link: '#',
            github: '#',
        },
    ];

    // Simple form state
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', 'loading'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmissionStatus('loading');

        // Simulate API call
        setTimeout(() => {
            // In a real application, you would send formData to a backend endpoint here.
            console.log('Form Submitted:', formData);
            setSubmissionStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSubmissionStatus(null), 3000); // Clear status after 3 seconds
        }, 1500);
    };

    // Custom Hook for smooth scrolling to sections
    const scrollToSection = (id) => {
        const element = document.getElementById(id.substring(1));
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false); // Close menu after selection
    };

    // Custom loader component
    const Loader = () => (
        <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 rounded-full animate-pulse bg-pink-500"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-purple-500"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500"></div>
        </div>
    );


    return (
        <div ref={mainRef} className="min-h-screen bg-gray-950 text-white relative font-sans">

            {/* Global CSS for Animations */}
            <style>
                {`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes color-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .text-animated {
          background-size: 200% 200%;
          animation: color-shift 10s ease infinite;
        }
        /* Fix for scroll-padding to account for fixed header */
        html {
            scroll-behavior: smooth;
            scroll-padding-top: 5rem;
        }
        `}
            </style>

            {/* --- GLOBAL CURSOR GLOW EFFECT --- */}
            <motion.div
                className="fixed top-0 left-0 w-80 h-80 rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(126, 34, 206, 0.4) 0%, rgba(126, 34, 206, 0) 70%)',
                    filter: 'blur(60px)', // Slightly more blur
                    x: mousePosition.x - 160, // Centers the glow horizontally
                    y: mousePosition.y - 160, // Centers the glow vertically
                    opacity: 0.5, // Slightly more visible
                }}
            />
            {/* --- END CURSOR GLOW EFFECT --- */}


            {/* Background Sphere */}
            <motion.div
                className="fixed top-0 left-0 w-full h-full"
                style={{ perspective: 1000 }}
            >
                <motion.div
                    className="w-96 h-96 bg-purple-500/20 rounded-full blur-3xl absolute top-[10vh] left-[10vw]"
                    style={{ scale, y, opacity: 0.5 }}
                />
                <motion.div
                    className="w-80 h-80 bg-blue-500/20 rounded-full blur-3xl absolute bottom-[10vh] right-[10vw]"
                    style={{ scale, y, opacity: 0.5 }}
                />
            </motion.div>


            {/* Header & Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/70 border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo/Name */}
                    <a href="#home" onClick={() => scrollToSection('#home')} className="text-3xl font-extrabold tracking-tight z-50">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 text-animated">A.D.</span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 text-lg font-medium z-50">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                                className="text-gray-300 hover:text-purple-400 transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute left-0 bottom-[-5px] w-full h-0.5 bg-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </a>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white z-50 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-20 left-0 w-full bg-gray-800/95 backdrop-blur-xl border-t border-white/10 shadow-xl z-40"
                    >
                        <div className="flex flex-col p-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                                    className="py-3 px-4 text-white hover:bg-purple-600/20 transition-colors flex justify-between items-center rounded-lg border-b border-white/5 last:border-b-0"
                                >
                                    {item.name}
                                    <ChevronRight size={20} className="text-purple-400" />
                                </a>
                            ))}
                        </div>
                    </motion.nav>
                )}
            </header>

            <main className="pt-20 relative z-10">

                {/* Home/Hero Section */}
                <section id="home" className="min-h-[calc(100vh-80px)] flex items-center justify-center text-center px-4 py-20 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl sm:text-2xl text-purple-400 mb-4 font-medium"
                        >
                            Hi, my name is
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-4 leading-tight"
                        >
                            Alex <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Devlin</span>.
                        </motion.h1>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="text-3xl sm:text-4xl md:text-5xl text-gray-400 mb-8 font-semibold"
                        >
                            I build complex, scalable web applications.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-12"
                        >
                            A full-stack developer with a passion for modern JavaScript frameworks and cloud-native solutions. Let's create something amazing.
                        </motion.p>
                        <motion.a
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                            href="#contact"
                            onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg shadow-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.03] hover:shadow-purple-500/50"
                        >
                            Get In Touch <Mail size={20} className="ml-2" />
                        </motion.a>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <SectionTitle>About Me</SectionTitle>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true, amount: 0.2 }}
                                className="text-lg text-gray-300 space-y-6"
                            >
                                <p>Hello! I'm Alex Devlin, a dedicated full-stack engineer with over 5 years of professional experience designing and implementing highly performant web solutions. My journey in tech began with a curiosity for how systems work, which quickly evolved into a passion for building elegant, scalable, and resilient software.</p>
                                <p>I specialize in the modern web stack, primarily focusing on **React** and **TypeScript** for the frontend, coupled with **Node.js/Express** or **Next.js** for the backend. I have strong experience working with relational databases like **PostgreSQL** and NoSQL solutions like **MongoDB**.</p>
                                <p>My goal is to merge technical excellence with practical business needs, delivering solutions that are not just functional, but also provide an exceptional user experience. I thrive in collaborative environments and am always eager to learn new technologies and patterns.</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true, amount: 0.2 }}
                                className="relative flex justify-center"
                            >
                                <div className="w-64 h-64 sm:w-80 sm:h-80 relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-2xl animate-spin-slow" />
                                    {/* Placeholder image for a profile picture */}
                                    <img
                                        src="https://placehold.co/320x320/0f172a/9ca3af?text=Profile+Pic"
                                        alt="Alex Devlin Profile"
                                        className="relative w-full h-full object-cover rounded-2xl p-2 bg-gray-950 shadow-2xl border border-white/10"
                                    />
                                    <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 font-bold text-sm px-3 py-1 rounded-full shadow-lg transform rotate-6">
                                        Engineer
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Education Section (Timeline-style) */}
                <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/70 backdrop-blur-xl border-y border-white/10">
                    <div className="max-w-4xl mx-auto">
                        <SectionTitle>My Education</SectionTitle>
                        <div className="space-y-12 relative pb-4">
                            {/* Vertical Timeline Line (Only visible on small screens and up) */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-purple-700/50 hidden sm:block" />

                            {education.map((item, index) => (
                                // Wrapper div to handle responsive left/right alignment on desktop
                                <div
                                    key={index}
                                    className={`flex ${index % 2 === 0 ? 'justify-start sm:pr-4' : 'justify-end sm:pl-4'}`}
                                >
                                    <EducationCard {...item} index={index} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Skills Section */}
                <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-xl border-y border-white/10">
                    <div className="max-w-6xl mx-auto">
                        <SectionTitle>My Skills</SectionTitle>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
                            <SkillOrb skill="Frontend" icon={Palette} index={0} />
                            <SkillOrb skill="Backend" icon={Code} index={1} />
                            <SkillOrb skill="DevOps" icon={Brain} index={2} />
                            <SkillOrb skill="Mobile" icon={Smartphone} index={3} />
                        </div>

                        {/* Skills Grid */}
                        <div className="flex flex-wrap justify-center gap-6">
                            {skills.map((skill, index) => (
                                <SkillOrb key={skill} skill={skill} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <SectionTitle>Featured Projects</SectionTitle>
                        <div className="grid md:grid-cols-3 gap-8">
                            {projects.map((project, index) => (
                                <ProjectCard key={index} {...project} />
                            ))}
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-center mt-12"
                        >
                            <a
                                href="#"
                                className="inline-flex items-center text-lg font-medium text-purple-400 hover:text-purple-300 transition-colors group"
                            >
                                View All Projects
                                <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-xl border-t border-white/10">
                    <div className="max-w-3xl mx-auto">
                        <SectionTitle>Contact Me</SectionTitle>
                        <div className="bg-gray-800/70 p-8 rounded-xl border border-white/10 shadow-2xl">
                            <p className="text-gray-300 mb-6 text-center text-lg">
                                Have a project idea or just want to chat? Send me a message! I'm always open to new opportunities.
                            </p>

                            {submissionStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 mb-4 text-center text-green-400 bg-green-900/50 rounded-lg border border-green-700/50"
                                >
                                    Message sent successfully! Thank you.
                                </motion.div>
                            )}
                            {submissionStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 mb-4 text-center text-red-400 bg-red-900/50 rounded-lg border border-red-700/50"
                                >
                                    Failed to send message. Please try again later.
                                </motion.div>
                            )}

                            <motion.form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={submissionStatus === 'loading'}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-purple-500 transition-colors placeholder-gray-400"
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={submissionStatus === 'loading'}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-purple-500 transition-colors placeholder-gray-400"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        disabled={submissionStatus === 'loading'}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-purple-500 transition-colors placeholder-gray-400"
                                        placeholder="Your message..."
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={submissionStatus === 'loading'}
                                    className={`w-full px-8 py-3 rounded-lg font-semibold transition-all text-lg flex items-center justify-center ${submissionStatus === 'loading'
                                            ? 'bg-gray-500/50 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-blue-500/25'
                                        }`}
                                >
                                    {submissionStatus === 'loading' ? <Loader /> : 'Send Message'}
                                </motion.button>
                            </motion.form>
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="bg-gray-900/50 backdrop-blur-xl border-t border-white/10 py-12 text-center relative" style={{ zIndex: 1 }}>
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex justify-center gap-8 mb-6">
                            <a href="#" className="text-gray-400 hover:text-purple-400 transition-all transform hover:scale-125" aria-label="GitHub">
                                <Github size={28} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-all transform hover:scale-125" aria-label="LinkedIn">
                                <Linkedin size={28} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-pink-400 transition-all transform hover:scale-125" aria-label="Email">
                                <Mail size={28} />
                            </a>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Designed and Developed by Alex Devlin • Built with React and Tailwind CSS
                        </p>
                    </div>
                </footer>

            </main>
        </div>
    );
};

export default App;
