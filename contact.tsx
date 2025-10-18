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
        <div className="home-text">CONTACT</div>
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
            'a, button, [role="button"], input, .whatsapp-widget, select, textarea, label'
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
        <i className="fab fa-whatsapp whatsapp-icon" aria-hidden="true