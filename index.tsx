
import React, { useState, useEffect, useRef, memo, createContext, useContext, MouseEventHandler } from 'react';
import { createRoot } from 'react-dom/client';

declare const gsap: any;

// --- DATA & CONFIG ---

const servicesSubLinks = [
  { name: 'Architectural Design', href: '/architectural-design.html' },
  { name: 'Engineering Consultancy', href: '/engineering-consultancy.html' },
  { name: 'Project Management Consultancy', href: '/project-management.html' },
  { name: 'Sustainability & Energy', href: '/sustainability-energy.html' },
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about.html' },
  { name: 'Works/Projects', href: '/index.html#works' },
  { name: 'Services', href: '/index.html#our-services', subLinks: servicesSubLinks },
  { name: 'Blog', href: '/index.html#blog' },
  { name: 'Careers', href: '/careers.html' },
  { name: 'Contact', href: '/contact.html' },
];

const servicePageData = {
    '/architectural-design.html': {
        title: 'Architectural Design',
        image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&auto=format&fit=crop&q=60',
        alt: 'Architectural design sketch',
        content: [
            'From concept sketches to refined details, we craft cohesive spatial narratives where aesthetics, function, and flow work as one. Our Architectural Design division unites multiple studios into one collaborative team, covering every discipline – from urban planning, landscape architecture, and interiors to public/commercial developments, residential projects, industrial facilities, and even stadium and venue design. We leverage a holistic design process that blends creativity with practicality, ensuring spaces are not only visually striking but also highly functional and contextually appropriate.',
            'We excel in Building Information Modeling (BIM), delivering end-to-end BIM support (3D–5D) from concept through to handover. By using coordinated digital models, we detect and resolve clashes early in the design phase, improving buildability and reducing risk on complex projects. Our team’s integrated approach and attention to detail result in architectural solutions that are innovative, sustainable, and aligned with each client’s vision.',
        ],
        services: [
            'Building Architecture – Complete architectural design for commercial, residential, and institutional buildings.',
            'Landscape Architecture – Planning and design of outdoor spaces, gardens, and urban landscapes.',
            'Interiors – Interior architecture and space planning that enhance form and function.',
            'Site Selection, Evaluation & Analysis – Assessing and selecting optimal sites based on project requirements and feasibility.',
            'Infrastructure Architecture – Design of support facilities and integration with civil infrastructure.',
            'Industrial Architecture – Customized design for factories, warehouses, and industrial plants.',
            'Project Brief & Feasibility Studies – Defining project requirements, scope, and viability analyses.',
            'Preliminary Design & Concept Presentations – Early-phase design development with reports and client presentations.',
            'Detailed Design & Documentation – Comprehensive architectural drawings, specifications, and reports.',
            'Tender Documents & Analysis – Preparation of tender packages and assistance with bid evaluation.',
            'Presentation Drawings, 3D Walkthroughs & Animations – Visualizations and animations bringing designs to life for stakeholders.',
            'Architectural Scale Models – Physical and digital scale models for design review and client display.',
            'Building Information Modeling (up to 5D) – Advanced BIM modeling including 3D geometry, scheduling (4D), and cost estimation (5D).',
            'Urban Design & Masterplanning – Large-scale urban planning, cityscape design, and master plan development.',
            'Redevelopment & Refurbishment – Renovation design and adaptive reuse for existing buildings and heritage projects.',
            'Municipality Approvals – Navigating local authority regulations and obtaining necessary building permits and approvals.',
        ],
    },
    '/engineering-consultancy.html': {
        title: 'Engineering Consultancy',
        image: 'https://images.unsplash.com/photo-1581092446337-234557050003?w=800&auto=format&fit=crop&q=60',
        alt: 'Engineers collaborating on a blueprint.',
        content: [
            'Our Engineering Consultancy division provides the technical backbone for visionary architecture. We deliver integrated, multidisciplinary engineering solutions that are innovative, efficient, and resilient. Our expert teams in structural, MEP, civil, and specialized engineering disciplines work collaboratively to solve complex challenges and ensure that every design is buildable, sustainable, and optimized for performance. We merge technical excellence with a deep understanding of our clients’ goals to deliver projects that stand the test of time.',
            'From initial feasibility studies to detailed design and construction support, we are committed to precision and quality. We leverage cutting-edge software and analysis tools to model and test our designs, ensuring they meet the highest standards of safety and efficiency. Our proactive approach to coordination and problem-solving helps streamline the construction process, minimize risks, and deliver exceptional value. We are dedicated to engineering excellence that supports architectural creativity and delivers lasting results.',
        ],
        services: [
            'Structural Engineering – Design of robust and efficient structural systems for buildings and infrastructure.',
            'MEP (Mechanical, Electrical & Plumbing) Engineering – Integrated design of building services for optimal performance and comfort.',
            'Civil Engineering – Site development, grading, drainage, and utility design.',
            'Geotechnical Engineering – Subsurface investigation and foundation design.',
            'Facade Engineering – Design and analysis of building envelopes for performance and aesthetics.',
            'Fire & Life Safety Consulting – Code compliance, fire protection system design, and evacuation planning.',
            'Acoustic Consulting – Design for optimal sound insulation, room acoustics, and noise control.',
            'Vertical Transportation – Elevator and escalator system design and analysis.',
            'Value Engineering – Optimizing project value by analyzing function and cost.',
            'Peer Review & Third-Party Verification – Independent review of engineering designs for quality and compliance.',
        ],
    },
    '/project-management.html': {
        title: 'Project & Construction Management',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop&q=60',
        alt: 'Construction site with project managers reviewing plans.',
        content: [
            'We provide comprehensive leadership for projects of all sizes, ensuring your vision is realized on time, on budget, and to the highest quality standards. Our Project Management Consultancy (PMC) team serves as a trusted extension of our clients, managing every phase of a project from inception to handover. With a proven track record on some of Qatar’s most iconic developments, we specialize in navigating complex projects with precision and foresight. Our deep local experience gives us an unparalleled understanding of regional regulations and market dynamics, allowing us to proactively mitigate risks and drive project success.',
            'Our methodology is built on a foundation of clear communication, rigorous control, and proactive problem-solving. We implement robust systems for planning, cost management, and quality assurance, ensuring complete transparency for all stakeholders. By integrating seamlessly with design teams, contractors, and authorities, we foster a collaborative environment focused on shared goals. Whether managing a single project or a large-scale program, our commitment is to safeguard our clients\' interests and deliver outcomes that exceed expectations.',
        ],
        services: [
            'Project Management – Comprehensive project planning, execution, and closing services representing the client’s interests.',
            'Construction Management & Supervision – On-site construction supervision, contractor coordination, and quality control.',
            'Technical Review – Independent technical audits and constructability reviews of designs and plans.',
            'Cost Estimating & Management – Budget development, cost control, value engineering, and financial reporting throughout the project.',
            'Construction Claims Consulting – Claims analysis, mitigation strategies, and dispute resolution support during construction.',
            'Independent Contract Document Review – Thorough review of contracts, drawings, and specifications to ensure clarity and completeness.',
            'Bid Management & Tender Evaluation – Management of the bidding process, contractor pre-qualification, and tender analysis.',
            'Quality Assurance & Control (QA/QC) – Establishing and implementing QA/QC protocols to meet project standards.',
            'Commissioning & Handover Management – Managing the final stages of a project, including system testing, training, and final handover.',
        ],
    },
    '/sustainability-energy.html': {
        title: 'Sustainability & Energy',
        image: 'https://images.unsplash.com/photo-1579225688258-af53a436a5e1?w=800&auto=format&fit=crop&q=60',
        alt: 'Sustainable energy solutions like solar panels on a modern building',
        content: [
            'Aligned with our clients’ objectives, we deliver projects safely and sustainably – meeting cost, schedule, and quality targets every time. Our Sustainability & Energy team provides end-to-end environmental consulting and energy management services for both public and private clients. We guide projects through Environmental Impact Assessments and regulatory approvals, embedding practical strategies for energy efficiency, resource conservation, and low-carbon design to achieve compliant and resilient outcomes. By clarifying environmental impacts and cutting energy consumption, we help clients meet green building standards and future-proof their investments.',
            'Our specialists develop tailored solutions in energy auditing, retrofitting, and sustainable design integration. We implement strategies like advanced commissioning, renewable energy integration, and smart building controls to maximize efficiency. These efforts regularly reduce building operating costs by over 50% without compromising comfort, safety, or compliance – delivering tangible savings alongside environmental benefits. With a finger on the pulse of global best practices and local regulations, Taj Consultancy’s sustainability experts ensure each project not only meets today’s goals but also contributes to a greener, more energy-efficient future.',
        ],
        services: [
            'Energy Audits & Savings Roadmaps',
            'Retro-Commissioning & Continuous Commissioning',
            'HVAC Optimization',
            'Building Management System (BMS) Optimization',
            'Lighting Redesign & Smart Controls',
            'Solar PV Feasibility & Design',
            'Water Efficiency Solutions',
            'Utility Tariff Optimization',
            'Measurement & Verification (M&V)',
            'Indoor Air Quality Improvements',
            'Waste Minimization & Circular Materials',
            'Carbon Accounting & Net-Zero Roadmaps',
            'Sustainability Reporting & Certification',
            'Environmental Impact Assessments (EIA/ESIA)',
            'Contractor Sustainability Compliance',
            'Training & Change Management',
        ],
    },
};

