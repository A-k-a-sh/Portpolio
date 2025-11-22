import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Menu, X, ChevronRight, Brain, Code, Palette, Smartphone, BrainIcon, CodeIcon, PaletteIcon, SmartphoneIcon, GithubIcon, LinkedinIcon, MailIcon, ExternalLinkIcon } from 'lucide-react';


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
    // Replace the problematic shadow transform with this:
    const shadow = useTransform(
        [x, y],
        [
            [0, 1], // Input range for x: [0, 1]
            [0, 1], // Input range for y: [0, 1]
        ],
        [
            '0 0 15px rgba(126, 34, 206, 0.2)', // When both x=0, y=0
            '0 0 50px rgba(126, 34, 206, 0.7)', // When both x=1, y=1
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
            <div className={`relative px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full border-2 border-purple-500/50 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm transition-all duration-300 cursor-pointer ${isHovered ? 'scale-110 shadow-2xl shadow-purple-500/50 border-purple-400' : ''}`}>
                <span className="text-white font-semibold text-sm sm:text-base">{skill}</span>
                {isHovered && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 animate-pulse" />
                )}
            </div>
        </div>
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
        <span className="bg-clip-text text-transparent  bg-linear-to-r from-purple-400 to-pink-500">
            {children}
        </span>
        {/* Decorative underline/wave */}
        <div className="mt-2 w-24 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto"></div>
    </motion.h2>
);

// NEW: Education Card component for the timeline
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

            <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-1">{degree}</h3>
            <p className="text-base sm:text-lg font-semibold text-cyan-400 mb-2">{institution}</p>
            <p className="text-xs sm:text-sm text-gray-400 mb-3">{years} <span className="text-gray-500">|</span> GPA: {gpa}</p>
            <p className="text-sm sm:text-base text-gray-300">{description}</p>
        </motion.div>
    );
};

