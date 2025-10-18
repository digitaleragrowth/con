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
  { name: 'About Us', href: '/index.html#facts' },
  { name: 'Works/Projects', href: '/index.html#works' },
  { name: 'Services', href: '/index.html#our-services', subLinks: servicesSubLinks },
  { name: 'Blog', href: '/index.html#blog' },
  { name: 'Careers', href: '/careers.html' },
  { name: 'Contact', href: '/contact.html' },
];

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
        <div className="home-text">CAREERS</div>
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
            'a, button, [role="button"], input, .job-item-header, .whatsapp-widget, select, textarea, label'
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

const ApplicationForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [fileName, setFileName] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', position: careerOpenings[0].title, coverLetter: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const successMessageRef = useRef<HTMLHeadingElement>(null);

    const validate = (data: typeof formData, currentFileName: string) => {
        const errors: Record<string, string> = {};
        if (!data.name.trim()) errors.name = 'Full Name is required.';
        if (!data.email.trim()) { errors.email = 'Email Address is required.'; } else if (!/\S+@\S+\.\S+/.test(data.email)) { errors.email = 'Email Address is invalid.'; }
        if (!data.phone.trim()) { errors.phone = 'Phone Number is required.'; } else if (!/^\+?[0-9\s-()]{7,}$/.test(data.phone)) { errors.phone = 'Phone Number appears to be invalid.'; }
        if (!data.coverLetter.trim() || data.coverLetter.length < 50) { errors.coverLetter = 'Cover Letter is required and must be at least 50 characters.'; }
        if (!currentFileName) { errors.cv = 'CV/Resume is required.'; }
        return errors;
    };

    useEffect(() => { if (Object.keys(touched).length > 0) setFormErrors(validate(formData, fileName)); }, [formData, fileName, touched]);
    useEffect(() => { if (isSubmitted) { successMessageRef.current?.focus(); successMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}, [isSubmitted]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setTouched(prev => ({ ...prev, [e.target.name]: true }));
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.files && e.target.files.length > 0 ? e.target.files[0].name : '');
        setTouched(prev => ({...prev, cv: true}));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTouched({ name: true, email: true, phone: true, position: true, coverLetter: true, cv: true });
        const currentErrors = validate(formData, fileName);
        setFormErrors(currentErrors);
        if (Object.keys(currentErrors).length > 0) {
             const firstErrorField = Object.keys(currentErrors)[0];
             if (firstErrorField) {
                 let elementToFocus: HTMLElement | null = (firstErrorField === 'cv') ? document.querySelector<HTMLLabelElement>('label[for="cv"]') : document.getElementById(firstErrorField);
                 elementToFocus?.focus();
             }
             return;
        }
        setIsSubmitted(true);
    };

    const handleResetForm = () => {
        setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', position: careerOpenings[0].title, coverLetter: '' });
        setFileName(''); setTouched({});
        const fileInput = document.getElementById('cv') as HTMLInputElement; if(fileInput) fileInput.value = '';
        document.getElementById('name')?.focus();
    };

    const isFormValid = Object.keys(validate(formData, fileName)).length === 0;

    return (
        <div className="application-form-container">
            <form onSubmit={handleSubmit} className={`application-form ${isSubmitted ? 'submitted' : ''}`} aria-hidden={isSubmitted} noValidate>
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
                 <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} required className={touched.phone && formErrors.phone ? 'invalid' : ''} aria-invalid={touched.phone && !!formErrors.phone} aria-describedby={touched.phone && formErrors.phone ? 'phone-error' : undefined} />
                        {touched.phone && formErrors.phone && <span id="phone-error" className="error-message" role="alert">{formErrors.phone}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="position">Position Applying For</label>
                        <select id="position" name="position" value={formData.position} onChange={handleInputChange} onBlur={handleBlur} required>
                            {careerOpenings.map(job => (<option key={job.title} value={job.title}>{job.title}</option>))}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="coverLetter">Cover Letter (min. 50 characters)</label>
                    <textarea id="coverLetter" name="coverLetter" rows={6} value={formData.coverLetter} onChange={handleInputChange} onBlur={handleBlur} required className={touched.coverLetter && formErrors.coverLetter ? 'invalid' : ''} aria-invalid={touched.coverLetter && !!formErrors.coverLetter} aria-describedby={touched.coverLetter && formErrors.coverLetter ? 'coverLetter-error' : undefined}></textarea>
                    {touched.coverLetter && formErrors.coverLetter && <span id="coverLetter-error" className="error-message" role="alert">{formErrors.coverLetter}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="cv">Upload CV/Resume</label>
                    <label htmlFor="cv" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (document.getElementById('cv') as HTMLInputElement)?.click(); }}} className={`custom-file-upload ${touched.cv && formErrors.cv ? 'invalid' : ''}`} aria-describedby={touched.cv && formErrors.cv ? 'cv-error' : undefined}>
                        <i className="fas fa-cloud-upload-alt" aria-hidden="true"></i>
                        <span>{fileName || 'Choose File...'}</span>
                    </label>
                    <input type="file" id="cv" name="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" required aria-invalid={touched.cv && !!formErrors.cv} />
                    {touched.cv && formErrors.cv && <span id="cv-error" className="error-message" role="alert" style={{position: 'static', marginTop: '5px'}}>{formErrors.cv}</span>}
                </div>
                <button type="submit" className="submit-btn" disabled={!isFormValid}>Submit Application</button>
            </form>
             <div className={`success-message ${isSubmitted ? 'visible' : ''}`} aria-hidden={!isSubmitted} aria-live="polite">
                <i className="fas fa-check-circle" aria-hidden="true"></i>
                <h3 ref={successMessageRef} tabIndex={-1}>Thank You!</h3>
                <p>Your application has been submitted successfully. We will review your information and be in touch shortly.</p>
                 <button onClick={handleResetForm} className="submit-btn" style={{marginTop: '20px', width: 'auto'}}>Submit Another Application</button>
            </div>
        </div>
    );
};

const CareersPage = () => {
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
      <section id="careers-hero" className="careers-hero-section scroll-trigger fade-up">
        <div className="container">
          <h1 className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>Join Our <strong>Team</strong></h1>
          <p className="scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
            We believe our strength lies in our people. At Taj Design Consult, we foster a collaborative and innovative environment where creativity thrives. We're always looking for passionate individuals to join us in shaping the future of design.
          </p>
        </div>
      </section>
      <section id="application" className="content-section">
        <div className="container">
          <h2 id="openings-title" className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Current <strong>Openings</strong></h2>
          <div className="openings-list scroll-trigger fade-up" role="region" aria-labelledby="openings-title">
            {careerOpenings.map((job, index) => (
                <div className="opening-item scroll-trigger fade-up" style={{transitionDelay: `${index * 0.1}s`}} key={index}>
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>
                </div>
            ))}
          </div>
           <h2 id="application-form-title" className="section-title scroll-trigger fade-up" style={{textAlign: 'center', marginTop: '80px'}}>Application <strong>Form</strong></h2>
           <div className="scroll-trigger fade-up" role="region" aria-labelledby="application-form-title">
            <ApplicationForm />
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
        <div className={`app ${loading ? 'loading' : ''}`}>
            <SkipToContentLink />
            <CustomCursor />
            <WhatsAppChatWidget />
            <Header />
            <div className="main-container">
                <LeftSidebar />
                <main className="main-content" id="main-content" tabIndex={-1}>
                    <CareersPage />
                </main>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);