const blogPageData = {
    '/blog-bim-ai.html': {
        title: 'The Future of BIM: AI and Generative Design',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=60',
        alt: 'Abstract visualization of AI and design',
        category: 'Technology',
        date: 'August 15, 2024',
        content: [
            'Building Information Modeling (BIM) has fundamentally transformed the architecture, engineering, and construction (AEC) industry over the past two decades. By creating intelligent 3D models, BIM allows for better collaboration, improved clash detection, and more efficient project delivery. However, we are on the cusp of another revolution, one powered by Artificial Intelligence (AI) and Generative Design.',
            'AI is moving beyond simple automation and into the realm of creative partnership. In the context of architecture, AI algorithms can analyze vast datasets—from building performance metrics to local climate data and zoning regulations—to inform and optimize the design process. This isn\'t about replacing the architect but augmenting their capabilities, freeing them from repetitive tasks to focus on higher-level creative and strategic thinking.',
            'This is where Generative Design comes in. It\'s a design exploration process where designers input their goals and constraints (e.g., spatial requirements, material costs, energy performance, structural loads) into an AI system. The system then explores the entire solution space, rapidly generating thousands of potential design options. It learns from each iteration, refining the results to produce high-performing and often unexpected solutions that a human designer might never have conceived.',
            'The benefits are profound. Generative design can lead to structures that are not only more aesthetically innovative but also lighter, stronger, and more sustainable. By optimizing for material usage, it can significantly reduce construction costs and environmental impact. The ability to simulate performance at an early stage allows for the creation of buildings that are more energy-efficient and comfortable for their occupants.',
            'While the technology is still evolving, its potential is undeniable. From creating complex, lightweight lattice structures for building facades to optimizing the layout of an entire hospital floor for patient flow and staff efficiency, AI-driven design is set to tackle some of the most complex challenges in the built environment. As computational power grows and algorithms become more sophisticated, the collaboration between human creativity and machine intelligence will define the future of architecture.',
        ],
    },
    '/blog-sustainable-materials.html': {
        title: 'Sustainable Materials in Modern Construction',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&auto=format&fit=crop&q=60',
        alt: 'A modern wooden building showcasing sustainable materials',
        category: 'Architecture',
        date: 'August 10, 2024',
        content: [
            'As global awareness of climate change and resource depletion grows, the construction industry is under increasing pressure to adopt more sustainable practices. Buildings are responsible for a significant portion of global energy consumption and carbon emissions, making the choice of materials more critical than ever. The shift towards sustainable materials is not just an ethical choice; it\'s becoming an economic and regulatory necessity.',
            'At the forefront of this movement is mass timber, particularly Cross-Laminated Timber (CLT). CLT panels are made by gluing layers of solid-sawn lumber together at right angles, creating a product that is exceptionally strong, lightweight, and dimensionally stable. It can replace concrete and steel in many applications, significantly reducing the carbon footprint of a building. As a renewable resource, timber sequesters carbon throughout its life, making it a key player in the fight against climate change.',
            'Beyond timber, a host of innovative materials are gaining traction. Bamboo, a rapidly renewable grass, offers incredible tensile strength. Recycled steel reduces the energy-intensive process of virgin steel production. Hempcrete, a mixture of hemp fibers and lime, is a carbon-negative insulation material. Even more futuristic materials like mycelium (the root structure of fungi) are being explored to grow bricks and insulation with minimal environmental impact.',
            'Choosing the right material involves more than just its origin. A Life Cycle Assessment (LCA) is a crucial tool that evaluates the environmental impact of a material from cradle to grave—from raw material extraction through manufacturing, use, and eventual disposal or recycling. This holistic view ensures that we make informed decisions that genuinely reduce a project\'s overall environmental footprint.',
            'At Taj Design Consult, we are deeply committed to integrating sustainable materials and practices into our projects. We believe that thoughtful material selection is fundamental to creating resilient, healthy, and environmentally responsible buildings that will stand the test of time and contribute positively to our planet\'s future.',
        ],
    },
    '/blog-minimalism-light.html': {
        title: 'Minimalism and Light: Crafting Serene Spaces',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=60',
        alt: 'A minimalist interior with abundant natural light',
        category: 'Interior Design',
        date: 'August 05, 2024',
        content: [
            'In a world of constant noise and clutter, the principles of minimalist design offer a powerful antidote. Rooted in the "less is more" philosophy, interior design is about stripping away the non-essential to create spaces that are calm, intentional, and deeply restorative. It’s not about emptiness, but about making room for what truly matters.',
            'Natural light is arguably the most important element in a minimalist interior. It breathes life into a space, making it feel larger, cleaner, and more open. The design should work to maximize daylight at every turn. This can be achieved through large, unadorned windows, translucent materials, and strategically placed mirrors. Sheer, simple window treatments are preferred over heavy draperies to allow light to filter through gently.',
            'The color palette in minimalist design is typically subdued, relying on a foundation of neutrals like white, beige, and grey. This doesn\'t mean the space has to be boring. Interest and warmth are introduced through texture—the rough weave of a linen sofa, the smooth grain of a light wood floor, the soft pile of a wool rug. These tactile elements prevent the space from feeling cold or sterile.',
            'Every piece of furniture and decor in a minimalist space must earn its place. The focus is on quality over quantity. Each item is chosen for its form, function, and beauty. Clean lines, simple geometries, and high-quality craftsmanship are hallmarks of minimalist furniture. Clutter is eliminated through clever, integrated storage solutions that keep surfaces clear and the mind at ease.',
            'The result of this intentional approach is more than just an aesthetic; it\'s a feeling. Minimalist spaces have been shown to reduce stress, improve focus, and promote a sense of well-being. By creating an environment free from overwhelming visual stimuli, we create a sanctuary where we can truly relax, recharge, and connect with ourselves.',
        ],
    },
};

