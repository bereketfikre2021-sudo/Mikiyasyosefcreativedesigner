import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'portfolio', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
    setActiveSection(sectionId);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <img src="/img/Mikiyas Yosef Logo.svg" alt="Mikiyas Yosef" className="logo-img" />
        </div>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <button 
              onClick={() => scrollToSection('home')} 
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            >
              <span>Home</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('about')} 
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            >
              <span>About</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('portfolio')} 
              className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
            >
              <span>Portfolio</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('experience')} 
              className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}
            >
              <span>Experience</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            >
              <span>Contact</span>
            </button>
          </li>
        </ul>
        
        <div className="nav-actions">
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