const projects = {
    all: [
        {
            title: "Full-Stack E-Commerce Website",
            description: "Complete e-commerce platform with product listing, cart, checkout, and SSLCommerz payment integration. Designed REST APIs and managed backend using Express and MySQL.",
            tech: ["React", "Node.js", "Express.js", "MySQL", "SSLCommerz"],
            category: "webdev",
            image: "https://placehold.co/600x400/06b6d4/ffffff?text=E-Commerce"
        },
        {
            title: "Social Media Web App",
            description: "Social media platform with user authentication, post creation, and real-time feeds. Used Appwrite as backend-as-a-service for auth, storage, and database.",
            tech: ["React", "Appwrite", "JavaScript", "CSS"],
            category: "webdev",
            image: "https://placehold.co/600x400/8b5cf6/ffffff?text=Social+Media"
        },
        {
            title: "Real-Time Messaging App",
            description: "Real-time chat application with one-on-one messaging functionality using Socket.io for WebSocket communication. Messages and user data stored in MongoDB.",
            tech: ["React", "Node.js", "Socket.io", "MongoDB"],
            category: "webdev",
            image: "https://placehold.co/600x400/10b981/ffffff?text=Chat+App"
        },
        {
            title: "Heart Disease Prediction",
            description: "Classification model to predict the risk of heart disease using clinical data. Performed data preprocessing, model selection (Logistic Regression, Random Forest), and evaluation.",
            tech: ["Python", "scikit-learn", "pandas", "NumPy"],
            category: "ml",
            image: "https://placehold.co/600x400/ec4899/ffffff?text=Heart+Disease+ML"
        },
        {
            title: "Bulldozer Price Predictor",
            description: "Regression model to predict used bulldozer prices. Involved data cleaning, feature engineering, and model tuning. Evaluated using R² score and cross-validation.",
            tech: ["Python", "scikit-learn", "pandas", "NumPy"],
            category: "ml",
            image: "https://placehold.co/600x400/f59e0b/ffffff?text=Price+Predictor"
        }
    ]
};
// Project Card Component with Tilt and Flip
const ProjectCard = ({ title, description, tech, category, image, index, x, y }) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const { tiltX, tiltY } = useTiltMotion(ref, x, y, isHovered);
    const tiltProps = useTiltMotion(ref);

    return (
        <motion.div
            ref={ref}
            onMouseMove={tiltProps.onMouseMove}
            // onMouseLeave={tiltProps.onMouseLeave}
            className= " rounded-2xl shadow-lg overflow-hidden group relative w-full max-w-md mx-auto sm:max-w-sm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Glow Effect - now responds to tilt motion */}
            <motion.div
                className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"
                style={{
                    x: tiltX,
                    y: tiltY,
                }}
            />

            {/* Main Card with Flip Effect */}
            <motion.div
                className=" relative w-full preserve-3d"
                style={{ height: 'fit-content', minHeight: '400px' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                {/* Front Side - Project Overview */}
                <div
                    className=" bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col"
                    style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                >
                    {/* Project Image */}
                    <div className="relative overflow-hidden h-40 sm:h-48 shrink-0">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 to-transparent"></div>
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                            <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full border border-purple-600/30 capitalize">
                                {category}
                            </span>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-gray-300 leading-relaxed text-sm line-clamp-3 mb-3 sm:mb-4">{description}</p>

                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {tech.slice(0, 3).map((techItem, techIndex) => (
                                <span
                                    key={techIndex}
                                    className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-600/30"
                                >
                                    {techItem}
                                </span>
                            ))}
                            {tech.length > 3 && (
                                <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs">
                                    +{tech.length - 3}
                                </span>
                            )}
                        </div>

                        {/* Flip Indicator */}
                        <div className="text-center mt-auto pt-2 pb-2">
                            <button
                                className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm transition-colors cursor-pointer"
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                Click to see details →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Back Side - Project Details */}
                <div
                    className="absolute inset-0 bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                        setIsHovered(false);
                        setIsFlipped(false); // Auto-reset flip on mouse leave
                    }}
                >
                    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-purple-400 mb-2">Description</h4>
                            <p className="text-gray-300 text-sm">{description}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-purple-400 mb-2">Technologies Used</h4>
                            <div className="flex flex-wrap gap-2">
                                {tech.map((techItem, techIndex) => (
                                    <span
                                        key={techIndex}
                                        className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30"
                                    >
                                        {techItem}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <ExternalLinkIcon size={16} />
                                <span>Live Demo</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
                            >
                                <GithubIcon size={16} />
                                <span>Code</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};





const PortPolio = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const canvasRef = useRef(null);
    const heroCanvasRef = useRef(null);

    const { scrollYProgress } = useScroll();
    // const y = useTransform(scrollYProgress, [0, 1], [0, 300]);


    // Add this function to filter projects (add it inside your Portfolio component)
    const filteredProjects = activeTab === 'all'
        ? projects.all
        : projects.all.filter(project => project.category === activeTab);




    const mainRef = useRef(null);
    // const { scrollYProgress } = useScroll({ target: mainRef });
    const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    // State for global cursor tracking
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Enhanced mouse tracking for canvas effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Main background canvas with interactive particles
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 80;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `hsl(${Math.random() * 60 + 240}, 70%, ${60 + Math.random() * 20}%)`;
                this.originalSize = this.size;
            }

            update(mouse) {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.size = this.originalSize + (150 - distance) / 30;
                } else {
                    this.size = this.originalSize;
                }

                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(mousePosition);
                particles[i].draw();
            }

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mousePosition]);

    // Hero section - Unique design inspired by the references
    useEffect(() => {
        const canvas = heroCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create subtle gradient background
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create dark gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(10, 10, 20, 0.9)');
            gradient.addColorStop(1, 'rgba(15, 15, 30, 0.9)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add subtle grid pattern
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
            ctx.lineWidth = 0.5;

            for (let x = 0; x < canvas.width; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            for (let y = 0; y < canvas.height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Add floating geometric elements
            const time = Date.now() * 0.001;

            // Floating circles
            for (let i = 0; i < 5; i++) {
                const x = (canvas.width / 2) + Math.cos(time + i) * 200;
                const y = (canvas.height / 2) + Math.sin(time + i) * 150;
                const radius = 30 + Math.sin(time + i * 0.5) * 10;

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 + Math.sin(time + i) * 0.1})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Floating lines
            for (let i = 0; i < 3; i++) {
                const startX = canvas.width * 0.2 + Math.cos(time + i) * 50;
                const startY = canvas.height * 0.3 + Math.sin(time + i) * 30;
                const endX = canvas.width * 0.8 + Math.cos(time + i + 1) * 50;
                const endY = canvas.height * 0.7 + Math.sin(time + i + 1) * 30;

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 + Math.sin(time + i) * 0.1})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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


    const skills = [
        { name: "Machine Learning", level: 85, icon: Brain },
        { name: "Web Development", level: 90, icon: Code },
        { name: "Problem Solving", level: 92, icon: Brain },
        { name: "Backend Development", level: 88, icon: Code }
    ];

    const technicalSkills = [
        "React", "React Native", "Node.js", "Express.js", "JavaScript",
        "Python", "C", "C++", "MySQL", "MongoDB",
        "Socket.io", "REST APIs", "scikit-learn", "PyTorch", "NumPy",
        "pandas", "Git", "GitHub", "Docker", "Appwrite"
    ];

    const navItems = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: "Achievements", href: "#achievements" },
        { name: 'Education', href: '#education' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ];

    const education = [
        {
            degree: 'B.Sc. in Computer Science',
            institution: 'Chittagong University of Engineering & Technology (CUET)',
            years: '2022 - 2027 (Expected)',
            description: 'Currently pursuing undergraduate degree with focus on software development, algorithms, data structures, and machine learning applications.',
            gpa: 'In Progress',
        },
        {
            degree: 'Higher Secondary Certificate (HSC)',
            institution: 'Gov. Hazi Muhammad Mohsin College',
            years: '2021',
            description: 'Completed HSC in Science group with outstanding academic performance, building strong foundation in mathematics, physics, and chemistry.',
            gpa: '5.00/5.00',
        },
        {
            degree: 'Secondary School Certificate (SSC)',
            institution: 'Khaja Ajmery High School',
            years: '2019',
            description: 'Completed SSC in Science group with excellent results, demonstrating early academic excellence and interest in STEM fields.',
            gpa: '5.00/5.00',
        },
    ];

    return (
        <div className="relative min-h-screen bg-gray-900 text-white overflow-x-hidden">
            {/* Global CSS for Animations */}
            <style>
                {`

                .preserve-3d {
                    transform-style: preserve-3d;
                }

                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
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

            {/* Main Background Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full -z-10"
            />

            {/* --- GLOBAL CURSOR GLOW EFFECT --- */}
            <motion.div
                className="fixed top-0 left-0 w-80 h-80 rounded-full pointer-events-none z-9999 transition-transform duration-100 ease-out will-change-transform"
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
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-cyan-400 text-animated">S.A.A.</span>
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

            {/* Hero Section - Unique Design Inspired by References */}
            <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
                {/* Subtle Grid Canvas */}
                <canvas
                    ref={heroCanvasRef}
                    className="absolute top-0 left-0 w-full h-full -z-10"
                />

                <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid w-full sm:w-4/5 lg:w-3/4 mx-auto md:grid-cols-1 gap-8 sm:gap-12 items-center justify-center text-center">
                        {/* Left Column - Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4 sm:space-y-6 md:space-y-8"
                        >
                            <div className="inline-block">
                                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-bold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4">
                                    Fullstack Developer & ML Enthusiast
                                </div>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Hi, I'm <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Shahad Abir Akash</span>
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed px-2">
                                Motivated Computer Science undergraduate with strong problem-solving skills. I build full-stack web applications and ML solutions to solve real-world problems.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full font-semibold text-base sm:text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 cursor-pointer justify-center"
                                    onClick={() => scrollToSection('#projects')}
                                >
                                    View My Work
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 sm:px-8 py-3 sm:py-4 text-center border-2 border-gray-600 rounded-full font-semibold text-base sm:text-lg hover:border-blue-400 hover:text-blue-400 transition-all duration-300 cursor-pointer"
                                    onClick={() => scrollToSection('#contact')}
                                >
                                    Get In Touch
                                </motion.button>
                            </div>

                            {/* Stats */}
                            {/* <div className="flex gap-8 pt-6 justify-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400">50+</div>
                                    <div className="text-gray-400">Projects</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-400">5+</div>
                                    <div className="text-gray-400">Years</div>
                                </div>
                            </div> */}
                        </motion.div>

                        {/* Right Column - Visual Element */}

                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle>About</SectionTitle>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >

                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4 sm:space-y-6"
                        >
                            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                                I'm a Computer Science undergraduate at CUET with a passion for building full-stack web applications
                                and exploring machine learning. With expertise in React, Node.js, and Python, I love creating
                                solutions that combine elegant design with powerful functionality.
                            </p>
                            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                                My journey includes solving 250+ problems on competitive programming platforms, participating in
                                hackathons, and building real-world projects. I'm constantly learning and seeking opportunities
                                to apply my skills in challenging environments.
                            </p>

                            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                                <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
                                    <div className="text-2xl sm:text-3xl font-bold text-blue-400">250+</div>
                                    <div className="text-sm sm:text-base text-gray-400">Problems Solved</div>
                                </div>
                                <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
                                    <div className="text-2xl sm:text-3xl font-bold text-purple-400">5+</div>
                                    <div className="text-sm sm:text-base text-gray-400">Projects</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4 sm:space-y-6"
                        >
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Core Expertise</h3>
                            {skills.map((skill, index) => {
                                const Icon = skill.icon;
                                return (
                                    <div key={skill.name} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Icon className="text-blue-400" size={20} />
                                                <span className="text-gray-300">{skill.name}</span>
                                            </div>
                                            <span className="text-gray-400">{skill.level}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                                className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                                            ></motion.div>
                                        </div>
                                    </div>
                                );
                            })}


                        </motion.div>
                    </div>
                </div>


            </section>

            {/* Technical Arsenal Section */}
            <section id="skills" className="py-12 sm:py-16 md:py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mt-6 sm:mt-8 md:mt-12">
                        <SectionTitle>Technical Arsenal</SectionTitle>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                            {technicalSkills.map((skill, i) => (
                                <SkillOrb key={i} skill={skill} index={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Achievements & Activities Section */}
            <section id="achievements" className="py-12 sm:py-16 md:py-20 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle>Achievements & Activities</SectionTitle>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8 sm:mb-12 md:mb-16"
                    >
                        {/* <h2 className="text-4xl md:text-5xl font-bold mb-4">Achievements & Activities</h2> */}
                        
                    </motion.div>

                    <div className="space-y-4 sm:space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0 * 0.1, duration: 0.5 }}
                            className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all backdrop-blur-sm"
                        >
                            <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 shrink-0"></div>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg">
                                Solved 250+ problems on several platforms (
                                <a 
                                    href="https://leetcode.com/u/Akas__h/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className=" inline-flex items-center   text-yellow-300/65 hover:text-yellow-300  transition-all mx-1"
                                >
                                    LeetCode
                                </a>
                                ,
                                <a 
                                    href="https://codeforces.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center   text-blue-400/70
                                    hover:text-blue-400  transition-all mx-1"
                                >
                                    Codeforces
                                </a>)
                            </p>
                        </motion.div>
                        {[
                            "Participated in regional rounds: Bangladesh Physics Olympiad & Bangladesh Math Olympiad",
                            "Hackathon participant",
                            "Member of Lions Club Chittagong"
                        ].map((item, index) => (
                            <motion.div
                                key={index + 1}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all backdrop-blur-sm"
                            >
                                <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                                <p className="text-gray-300 text-sm sm:text-base md:text-lg">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW: Education Section (Timeline-style) */}
            <section id="education" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/70 backdrop-blur-xl border-y border-white/10">
                <div className="max-w-4xl mx-auto">
                    <SectionTitle>Education</SectionTitle>
                    <div className="space-y-8 sm:space-y-12 relative pb-4">
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

            {/* NEW: Projects Section with Filtering */}
            <section id="projects" className=" py-12 sm:py-16 md:py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle>Projects</SectionTitle>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8 sm:mb-12 md:mb-16"
                    >
                        {/* <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Work</h2> */}
                        
                    </motion.div>

                    {/* Project Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12">
                        {[
                            { id: 'all', label: 'All Projects', icon: null },
                            { id: 'ml', label: 'ML/AI', icon: BrainIcon },
                            { id: 'webdev', label: 'Web Dev', icon: CodeIcon }
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={` px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                    } flex items-center gap-1.5 sm:gap-2`}
                            >
                                {tab.icon && <tab.icon size={14} className="sm:w-4 sm:h-4" />}
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Project Grid */}
                    <div className=" grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8">
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.title}
                                {...project}
                                index={index}
                                x={X}
                                y={y}
                            />
                        ))}
                    </div>
                </div>
            </section>



            {/* Contact Section */}
            <section id="contact" className="py-12 sm:py-16 md:py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8 sm:mb-12 md:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Let's Connect</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto"></div>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
                            Ready to bring your ideas to life? Let's discuss how we can create something amazing together.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4 sm:space-y-6 md:space-y-8"
                        >
                            <a 
                                href="mailto:u2104035@student.cuet.ac.bd"
                                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 sm:w-7 sm:h-7" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold">Email</h3>
                                    <p className="text-sm sm:text-base text-gray-400 truncate">u2104035@student.cuet.ac.bd</p>
                                </div>
                            </a>

                            <a 
                                href="https://linkedin.com/in/abir-akash-564360334"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Linkedin className="w-5 h-5 sm:w-7 sm:h-7" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold">LinkedIn</h3>
                                    <p className="text-sm sm:text-base text-gray-400 truncate">linkedin.com/in/abir-akash-564360334</p>
                                </div>
                            </a>

                            <a 
                                href="https://github.com/A-k-a-sh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-pink-500/50 transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Github className="w-5 h-5 sm:w-7 sm:h-7" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold">GitHub</h3>
                                    <p className="text-sm sm:text-base text-gray-400 truncate">github.com/A-k-a-sh</p>
                                </div>
                            </a>
                        </motion.div>

                        <motion.form
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4 sm:space-y-6"
                        >
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-500"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-500"
                                />
                            </div>
                            <div>
                                <textarea
                                    rows={4}
                                    placeholder="Your Message"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none placeholder-gray-500"
                                ></textarea>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all text-base sm:text-lg"
                            >
                                Send Message
                            </motion.button>
                        </motion.form>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-gray-900/50 backdrop-blur-xl border-t border-white/10 py-8 sm:py-10 md:py-12 text-center relative" style={{ zIndex: 1 }}>
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex justify-center gap-6 sm:gap-8 mb-4 sm:mb-6">
                        <a href="#" className="text-gray-400 hover:text-purple-400 transition-all transform hover:scale-125">
                            <Github size={24} className="sm:w-7 sm:h-7" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition-all transform hover:scale-125">
                            <Linkedin size={24} className="sm:w-7 sm:h-7" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-pink-400 transition-all transform hover:scale-125">
                            <Mail size={24} className="sm:w-7 sm:h-7" />
                        </a>
                    </div>
                    <p className="text-gray-400 mb-2 text-sm sm:text-base">© 2025 Akash. Crafted with passion & code.</p>
                    <p className="text-gray-500 text-xs sm:text-sm">Built with React, Tailwind CSS & lots of ☕</p>
                </div>
            </footer>
        </div>
    );
};

export default PortPolio;
