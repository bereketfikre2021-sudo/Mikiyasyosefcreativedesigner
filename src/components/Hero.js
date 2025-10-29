import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [countedStats, setCountedStats] = useState({
    projects: 0,
    years: 0,
    satisfaction: 0
  });

  useEffect(() => {
    initParticleSystem();
    startCountingAnimation();
  }, []);

  const startCountingAnimation = () => {
    const targets = { projects: 50, years: 5, satisfaction: 100 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCountedStats({
        projects: Math.floor(targets.projects * progress),
        years: Math.floor(targets.years * progress),
        satisfaction: Math.floor(targets.satisfaction * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCountedStats(targets);
      }
    }, stepDuration);
  };

  const initParticleSystem = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 80;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() * 60 + 180
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.x -= dx * force * 0.01;
          particle.y -= dy * force * 0.01;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();

        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${0.08 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <section id="home" className="hero" onMouseMove={handleMouseMove}>
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
      
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            <span>Available for work</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            <span className="title-main">Mikiyas Yosef</span>
            <span className="title-gradient">Creative Developer</span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            Crafting digital experiences through innovative design, 
            smooth animations, and clean code
          </p>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{countedStats.projects}+</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{countedStats.years}+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{countedStats.satisfaction}%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-actions">
            <button className="btn-primary" onClick={scrollToPortfolio}>
              <span>View My Work</span>
              <i className="fas fa-arrow-right"></i>
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              <span>Get In Touch</span>
              <i className="fas fa-envelope"></i>
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="hero-social">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Behance">
            <i className="fab fa-behance"></i>
          </a>
          <a href="https://t.me/Miko_Cr7" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Telegram">
            <i className="fab fa-telegram"></i>
          </a>
        </div>

      </div>
    </section>
  );
};

export default Hero;