const careerOpenings = [
    {
      title: 'Senior Architect',
      description: 'Lead design projects from concept to completion. Must have 8+ years of experience in large-scale commercial and residential projects.',
    },
    {
      title: 'BIM Specialist',
      description: 'Develop and manage BIM models, ensuring clash detection and coordination across disciplines. Proficiency in Revit is essential.',
    },
    {
      title: 'Lead Interior Designer',
      description: 'Create innovative and functional interior spaces for high-end hospitality and corporate clients. Strong portfolio required.',
    },
];

// --- ROUTING ---

const NavigationContext = createContext<(path: string) => void>(() => {});

const useRouter = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname);
            window.scrollTo(0, 0);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
            }
        };
        window.addEventListener('popstate', onLocationChange);
        return () => window.removeEventListener('popstate', onLocationChange);
    }, []);

    const navigate = (path: string) => {
        if (path.startsWith('/index.html#')) {
            window.location.href = path; // Handle hash links for the homepage
            return;
        }
        if (window.location.pathname !== path) {
            window.history.pushState({}, '', path);
            const navEvent = new PopStateEvent('popstate');
            window.dispatchEvent(navEvent);
        }
    };

    return { currentPath, navigate };
};

const useNavigation = () => useContext(NavigationContext);

// --- SHARED & LAYOUT COMPONENTS ---

const SkipToContentLink = () => (
    <a href="#main-content" className="skip-to-content-link">
        Skip to main content
    </a>
);

const CustomCursor = memo(() => {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const dot = dotRef.current;
        const outline = outlineRef.current;
        if (!dot || !outline) return;

        gsap.set([dot, outline], { xPercent: -50, yPercent: -50 });

        const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
        const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
        const outlineX = gsap.quickTo(outline, "x", { duration: 0.3, ease: "power3" });
        const outlineY = gsap.quickTo(outline, "y", { duration: 0.3, ease: "power3" });

        const mouseMove = (e: MouseEvent) => {
            dotX(e.clientX);
            dotY(e.clientY);
            outlineX(e.clientX);
            outlineY(e.clientY);
        };
        
        const showCursor = () => {
            dot.classList.add('visible');
            outline.classList.add('visible');
        };
        const hideCursor = () => {
            dot.classList.remove('visible');
            outline.classList.remove('visible');
        };
        
        const handleMouseEnterHoverTarget = () => {
            dot.classList.add('cursor-hover');
            outline.classList.add('cursor-hover');
        };

        const handleMouseLeaveHoverTarget = () => {
            dot.classList.remove('cursor-hover');
            outline.classList.remove('cursor-hover');
        };
        
        window.addEventListener("mousemove", mouseMove);
        document.body.addEventListener("mouseleave", hideCursor);
        document.body.addEventListener("mouseenter", showCursor);

        const hoverTargets = document.querySelectorAll(
            'a, button, [role="button"], input, .testimonial-slide, .dot, .service-item, .process-item, .blog-item, .work-image, .lightbox-close, .job-item-header, .sector-item, .whatsapp-widget, select, textarea, label'
        );
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', handleMouseEnterHoverTarget);
            target.addEventListener('mouseleave', handleMouseLeaveHoverTarget);
        });

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            document.body.removeEventListener("mouseleave", hideCursor);
            document.body.removeEventListener("mouseenter", showCursor);
            hoverTargets.forEach(target => {
                target.removeEventListener('mouseenter', handleMouseEnterHoverTarget);
                target.removeEventListener('mouseleave', handleMouseLeaveHoverTarget);
            });
        };
    }, []);

    return (
        <>
            <div ref={outlineRef} className="custom-cursor-outline"></div>
            <div ref={dotRef} className="custom-cursor-dot"></div>
        </>
    );
});

const WaveAnimation = memo(() => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;

        const waves = [
            { amp: 15, freq: 0.02, phase: 0, color: 'rgba(212, 175, 55, 0.2)', speed: 0.01 },
            { amp: 20, freq: 0.015, phase: 1, color: 'rgba(212, 175, 55, 0.3)', speed: 0.015 },
            { amp: 25, freq: 0.01, phase: 2, color: 'rgba(212, 175, 55, 0.4)', speed: 0.02 },
        ];
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            waves.forEach(wave => {
                wave.phase += wave.speed;
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);
                for (let x = 0; x < canvas.width; x++) {
                    const y = Math.sin(x * wave.freq + wave.phase) * wave.amp + (canvas.height / 1.5);
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();
                ctx.fillStyle = wave.color;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(draw);
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} id="footer-wave-canvas" aria-hidden="true" />;
});

const WhatsAppChatWidget = () => (
    <a
        href="https://wa.me/97477123400"
        className="whatsapp-widget"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
    >
        <div className="whatsapp-ring"></div>
        <div className="whatsapp-ring-delay"></div>
        <i className="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i>
    </a>
);

// REFACTORED: This component is now simplified to handle clicks correctly in a multi-page app context.
// It removes the SPA routing logic that was preventing links to other pages from working.
const AppLink = ({ href, className = '', children, onClick, ...props }: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  [key: string]: any;
}) => {
    const isToggle = href === '#';

    const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
        // Prevent default browser action only for placeholder toggle links (used for menus).
        if (isToggle) {
            e.preventDefault();
        }
        
        // For all other links (including cross-page .html links and on-page #hash-links),
        // we do NOT prevent default. We let the browser handle navigation.
        // The useSmoothScroll hook will intercept on-page hash links to provide smooth scrolling.

        // If an onClick handler was passed from the parent, call it for side-effects like closing menus.
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <a 
            href={href} 
            className={className} 
            // Only attach the custom click handler if it's needed (e.g., for menu toggles).
            onClick={onClick ? handleClick : undefined} 
            {...props}
        >
            {children}
        </a>
    );
};

