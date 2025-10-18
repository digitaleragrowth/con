import React, { useState, useEffect, useRef, memo } from 'react';
import { createRoot } from 'react-dom/client';

declare const gsap: any;

const servicesSubLinks = [
  { name: 'Architectural Design', href: 'architectural-design.html' },
  { name: 'Engineering Consultancy', href: 'engineering-consultancy.html' },
  { name: 'Project Management Consultancy', href: 'project-management.html' },
  { name: 'Sustainability & Energy', href: 'sustainability-energy.html' },
];

const navLinks = [
  { name: 'Home', href: '/index.html' },
  { name: 'About Us', href: '/about.html' },
  { name: 'Works/Projects', href: '/index.html#works' },
  { name: 'Services', href: '/index.html#our-services', subLinks: servicesSubLinks },
  { name: 'Blog', href: '/index.html#blog' },
  { name: 'Careers', href: '/careers.html' },
  { name: 'Contact', href: '/contact.html' },
];

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
    
    const handleServicesToggle = (e: React.MouseEvent) => {
        e.preventDefault();
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
                             <a 
                                href={link.subLinks ? '#' : link.href} 
                                onClick={(e) => {
                                    if (link.subLinks) {
                                        handleServicesToggle(e);
                                    } else {
                                        onClose();
                                        // Since this is not an SPA, we need to manually navigate for non-hash links
                                        if (!link.href.startsWith('#')) {
                                            window.location.href = link.href;
                                        }
                                    }
                                }}
                                aria-haspopup={!!link.subLinks}
                                aria-expanded={link.subLinks ? isServicesOpen : undefined}
                                aria-controls={link.subLinks ? `mobile-${link.name}-submenu` : undefined}
                                id={link.subLinks ? `mobile-${link.name}-toggle` : undefined}
                             >
                                 {link.name}
                                 {link.subLinks && <i className={`fas fa-chevron-down dropdown-indicator ${isServicesOpen ? 'open' : ''}`} aria-hidden="true"></i>}
                             </a>
                             {link.subLinks && (
                                 <ul id={`mobile-${link.name}-submenu`} className={`mobile-submenu ${isServicesOpen ? 'open' : ''}`} aria-hidden={!isServicesOpen}>
                                     {link.subLinks.map(subLink => (
                                         <li key={subLink.name}><a href={subLink.href} onClick={onClose}>{subLink.name}</a></li>
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

const SkipToContentLink = () => (
    <a href="#main-content" className="skip-to-content-link">
        Skip to main content
    </a>
);

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
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

  return (
    <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <a href="/index.html" className="logo-text">Taj Design Consult</a>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <ul>
          {navLinks.map((link) => (
             <li 
              key={link.name} 
              className={`${link.subLinks ? 'has-dropdown' : ''} ${link.name === 'Services' && isServicesDropdownOpen ? 'open' : ''}`}
              ref={link.name === 'Services' ? servicesDropdownContainerRef : null}
            >
              <a 
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
              </a>
              {link.subLinks && (
                <ul id="services-dropdown-menu" className="dropdown-menu" role="menu" aria-labelledby="services-menu-toggle">
                  {link.subLinks.map((subLink) => (
                    <li key={subLink.name} role="presentation">
                      <a href={subLink.href} role="menuitem" onKeyDown={handleDropdownItemKeyDown}>{subLink.name}</a>
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
      <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} />
    </header>
  );
};

const LeftSidebar = () => {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-top">
        <div className="divider" />
        <div className="home-text">SERVICES</div>
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
            'a, button, [role="button"], .project-card'
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

const RelatedProjects = ({ projects, title }) => (
    <section className="related-projects-section content-section scroll-trigger fade-up">
        <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center' }}>Our Work in <strong>{title}</strong></h2>
            <div className="project-grid">
                {projects.map((project, index) => (
                    <div className="project-card scroll-trigger fade-up" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                        <div className="project-card-image">
                            <img src={project.image} alt={project.title} />
                        </div>
                        <div className="project-card-content">
                            <h3>{project.title}</h3>
                            <p>{project.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CallToAction = () => (
    <section className="cta-section scroll-trigger fade-up">
        <div className="container">
            <h2 className="scroll-trigger fade-up" style={{ transitionDelay: '0.1s' }}>Let's Build the Future Together</h2>
            <p className="scroll-trigger fade-up" style={{ transitionDelay: '0.2s' }}>
                Have a vision for your next project? Our team of experts is ready to help you bring it to life. Contact us today to discuss your ideas.
            </p>
            <a href="/contact.html" className="cta-button scroll-trigger fade-up" style={{ transitionDelay: '0.3s' }}>Get in Touch</a>
        </div>
    </section>
);

const ServicePage = () => {
  const [loading, setLoading] = useState(true);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    document.body.style.backgroundColor = '#fff';
    const timer = setTimeout(() => setLoading(false), 200);
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
    
    return () => {
        document.body.style.backgroundColor = '';
        clearTimeout(timer);
        elementsToReveal.forEach((el) => observer.unobserve(el));
    }
  }, []);

  const services = [
    'Project Management – Comprehensive project planning, execution, and closing services representing the client’s interests.',
    'Construction Management & Supervision – On-site construction supervision, contractor coordination, and quality control.',
    'Technical Review – Independent technical audits and constructability reviews of designs and plans.',
    'Cost Estimating & Management – Budget development, cost control, value engineering, and financial reporting throughout the project.',
    'Construction Claims Consulting – Claims analysis, mitigation strategies, and dispute resolution support during construction.',
    'Independent Contract Document Review – Thorough review of contracts, drawings, and specifications to ensure clarity and completeness.',
    'Bid Management & Tender Evaluation – Management of the bidding process, contractor pre-qualification, and tender analysis.',
    'Quality Assurance & Control (QA/QC) – Establishing and implementing QA/QC protocols to meet project standards.',
    'Commissioning & Handover Management – Managing the final stages of a project, including system testing, training, and final handover.',
  ];
  
  const relatedProjects = [
    { image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=60", title: "Metropolis Plaza", category: "Construction Supervision" },
    { image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=60", title: "Luxury Villa Development", category: "Cost & Bid Management" },
    { image: "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800&auto=format&fit=crop&q=60", title: "Coastal Resort & Spa", category: "Full-Cycle Project Management" },
  ];

  return (
    <div className={`app ${loading ? 'loading' : ''}`}>
      <SkipToContentLink />
      <CustomCursor />
      <Header />
      <div className="main-container">
        <LeftSidebar />
        <main className="main-content" id="main-content" tabIndex={-1}>
          <section className="service-hero-section scroll-trigger fade-up">
            <div className="container">
              <h1 className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>Project & Construction <strong>Management</strong></h1>
            </div>
          </section>

          <section className="content-section">
            <div className="container">
              <div className="service-content-grid scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
                <div className="service-main-content">
                    <p>We provide comprehensive leadership for projects of all sizes, ensuring your vision is realized on time, on budget, and to the highest quality standards. Our Project Management Consultancy (PMC) team serves as a trusted extension of our clients, managing every phase of a project from inception to handover. With a proven track record on some of Qatar’s most iconic developments, we specialize in navigating complex projects with precision and foresight. Our deep local experience gives us an unparalleled understanding of regional regulations and market dynamics, allowing us to proactively mitigate risks and drive project success.</p>
                    <p>Our methodology is built on a foundation of clear communication, rigorous control, and proactive problem-solving. We implement robust systems for planning, cost management, and quality assurance, ensuring complete transparency for all stakeholders. By integrating seamlessly with design teams, contractors, and authorities, we foster a collaborative environment focused on shared goals. Whether managing a single project or a large-scale program, our commitment is to safeguard our clients' interests and deliver outcomes that exceed expectations.</p>
                </div>
                <div className="service-sidebar-image">
                  <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop&q=60" alt="Construction site with project managers reviewing plans." />
                </div>
              </div>

              <div className="service-list-section scroll-trigger fade-up" style={{transitionDelay: '0.3s'}}>
                <h2 className="section-title">Our Project Management services include:</h2>
                <ul className="service-list">
                  {services.map((service, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle" aria-hidden="true"></i>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </section>
          
          <RelatedProjects projects={relatedProjects} title="Project Management" />
          <CallToAction />

          <footer id="footer" className="app-footer">
            <WaveAnimation />
            <div className="container">
                <div className="copyright-section">
                    <span>2024 © Taj Design Consult. All rights reserved.</span>
                    <button className="to-top" onClick={scrollToTop} aria-label="Scroll back to top">To Top ↑</button>
                </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<ServicePage />);