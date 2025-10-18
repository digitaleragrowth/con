
import React, { useState, useEffect, useRef, memo, MouseEventHandler } from 'react';
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

const AppLink = ({ href, className = '', children, onClick, ...props }: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  [key: string]: any;
}) => {
    const isToggle = href === '#';

    const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
        if (isToggle) {
            e.preventDefault();
        }
        
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <a 
            href={href} 
            className={className} 
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
                                         <li key={subLink.name}><AppLink href={subLink.href} onClick={onClose}>{subLink.name}</AppLink></li>
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
        <AppLink href="/index.html" className="logo-text">Taj Design Consult</AppLink>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <ul>
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
      <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} />
    </header>
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
        <i className="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i>
    </a>
);

const ContactPageForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const successMessageRef = useRef<HTMLHeadingElement>(null);

    const validate = (data: typeof formData) => {
        const errors: Record<string, string> = {};
        if (!data.name.trim()) errors.name = 'Full Name is required.';
        if (!data.email.trim()) { errors.email = 'Email Address is required.'; } else if (!/\S+@\S+\.\S+/.test(data.email)) { errors.email = 'Email Address is invalid.'; }
        if (!data.subject.trim()) errors.subject = 'Subject is required.';
        if (!data.message.trim() || data.message.length < 20) { errors.message = 'Message must be at least 20 characters.'; }
        return errors;
    };

    useEffect(() => { if (Object.keys(touched).length > 0) setFormErrors(validate(formData)); }, [formData, touched]);
    useEffect(() => { if (isSubmitted) { successMessageRef.current?.focus(); successMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}, [isSubmitted]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => setTouched(prev => ({ ...prev, [e.target.name]: true }));

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTouched({ name: true, email: true, subject: true, message: true });
        const currentErrors = validate(formData);
        setFormErrors(currentErrors);

        if (Object.keys(currentErrors).length > 0) {
            const firstErrorField = Object.keys(currentErrors)[0];
            if (firstErrorField) {
                document.getElementById(firstErrorField)?.focus();
            }
            return;
        }

        // Simulating mailto link generation
        const { name, email, subject, message } = formData;
        const mailtoSubject = encodeURIComponent(subject);
        const mailtoBody = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`
        );

        window.location.href = `mailto:info@tajdc.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        setIsSubmitted(true);
    };

    const handleResetForm = () => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouched({});
        setFormErrors({});
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.focus();
        }
    };


    return (
        <div className="contact-form-container">
            <form onSubmit={handleSubmit} className={`contact-page-form ${isSubmitted ? 'submitted' : ''}`} aria-hidden={isSubmitted} noValidate>
                 <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} onBlur={handleBlur} required className={touched.name && formErrors.name ? 'invalid' : ''} aria-invalid={touched.name && !!formErrors.name} aria-describedby={touched.name && formErrors.name ? 'name-error' : undefined} />
                        {touched.name && formErrors.name && <span id="name-error" className="error-message" role="alert">{formErrors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} required className={touched.email && formErrors.email ? 'invalid' : ''} aria-invalid={touched.email && !!formErrors.email} aria-describedby={touched.email && formErrors.email ? 'email-error' : undefined} />
                        {touched.email && formErrors.email && <span id="email-error" className="error-message" role="alert">{formErrors.email}</span>}
                    </div>
                </div>
                 <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} onBlur={handleBlur} required className={touched.subject && formErrors.subject ? 'invalid' : ''} aria-invalid={touched.subject && !!formErrors.subject} aria-describedby={touched.subject && formErrors.subject ? 'subject-error' : undefined} />
                    {touched.subject && formErrors.subject && <span id="subject-error" className="error-message" role="alert">{formErrors.subject}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message (min. 20 characters)</label>
                    <textarea id="message" name="message" rows={6} value={formData.message} onChange={handleInputChange} onBlur={handleBlur} required className={touched.message && formErrors.message ? 'invalid' : ''} aria-invalid={touched.message && !!formErrors.message} aria-describedby={touched.message && formErrors.message ? 'message-error' : undefined}></textarea>
                    {touched.message && formErrors.message && <span id="message-error" className="error-message" role="alert">{formErrors.message}</span>}
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
            </form>
             <div className={`success-message ${isSubmitted ? 'visible' : ''}`} aria-hidden={!isSubmitted} aria-live="polite">
                <i className="fas fa-check-circle" aria-hidden="true"></i>
                <h3 ref={successMessageRef} tabIndex={-1}>Your Message is Ready!</h3>
                <p>
                    We've prepared an email for you. Please click 'send' in your mail application to complete the process.
                </p>
                <button onClick={handleResetForm} className="submit-btn" style={{marginTop: '20px', width: 'auto'}}>Send Another Message</button>
            </div>
        </div>
    );
};

const ContactPage = () => {
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
  
  return (
    <>
      <section id="contact-hero" className="contact-hero-section scroll-trigger fade-up">
        <div className="container">
          <h1 className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>Get In <strong>Touch</strong></h1>
          <p className="scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
            We're here to help and answer any question you might have. We look forward to hearing from you.
          </p>
        </div>
      </section>

      <section id="contact-details" className="content-section">
        <div className="container">
          <div className="contact-details-grid scroll-trigger fade-up">
            <div className="contact-info">
              <h2 className="section-title">Contact <strong>Information</strong></h2>
              <div className="contact-info-blocks">
                <div className="info-block">
                  <div className="icon"><i className="fas fa-map-marker-alt" aria-hidden="true"></i></div>
                  <div>
                    <h4>Our Location</h4>
                    <p>14th floor, Al Jazeera tower, Westbay, Doha Qatar</p>
                  </div>
                </div>
                <div className="info-block">
                  <div className="icon"><i className="fas fa-envelope" aria-hidden="true"></i></div>
                  <div>
                    <h4>Email Us</h4>
                    <p><a href="mailto:info@tajdc.com">info@tajdc.com</a></p>
                  </div>
                </div>
                <div className="info-block">
                  <div className="icon"><i className="fas fa-phone" aria-hidden="true"></i></div>
                  <div>
                    <h4>Call Us</h4>
                    <p><a href="tel:+97477123400">+974 7712 3400</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-form-section" className="contact-form-section content-section">
         <div className="container">
           <h2 id="contact-form-title" className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Send Us A <strong>Message</strong></h2>
           <div className="scroll-trigger fade-up" role="region" aria-labelledby="contact-form-title">
            <ContactPageForm />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.backgroundColor = '#fff';
        const timer = setTimeout(() => setLoading(false), 200);
        return () => {
            document.body.style.backgroundColor = '';
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={`app no-sidebar ${loading ? 'loading' : ''}`}>
            <SkipToContentLink />
            <CustomCursor />
            <WhatsAppChatWidget />
            <Header />
            <div className="main-container">
                <main className="main-content" id="main-content" tabIndex={-1}>
                    <ContactPage />
                </main>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