const MobileNav = ({ isOpen, onClose }) => {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const navContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const focusableElements = navContainerRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            setTimeout(() => firstElement.focus(), 100);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                    return;
                }
                if (e.key === 'Tab') {
                    if (e.shiftKey) { 
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else { 
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };
            
            const container = navContainerRef.current;
            container?.addEventListener('keydown', handleKeyDown);
            return () => container?.removeEventListener('keydown', handleKeyDown);

        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, onClose]);

    // REFACTOR: Simplified toggle handler, as preventDefault is now handled by AppLink for href="#"
    const handleServicesToggle = () => {
        setIsServicesOpen(prev => !prev);
    }
    
    return (
        <div ref={navContainerRef} className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!isOpen} id="mobile-nav">
            <button className="mobile-nav-close" onClick={onClose} aria-label="Close navigation menu">
                <i className="fas fa-times" aria-hidden="true"></i>
            </button>
            <nav className="mobile-nav">
                <ul>
                    {navLinks.map(link => (
                         <li key={link.name}>
                            {/* REFACTOR: Simplified link logic. AppLink now handles navigation and toggling based on href.
                                 The onClick prop is used for the side-effect of toggling the submenu or closing the nav. */}
                             <AppLink 
                                href={link.subLinks ? '#' : link.href} 
                                onClick={link.subLinks ? handleServicesToggle : onClose}
                                aria-haspopup={!!link.subLinks}
                                aria-expanded={link.subLinks ? isServicesOpen : undefined}
                                aria-controls={link.subLinks ? `mobile-${link.name}-submenu` : undefined}
                                id={link.subLinks ? `mobile-${link.name}-toggle` : undefined}
                             >
                                 {link.name}
                                 {link.subLinks && <i className={`fas fa-chevron-down dropdown-indicator ${isServicesOpen ? 'open' : ''}`} aria-hidden="true"></i>}
                             </AppLink>
                             {link.subLinks && (
                                 <ul id={`mobile-${link.name}-submenu`} className={`mobile-submenu ${isServicesOpen ? 'open' : ''}`} aria-hidden={!isServicesOpen}>
                                     {link.subLinks.map(subLink => (
                                         <li key={subLink.name}>
                                            <AppLink href={subLink.href} onClick={onClose}>
                                                {subLink.name}
                                            </AppLink>
                                        </li>
                                     ))}
                                 </ul>
                             )}
                         </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

const Header = ({ theme }) => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  
  const burgerMenuRef = useRef<HTMLButtonElement>(null);
  const servicesToggleRef = useRef<HTMLAnchorElement>(null);
  const servicesDropdownContainerRef = useRef<HTMLLIElement>(null);

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
    burgerMenuRef.current?.focus();
  };

  const closeServicesDropdown = (shouldFocusToggle = true) => {
    if (isServicesDropdownOpen) {
      setIsServicesDropdownOpen(false);
      if (shouldFocusToggle) {
        servicesToggleRef.current?.focus();
      }
    }
  };

  useEffect(() => {
    if (isServicesDropdownOpen) {
      const firstItem = servicesDropdownContainerRef.current?.querySelector<HTMLAnchorElement>('.dropdown-menu a');
      firstItem?.focus();
    }
  }, [isServicesDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeServicesDropdown();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownContainerRef.current && !servicesDropdownContainerRef.current.contains(event.target as Node)) {
        closeServicesDropdown(false);
      }
    };

    if (isServicesDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => navRef.current?.classList.add('animate-in'), 300);
    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
    };
  }, []);

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsServicesDropdownOpen(prev => !prev);
  };
  
  const handleDropdownItemKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    const items = Array.from(
      servicesDropdownContainerRef.current?.querySelectorAll<HTMLAnchorElement>('.dropdown-menu a') || []
    );
    const currentIndex = items.indexOf(e.currentTarget);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Tab' && !e.shiftKey && currentIndex === items.length - 1) {
      closeServicesDropdown(false);
    } else if (e.key === 'Tab' && e.shiftKey && currentIndex === 0) {
      closeServicesDropdown(false);
    }
  };

  const headerClasses = `app-header ${scrolled ? 'scrolled' : ''} on-${theme}`;

  return (
    <header className={headerClasses}>
      <div className="logo">
        <AppLink href="/" className="logo-text" aria-label="Taj Design Consult - Homepage">Taj Design Consult</AppLink>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <ul ref={navRef}>
          {navLinks.map((link) => (
            <li 
              key={link.name} 
              className={`${link.subLinks ? 'has-dropdown' : ''} ${link.name === 'Services' && isServicesDropdownOpen ? 'open' : ''}`}
              ref={link.name === 'Services' ? servicesDropdownContainerRef : null}
            >
              <AppLink 
                ref={link.name === 'Services' ? servicesToggleRef : null}
                href={link.href}
                id={link.name === 'Services' ? 'services-menu-toggle' : undefined}
                onClick={link.name === 'Services' ? handleServicesClick : undefined}
                aria-haspopup={!!link.subLinks}
                aria-expanded={link.name === 'Services' ? isServicesDropdownOpen : undefined}
                aria-controls={link.name === 'Services' ? 'services-dropdown-menu' : undefined}
              >
                {link.name}
                {link.subLinks && <i className="fas fa-chevron-down dropdown-indicator" aria-hidden="true"></i>}
              </AppLink>
              {link.subLinks && (
                <ul id="services-dropdown-menu" className="dropdown-menu" role="menu" aria-labelledby="services-menu-toggle">
                  {link.subLinks.map((subLink) => (
                    <li key={subLink.name} role="presentation">
                      <AppLink href={subLink.href} role="menuitem" onKeyDown={handleDropdownItemKeyDown}>{subLink.name}</AppLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <button 
        ref={burgerMenuRef}
        className="burger-menu" 
        onClick={() => setIsMobileNavOpen(true)}
        aria-label="Open navigation menu"
        aria-controls="mobile-nav"
        aria-expanded={isMobileNavOpen}
      >
        <i className="fas fa-bars" aria-hidden="true"></i>
      </button>
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </header>
  );
};

const LeftSidebar = ({ pageName }) => {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-top">
        <div className="divider" />
        <div className="home-text">{pageName}</div>
      </div>
      <div className="social-icons">
        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
        <a href="#" aria-label="Twitter"><i className="fab fa-twitter" aria-hidden="true"></i></a>
        <a href="#" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true"></i></a>
        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" aria-hidden="true"></i></a>
      </div>
      <div className="sidebar-footer">
        <p>© Taj Design Consult 2024. All rights reserved.</p>
      </div>
    </aside>
  );
};

const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer id="footer" className="app-footer scroll-trigger fade-up">
            <WaveAnimation />
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-item footer-logo scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>
                        <div className="logo-text">Taj Design Consult</div>
                        <p>Our team takes over everything, from an idea and concept development to realization. We believe in traditions and incorporate them within our innovations.</p>
                         <div className="footer-contact-info">
                            <p><i className="fas fa-phone" aria-hidden="true"></i> <a href="tel:+97477123400">+974 7712 3400</a></p>
                            <p><i className="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:info@tajdc.com">info@tajdc.com</a></p>
                            <p><i className="fas fa-map-marker-alt" aria-hidden="true"></i> 14th floor, Al Jazeera tower, Westbay, Doha Qatar</p>
                        </div>
                    </div>
                    <div className="footer-item scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
                        <h4>Get in Touch</h4>
                        <ContactForm />
                    </div>
                </div>
                <div className="copyright-section">
                    <span>2024 © Taj Design Consult. All rights reserved.</span>
                    <button className="to-top" onClick={scrollToTop} aria-label="Scroll back to top">To Top ↑</button>
                </div>
            </div>
          </footer>
    )
}

const ContactForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        if (!name.trim() || !email.trim() || !message.trim()) {
            alert('Please fill in all fields before sending.');
            return;
        }

        const subject = encodeURIComponent(`Contact Form Inquiry from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`
        );

        window.location.href = `mailto:info@tajdc.com?subject=${subject}&body=${body}`;
        
        setIsSubmitted(true);
    };

    return (
        <div className="contact-form-container">
            <form onSubmit={handleSubmit} className={`contact-form ${isSubmitted ? 'submitted' : ''}`} aria-hidden={isSubmitted}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name-footer">Name</label>
                        <input type="text" id="name-footer" name="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email-footer">Email</label>
                        <input type="email" id="email-footer" name="email" required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="message-footer">Message</label>
                    <textarea id="message-footer" name="message" rows={4} required></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
            </form>
            <div className={`success-message ${isSubmitted ? 'visible' : ''}`} aria-hidden={!isSubmitted} aria-live="polite">
                <i className="fas fa-check-circle" aria-hidden="true"></i>
                <h3>Thank You!</h3>
                <p>Please complete sending your message in your email client.</p>
            </div>
        </div>
    );
};

// --- HOME PAGE & COMPONENTS ---
const ParticleCanvas = memo(() => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: any[] = [];
        const particleCount = 150;

        class Particle {
            x: number; y: number; vx: number; vy: number; radius: number; color: string; shadowBlur: number;
            constructor() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 1.2 + 0.3;
                const alpha = Math.random() * 0.7 + 0.1;
                this.color = `rgba(212, 175, 55, ${alpha})`; this.shadowBlur = Math.random() * 8 + 4;
            }
            draw() {
                ctx.save(); ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.shadowColor = 'rgba(212, 175, 55, 0.8)'; ctx.shadowBlur = this.shadowBlur;
                ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x > canvas.width + this.radius) this.x = -this.radius; else if (this.x < -this.radius) this.x = canvas.width + this.radius;
                if (this.y > canvas.height + this.radius) this.y = -this.radius; else if (this.y < -this.radius) this.y = canvas.height + this.radius;
                this.draw();
            }
        }
        
        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => particle.update());
            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize(); animate();
        window.addEventListener('resize', handleResize);
        return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', handleResize); };
    }, []);

    return <canvas ref={canvasRef} id="particle-canvas" />;
});

