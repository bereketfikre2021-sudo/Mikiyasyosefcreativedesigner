import React from 'react';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'fab fa-linkedin' },
    { name: 'Behance', url: 'https://behance.net', icon: 'fab fa-behance' },
    { name: 'Telegram', url: 'https://t.me/Miko_Cr7', icon: 'fab fa-telegram' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo and Name */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/img/Mikiyas Yosef Logo.svg" alt="Mikiyas Yosef" className="footer-logo-img" />
            </div>
            <span className="footer-name">Mikiyas Yosef</span>
          </div>

          {/* Social Links */}
          <div className="footer-social">
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.url} 
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            <p>&copy; 2024 Mikiyas Yosef. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;