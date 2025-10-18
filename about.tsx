import React, { useState, useEffect, useRef, memo } from 'react';
import { createRoot } from 'react-dom/client';

declare const gsap: any;

// --- DATA & CONFIG ---

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

// --- SHARED & LAYOUT COMPONENTS ---

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
                                        if (link.href !== '#') {
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
    <header className={`app-header`}>
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
        <div className="home-text">ABOUT US</div>
      </div>
      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter" aria-hidden="true"></i></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true"></i></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in" aria-hidden="true"></i></a>
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
            'a, button, [role="button"], input, .whatsapp-widget, select, textarea, label, .team-member-card'
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

const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    return (
        <footer id="footer" className="app-footer">
            <WaveAnimation />
            <div className="container">
                <div className="copyright-section">
                    <span>2024 © Taj Design Consult. All rights reserved.</span>
                    <button className="to-top" onClick={scrollToTop} aria-label="Scroll back to top">To Top ↑</button>
                </div>
            </div>
          </footer>
    )
}

const CallToAction = () => (
    <section className="cta-section scroll-trigger fade-up">
        <div className="container">
            <h2 className="scroll-trigger fade-up" style={{ transitionDelay: '0.1s' }}>Let's Build the Future Together</h2>
            <p className="scroll-trigger fade-up" style={{ transitionDelay: '0.2s' }}>
                Have a vision for your next project? Our team of experts is ready to help you bring it to life. Contact us today to discuss your ideas.
            </p>
            <a href="contact.html" className="cta-button scroll-trigger fade-up" style={{ transitionDelay: '0.3s' }}>Get in Touch</a>
        </div>
    </section>
);

// --- MAIN PAGE COMPONENT ---

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

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

  const values = [
    { icon: 'fas fa-shield-alt', title: 'Integrity', description: 'We uphold the highest standards of integrity in all of our actions, building trust with our clients and partners.' },
    { icon: 'fas fa-lightbulb', title: 'Innovation', description: 'We relentlessly pursue new ideas and technologies to deliver creative and efficient solutions for every project.' },
    { icon: 'fas fa-trophy', title: 'Excellence', description: 'We are committed to outstanding quality and technical precision, ensuring every detail meets our rigorous standards.' },
    { icon: 'fas fa-handshake', title: 'Collaboration', description: 'Our multidisciplinary team works as one, fostering a seamless process from concept to completion.' }
  ];

  const team = [
    { name: 'John Doe', title: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&auto=format&fit=crop&q=60' },
    { name: 'Jane Smith', title: 'Lead Architect', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&auto=format&fit=crop&q=60' },
    { name: 'Sam Wilson', title: 'Head of Engineering', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&h=500&auto=format&fit=crop&q=60' },
    { name: 'Emily White', title: 'Director of Project Management', image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=500&h=500&auto=format&fit=crop&q=60' }
  ];

  return (
    <div className={`app ${loading ? 'loading' : ''}`}>
      <SkipToContentLink />
      <CustomCursor />
      <WhatsAppChatWidget />
      <Header />
      <div className="main-container">
        <LeftSidebar />
        <main className="main-content" id="main-content" tabIndex={-1}>
          <section className="about-hero-section scroll-trigger fade-up">
            <div className="container">
              <h1 className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>About Taj Design <strong>Consult</strong></h1>
            </div>
          </section>

          <section className="content-section">
            <div className="container">
              <div className="about-content-grid scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
                <div className="about-main-content">
                  <h2 className="section-title">Our <strong>Story</strong></h2>
                  <p>
                    Taj Consultancy is a premier multidisciplinary firm offering integrated Architectural Design, Engineering, Project & Construction Management, and Sustainability services. With decades of experience in Qatar and beyond, we have delivered landmark projects of national significance across a broad spectrum of industries. Our diverse team of architects, engineers, project managers, and sustainability experts works under one roof, enabling seamless coordination from initial concept through final delivery. We pride ourselves on a culture of integrity, innovation, and technical excellence – consistently exceeding client expectations by delivering projects on time, on budget, and to the highest quality standards.
                  </p>
                  <p>
                    Our design-forward approach combines creative vision with deep technical knowledge. Whether shaping a new urban skyline or optimizing a building’s energy performance, we bring an unwavering commitment to excellence and sustainability. Taj Consultancy turns ambitious ideas into built reality, providing end-to-end consultancy that drives value, efficiency, and lasting impact.
                  </p>
                </div>
                <div className="about-sidebar-image">
                  <img src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800&auto=format&fit=crop&q=60" alt="A diverse team of architects and engineers collaborating around a large table with blueprints in a modern, well-lit office." />
                </div>
              </div>
            </div>
          </section>

          <section id="values" className="content-section section-bg-light scroll-trigger fade-up">
            <div className="container">
              <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>Our Core <strong>Values</strong></h2>
              <div className="values-grid">
                {values.map((value, index) => (
                  <div className="value-card scroll-trigger fade-up" style={{ transitionDelay: `${index * 0.1}s` }} key={index}>
                     <div className="value-icon-wrapper">
                        <i className={`value-icon ${value.icon}`} aria-hidden="true"></i>
                     </div>
                     <h3>{value.title}</h3>
                     <p>{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="team" className="content-section scroll-trigger fade-up">
            <div className="container">
              <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>Meet Our <strong>Leadership</strong></h2>
              <div className="team-grid">
                {team.map((member, index) => (
                    <div className="team-member-card scroll-trigger fade-up" style={{ transitionDelay: `${index * 0.1}s` }} key={index}>
                        <div className="team-member-image">
                            <img src={member.image} alt={`Professional headshot of ${member.name}`} />
                        </div>
                        <div className="team-member-info">
                            <h3>{member.name}</h3>
                            <p>{member.title}</p>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          </section>
          
          <CallToAction />
          <Footer />
        </main>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<AboutPage />);