const BlueprintAnimation = memo(() => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const paths = document.querySelectorAll('.blueprint-path');
        if (!paths.length) return;

        const tl = gsap.timeline();
        paths.forEach(path => {
            const length = (path as SVGPathElement).getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });
        tl.to(paths, { strokeDashoffset: 0, duration: 4, ease: 'power1.inOut', stagger: 0.2, delay: 1.5 });
    }, []);

    return (
        <div className="blueprint-container" aria-hidden="true">
            <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
                <g>
                    <path className="blueprint-path" d="M 5,5 L 95,5 L 95,95 L 5,95 Z" />
                    <path className="blueprint-path" d="M 5,50 L 95,50" />
                    <path className="blueprint-path" d="M 50,5 L 50,95" />
                    <path className="blueprint-path" d="M 5,30 L 30,5" />
                    <path className="blueprint-path" d="M 70,5 L 95,30" />
                    <path className="blueprint-path" d="M 5,70 L 30,95" />
                    <path className="blueprint-path" d="M 70,95 L 95,70" />
                    <path className="blueprint-path" d="M 50,30 A 20,20 0 1,1 49.9,30.05" />
                    <path className="blueprint-path" d="M 50,30 L 50,15" />
                    <path className="blueprint-path" d="M 64.14,35.86 L 74.95,25.05" />
                    <path className="blueprint-path" d="M 70,50 L 85,50" />
                    <path className="blueprint-path" d="M 20,80 Q 35,70 50,80 T 80,80" />
                </g>
            </svg>
        </div>
    );
});

const HeroSection = () => {
    const [offsetY, setOffsetY] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const titleLines = ["WE DESIGN", "STRUCTURES"];
    const fullTitle = titleLines.join(' ');

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const handleScroll = () => setOffsetY(window.pageYOffset);
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e; const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth) - 0.5; const y = (clientY / innerHeight) - 0.5;
            setMousePos({ x, y });
        };

        window.addEventListener('scroll', handleScroll); window.addEventListener('mousemove', handleMouseMove);
        return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('mousemove', handleMouseMove); };
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            gsap.set('.letter', { opacity: 1 });
            return;
        }

        gsap.fromTo('.letter',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05, delay: 0.8 }
        );
    }, []);

    const contentMouseParallax = 60;

    return (
        <section className="hero-section">
            <video autoPlay loop muted playsInline className="hero-video" src="https://videos.pexels.com/video-files/4120241/4120241-uhd_3840_2160_25fps.mp4" aria-hidden="true" />
            <BlueprintAnimation />
            <ParticleCanvas />
            <div className="hero-content" style={{
                transform: `translate(${mousePos.x * contentMouseParallax}px, ${(offsetY * 0.7) + (mousePos.y * contentMouseParallax)}px)`,
                opacity: Math.max(0, 1 - offsetY / (window.innerHeight * 0.8))
            }}>
                <h1 className="reveal-text" aria-label={fullTitle}>
                    {titleLines.map((line, lineIndex) => (
                        <div className="hero-title-line" key={lineIndex}>
                            {line.split('').map((char, index) => (
                                <span className="letter" key={`${char}-${index}`} aria-hidden="true">
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </div>
                    ))}
                </h1>
                <a href="#works" className="explore-btn">Explore Our Work</a>
            </div>
             <a href="#about" className="scroll-down-indicator" aria-label="Scroll down to about section">
                <i className="fas fa-arrow-down" aria-hidden="true"></i>
            </a>
        </section>
    );
};

const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    if (prefersReducedMotion) { setCount(end); return; }
                    const stepTime = Math.abs(Math.floor(duration / end));
                    timerRef.current = setInterval(() => {
                        start += 1; setCount(start);
                        if (start === end) { if (timerRef.current) clearInterval(timerRef.current); }
                    }, stepTime);
                    observer.disconnect();
                }
            }, { threshold: 0.5 }
        );

        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); if (timerRef.current) clearInterval(timerRef.current); };
    }, [end, duration]);

    return <div ref={ref} className="num">{count}</div>;
};

const TestimonialsCarousel = ({ testimonials }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resetTimeout = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        resetTimeout();
        timeoutRef.current = setTimeout(() => setCurrentIndex((prev) => prev === testimonials.length - 1 ? 0 : prev + 1), 5000);
        return () => resetTimeout();
    }, [currentIndex, testimonials.length]);

    const goToPrev = () => setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
    const goToNext = () => setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
    const goToSlide = (slideIndex) => setCurrentIndex(slideIndex);

    return (
        <div className="testimonials-carousel" aria-roledescription="carousel" aria-label="Customer testimonials">
             <div className="sr-only" aria-live="polite" aria-atomic="true">
                Showing testimonial {currentIndex + 1} of {testimonials.length}
            </div>
            <div className="testimonials-wrapper">
                <div className="testimonials-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {testimonials.map((testimonial, index) => (
                        <div className="testimonial-slide" key={index} role="group" aria-roledescription="slide" aria-hidden={currentIndex !== index}>
                            <div className="testimonial-card">
                                <img src={testimonial.image} alt={testimonial.author} className="testimonial-avatar" />
                                <p className="testimonial-quote">"{testimonial.quote}"</p>
                                <span className="testimonial-author">{testimonial.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={goToPrev} className="carousel-btn prev" aria-label="Previous testimonial"><i className="fas fa-chevron-left" aria-hidden="true"></i></button>
            <button onClick={goToNext} className="carousel-btn next" aria-label="Next testimonial"><i className="fas fa-chevron-right" aria-hidden="true"></i></button>
            <div className="carousel-dots">
                {testimonials.map((_, slideIndex) => (
                    <div
                        key={slideIndex} role="button" tabIndex={0} aria-label={`Go to testimonial ${slideIndex + 1}`}
                        className={`dot ${currentIndex === slideIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(slideIndex)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { goToSlide(slideIndex); }}}
                    ></div>
                ))}
            </div>
        </div>
    );
};

const ClientsCarousel = () => {
    const [logosPerPage, setLogosPerPage] = useState(6);
    const [isPaused, setIsPaused] = useState(false);
    const clientLogos = [
        "https://amecdesign.com/wp-content/uploads/2024/01/rose-sweet.jpg", "https://amecdesign.com/wp-content/uploads/2024/01/papa-johns.jpg",
        "https://amecdesign.com/wp-content/uploads/2024/01/madi.jpg", "https://amecdesign.com/wp-content/uploads/2024/01/Loydence.jpg",
        "https://amecdesign.com/wp-content/uploads/2024/01/holiday-villa.jpeg", "https://amecdesign.com/wp-content/uploads/2024/01/dipndip.jpg",
        "https://amecdesign.com/wp-content/uploads/2024/01/almana.jpg", "https://amecdesign.com/wp-content/uploads/2024/01/Adwar.jpg",
        "https://amecdesign.com/wp-content/uploads/2024/01/AAC.jpg", "https://amecdesign.com/wp-content/uploads/2024/01/Macdonald2.jpg",
        "https://amecdesign.com/wp-content/uploads/2024/01/mavi-bonjuk2.jpg", "https://amecdesign.com/wp-content/uploads/2024/01/talabat2.jpg"
    ];
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 576) setLogosPerPage(3);
            else if (window.innerWidth <= 992) setLogosPerPage(4);
            else setLogosPerPage(6);
        };
        handleResize(); window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const totalPages = logosPerPage > 0 ? Math.ceil(clientLogos.length / logosPerPage) : 0;
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => { setCurrentPage(0); }, [totalPages]);
    
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || totalPages <= 1) return;
        const timer = setInterval(() => { if (!isPaused) setCurrentPage(prev => (prev + 1) % totalPages); }, 3000);
        return () => clearInterval(timer);
    }, [totalPages, isPaused]);

    const transformValue = `translateX(-${currentPage * 100}%)`;
    const logoPages = [];
    if (logosPerPage > 0) {
        for (let i = 0; i < clientLogos.length; i += logosPerPage) {
            logoPages.push(clientLogos.slice(i, i + logosPerPage));
        }
    }

    const getClientNameFromUrl = (url: string) => {
        try {
            const fileName = url.substring(url.lastIndexOf('/') + 1);
            const namePart = fileName.split('.')[0]; const name = namePart.replace(/\d+$/, '');
            return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        } catch (e) { return `Client logo`; }
    };

    return (
        <div className="clients-carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocus={() => setIsPaused(true)} onBlur={() => setIsPaused(false)}>
            <button className="clients-carousel-pause-btn" onClick={() => setIsPaused(p => !p)} aria-label={isPaused ? "Play clients carousel" : "Pause clients carousel"}>
              <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`} aria-hidden="true"></i>
            </button>
            <div className="clients-carousel-wrapper">
                <div className="clients-track" style={{ width: `${totalPages * 100}%`, transform: transformValue }}>
                    {logoPages.map((page, pageIndex) => (
                        <div className="clients-grid" key={pageIndex}>
                             {page.map((logo, logoIndex) => (
                                <div key={logoIndex} className="client-logo">
                                    <img src={logo} alt={`${getClientNameFromUrl(logo)} Logo`} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Lightbox = ({ image, onClose }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const lastFocusedElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (image) {
            lastFocusedElement.current = document.activeElement as HTMLElement;
            setTimeout(() => { contentRef.current?.focus(); }, 100);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
                else if (e.key === 'Tab') {
                    const focusableElements = contentRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (!focusableElements || focusableElements.length === 0) return;
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    if (e.shiftKey) { if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }}
                    else { if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }}
                }
            };
            document.addEventListener('keydown', handleKeyDown);
            return () => { document.removeEventListener('keydown', handleKeyDown); lastFocusedElement.current?.focus(); };
        }
    }, [image, onClose]);

    if (!image) return null;

    return (
        <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${image.title} - Project image viewer`}>
            <div ref={contentRef} className="lightbox-content" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
                <img src={image.src} alt={image.title} className="lightbox-image" />
                <button onClick={onClose} className="lightbox-close" aria-label="Close image viewer">&times;</button>
            </div>
        </div>
    );
};

const SectionDivider = () => (
    <div className="section-divider-wrapper">
        <div className="section-divider" />
    </div>
);

const useSmoothScroll = () => {
    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest('a');
            if (anchor && anchor.hash && new URL(anchor.href).pathname === window.location.pathname) {
                const targetId = anchor.hash.substring(1);
                if (!targetId) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const header = document.querySelector<HTMLElement>('.app-header');
                    const headerOffset = header ? header.offsetHeight + 10 : 90;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        };
        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);
};

const HomePage = () => {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const factsContainerRef = useRef<HTMLDivElement | null>(null);
  const clientsContainerRef = useRef<HTMLDivElement | null>(null);
  
  useSmoothScroll();
  
  const workItems = [
    { image: "https://images.adsttc.com/media/images/5de8/8330/3312/fd9f/fd00/01d3/large_jpg/08_Architect-Offices-Rivierstaete-Kantoren-Amsterdam-MVSA-%C2%A9Barwerd_van_der_Plas_W.jpg?1575519018", meta: "Architectural Design & Layout Planning", title: "Jazeera Business Center", description: "Office floors - Glass partitions - Reception & meeting suites" },
    { image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=60", meta: "Architectural Design", title: "Lusail Mixed-Use", description: "Retail podium - Serviced offices - Public realm upgrades" },
    { image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=60", meta: "Space & Layout Planning", title: "Residential Villas", description: "Efficient plans - Daylighting - Contemporary finishes" }
  ];

  const testimonials = [
    { quote: "The design was flawless. Their attention to detail and coordination saved us significant time and budget on our high-rise project.", author: "Project Manager, High-Rise Development", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&auto=format&fit=crop&q=60", },
    { quote: "The supervision and management for our villa were exceptional. The team was professional, transparent, and delivered beyond our expectations.", author: "Private Villa Owner, Doha", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&auto=format&fit=crop&q=60", },
    { quote: "Their innovative approach to engineering challenges is commendable. Taj Design Consult is a reliable partner for any complex construction endeavor.", author: "Lead Architect, Hospitality Project", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&h=500&auto=format&fit=crop&q=60", }
  ];

  const processSteps = [
    { title: 'Consult & Brief', icon: 'fas fa-clipboard-list', description: 'We start by listening. Understanding your vision, goals, and constraints is the foundation of our partnership.' },
    { title: 'Concept Options', icon: 'fas fa-lightbulb', description: 'Exploring possibilities. We develop multiple design concepts, presenting creative solutions that align with the brief.' },
    { title: 'Design Development', icon: 'fas fa-ruler-combined', description: 'Refining the vision. We flesh out the chosen concept with detailed drawings, material selections, and 3D models.' },
    { title: 'Docs & Tender', icon: 'fas fa-file-signature', description: 'Precision in planning. We produce comprehensive construction documents and manage the tendering process.' },
    { title: 'Construction Support', icon: 'fas fa-hard-hat', description: 'Ensuring quality. Our team provides site supervision and support to ensure the design is executed flawlessly.' },
    { title: 'Post-Occupancy', icon: 'fas fa-key', description: 'Beyond completion. We conduct a final review and handover, ensuring you are delighted with the final result.' },
  ];
  
  const services = [
    { icon: 'fas fa-archway', title: 'Architectural Design', description: 'Creating innovative and functional spaces from concept to construction, ensuring aesthetic appeal and structural integrity.', href: '/architectural-design.html' },
    { icon: 'fas fa-cogs', title: 'Engineering Consultancy', description: 'Providing expert technical advice and solutions across various engineering disciplines for robust and efficient project outcomes.', href: '/engineering-consultancy.html' },
    { icon: 'fas fa-tasks', title: 'Project Management Consultancy', description: 'Overseeing projects from inception to completion, ensuring they are delivered on time, within budget, and to the highest quality standards.', href: '/project-management.html' },
    { icon: 'fas fa-leaf', title: 'Sustainability & Energy', description: 'Integrating green building principles and energy-efficient solutions to create environmentally responsible and cost-effective designs.', href: '/sustainability-energy.html' },
  ];

  const sectors = [
    { name: 'Government & Public Sector', icon: 'fas fa-landmark' }, { name: 'Commercial & Mixed-Use', icon: 'fas fa-store-alt' }, { name: 'Residential', icon: 'fas fa-home' },
    { name: 'Industrial', icon: 'fas fa-industry' }, { name: 'Sports & Entertainment', icon: 'fas fa-futbol' }, { name: 'Hospitality & Leisure', icon: 'fas fa-concierge-bell' },
    { name: 'Education & Healthcare', icon: 'fas fa-graduation-cap' },
  ];

  const blogPosts = [
    { image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60", category: "Technology", date: "August 15, 2024", title: "The Future of BIM: AI and Generative Design", href: "/blog-bim-ai.html", },
    { image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop&q=60", category: "Architecture", date: "August 10, 2024", title: "Sustainable Materials in Modern Construction", href: "/blog-sustainable-materials.html", },
    { image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60", category: "Interior Design", date: "August 05, 2024", title: "Minimalism and Light: Crafting Serene Spaces", href: "/blog-minimalism-light.html", }
  ];

   useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) { document.querySelectorAll('.scroll-trigger').forEach(el => el.classList.add('visible')); return; }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elementsToReveal = document.querySelectorAll('.scroll-trigger');
    elementsToReveal.forEach((el) => observer.observe(el));
    return () => elementsToReveal.forEach((el) => observer.unobserve(el));
  }, []);

  // Simplified Parallax Effects
  useEffect(() => {
    const projectImageParallaxSpeed = 0.2;
    const workImageContainers = document.querySelectorAll<HTMLElement>('.work-image');
    const servicesSection = document.getElementById('our-services');

    const handleScroll = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Work image parallax
        workImageContainers.forEach(container => {
            const image = container.querySelector('img');
            if (!image) return;
            const rect = container.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yOffset = -rect.top * projectImageParallaxSpeed;
                image.style.setProperty('--parallax-y', `${yOffset}px`);
            }
        });

        // Services BG parallax
        if(servicesSection) {
            const rect = servicesSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.25;
                const yOffset = rect.top * speed;
                servicesSection.style.setProperty('--bg-parallax-y', `${yOffset}px`);
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      <HeroSection />
      
      <section id="about" className="content-section section-bg-white scroll-trigger fade-up">
        <div className="section-decorator decorator-right scroll-trigger" aria-hidden="true">
            <span className="decorator-text">01</span>
        </div>
        <div className="container">
          <div className="about-section">
            <div className="grid">
              <div className="about-image scroll-trigger fade-up">
                <img src="https://images.pexels.com/photos/256150/pexels-photo-256150.jpeg?cs=srgb&dl=pexels-pixabay-256150.jpg&fm=jpg" alt="A modern residential building with a swimming pool and patio." />
              </div>
              <div className="about-text">
                <h2 className="section-title scroll-trigger fade-up">WHO <strong>WE ARE</strong></h2>
                <p className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>
                  Taj Consultancy is a leading multidisciplinary firm in Qatar, delivering excellence in Architectural Design, Engineering, Project Management, and Sustainability. With decades of experience and a diverse expert team, we create landmark projects that blend innovation, integrity, and technical precision. From concept to completion, we turn ambitious ideas into sustainable, high-quality realities on time and on budget.
                </p>
                <div className="process-section scroll-trigger fade-up" style={{transitionDelay: '0.3s'}}>
                  <h3 className="sub-section-title">Our Process</h3>
                  <p>A transparent and collaborative path from your first idea to project handover.</p>
                  <div className="process-grid">
                    {processSteps.map((step, index) => (
                       <div className="process-item scroll-trigger fade-up" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                          <div className="process-icon-wrapper">
                            <i className={`process-icon ${step.icon}`} aria-hidden="true"></i>
                          </div>
                          <h4><span>0{index + 1}.</span> {step.title}</h4>
                          <p className="process-description">{step.description}</p>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="facts" className="content-section section-bg-dark scroll-trigger fade-up has-divider" style={{backgroundImage: `url(https://images.unsplash.com/photo-1562911791-c9a16a685121?w=1600&auto=format&fit=crop&q=60)`}}>
        <SectionDivider />
        <div className="section-decorator decorator-left scroll-trigger" aria-hidden="true">
            <span className="decorator-text">02</span>
        </div>
        <div className="container" ref={factsContainerRef}>
            <div className="facts-section">
                <div className="grid">
                    <div className="facts-title">
                         <h2 className="section-title scroll-trigger fade-up">Some Interesting <strong>Facts</strong></h2>
                    </div>
                    <div className="facts-text">
                        <p className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}><strong>Taj Design Consult</strong> operates on the belief that evidence-led design and technical precision create lasting value.</p>
                        <p className="scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>Our integrated teams bring together architecture, interiors, landscape, and urban design under one roof — ensuring seamless collaboration and faster delivery.</p>
                         <div className="facts-counters">
                            <div className="counter-item scroll-trigger fade-up" style={{ transitionDelay: '0.3s' }}>
                                <i className="fas fa-building-circle-check counter-icon" aria-hidden="true"></i>
                                <AnimatedCounter end={265} />
                                <p>Finished projects</p>
                            </div>
                            <div className="counter-item scroll-trigger fade-up" style={{ transitionDelay: '0.4s' }}>
                                <i className="fas fa-users-line counter-icon" aria-hidden="true"></i>
                                <AnimatedCounter end={240} />
                                <p>Happy customers</p>
                            </div>
                            <div className="counter-item scroll-trigger fade-up" style={{ transitionDelay: '0.5s' }}>
                                <i className="fas fa-helmet-safety counter-icon" aria-hidden="true"></i>
                                <AnimatedCounter end={36} />
                                <p>Opening Projects</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section id="our-services" className="content-section section-bg-white scroll-trigger fade-up has-divider">
        <SectionDivider />
        <div className="section-decorator decorator-right decorator-03 scroll-trigger" aria-hidden="true">
            <span className="decorator-text">03</span>
        </div>
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>Our <strong>Services</strong></h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-item scroll-trigger fade-up" style={{ transitionDelay: `${index * 0.1}s` }} key={index}>
                <svg className="service-border-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect className="service-border-rect" x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="7" pathLength="1" />
                </svg>
                <div className="service-icon-wrapper">
                  <i className={`service-icon ${service.icon}`} aria-hidden="true"></i>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <AppLink href={service.href} className="read-more-btn">Read More<span className="sr-only"> about {service.title}</span> <i className="fas fa-arrow-right" aria-hidden="true"></i></AppLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sectors" className="content-section section-bg-white scroll-trigger fade-up has-divider">
        <SectionDivider />
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>Sectors <strong>We Serve</strong></h2>
          <div className="sectors-grid">
            {sectors.map((sector, index) => (
              <div className="sector-item scroll-trigger fade-up" style={{ transitionDelay: `${index * 0.1}s` }} key={index}>
                <svg className="service-border-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect className="service-border-rect" x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="7" pathLength="1" />
                </svg>
                <div className="service-icon-wrapper">
                  <i className={`service-icon ${sector.icon}`} aria-hidden="true"></i>
                </div>
                <h3>{sector.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="content-section section-bg-dark scroll-trigger fade-up has-divider" style={{backgroundImage: `url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=60)`}}>
        <SectionDivider />
        <div className="section-decorator decorator-left scroll-trigger" aria-hidden="true">
            <span className="decorator-text">04</span>
        </div>
        <div className="container">
            <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'right'}}>Our Featured <strong>Projects</strong></h2>
            <div className="works-list">
                {workItems.map((item, index) => (
                    <div className={`work-item ${index % 2 === 1 ? 'reverse' : ''} scroll-trigger fade-up`} key={index}>
                        <div className="grid">
                             <div className="work-image" onClick={() => setLightboxImage({ src: item.image, title: item.title })}>
                                <div className="work-title-overlay">
                                    <h3>{item.title}</h3>
                                    <button className="view-projects-btn" aria-label={`View enlarged image for ${item.title}`}>View Project</button>
                                </div>
                                <img src={item.image} alt={item.description} />
                            </div>
                            <div className="work-info">
                                <p className="meta">{item.meta}</p>
                                <h3 className="section-title" style={{marginBottom: '20px', fontSize: '28px'}}><strong>{item.title}</strong></h3>
                                <p className="work-description">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>

     <section id="testimonials" className="content-section section-bg-dark scroll-trigger fade-up has-divider" style={{backgroundImage: `url(https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=1200&auto=format&fit=crop&q=60)`}}>
        <SectionDivider />
        <div className="section-decorator decorator-right decorator-05" aria-hidden="true">
            <span className="decorator-text scroll-trigger">05</span>
        </div>
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>What Our <strong>Clients Say</strong></h2>
            <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      <section id="clients" className="content-section section-bg-white scroll-trigger fade-up has-divider">
        <SectionDivider />
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>Our <strong>Clients</strong></h2>
           <ClientsCarousel />
        </div>
      </section>

      <section id="blog" className="content-section section-bg-white scroll-trigger fade-up has-divider">
        <SectionDivider />
        <div className="section-decorator decorator-left decorator-06 scroll-trigger" aria-hidden="true">
            <span className="decorator-text">06</span>
        </div>
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up">From <strong>The Blog</strong></h2>
          <div className="blog-grid">
            {blogPosts.map((post, index) => (
                <div className="blog-item scroll-trigger fade-up" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                    <div className="blog-item-image" style={{backgroundImage: `url(${post.image})`}} />
                    <div className="blog-item-content">
                        <p className="blog-item-meta">{post.category} / {post.date}</p>
                        <h3 className="blog-item-title"><AppLink href={post.href}>{post.title}</AppLink></h3>
                        <AppLink href={post.href} className="blog-item-link">Read More <i className="fas fa-arrow-right" aria-hidden="true"></i></AppLink>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [loading, setLoading] = useState(true);
  const { currentPath, navigate } = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
      if (servicePageData[currentPath]) {
        // This logic is for potential future SPA routing of service pages.
        // Currently, they are separate HTML files. This part won't be hit
        // when navigating directly to the .html files.
        return <div>Service Page: {servicePageData[currentPath].title}</div>;
      }
      if (blogPageData[currentPath]) {
        return <div>Blog Page: {blogPageData[currentPath].title}</div>;
      }
      // Default to home page content
      return <HomePage />;
  };
  
  // Determine header theme based on scroll position and which sections are visible
  const headerTheme = 'dark'; // Simplified for now, can be made dynamic later

  return (
    <NavigationContext.Provider value={navigate}>
      <div className={`app ${loading ? 'loading' : ''}`}>
        <SkipToContentLink />
        <CustomCursor />
        <WhatsAppChatWidget />
        <Header theme={headerTheme} />
        <div className="main-container">
          <LeftSidebar pageName="HOME" />
          <main className="main-content" id="main-content" tabIndex={-1}>
            {renderPage()}
            <Footer />
          </main>
        </div>
      </div>
    </NavigationContext.Provider>
  );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
