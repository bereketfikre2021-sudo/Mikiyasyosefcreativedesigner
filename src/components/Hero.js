import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const canvasRef = useRef(null);
  const rafIdRef = useRef(null);
  const resizeHandlerRef = useRef(null);
  const counterTimerRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [countedStats, setCountedStats] = useState({
    projects: 0,
    years: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(!!mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);

    if (!mql.matches) {
      initParticleSystem();
      startCountingAnimation();
    } else {
      // Respect reduced motion: set final values immediately
      setCountedStats({ projects: 50, years: 5, satisfaction: 100 });
    }

    return () => {
      mql.removeEventListener?.('change', onChange);
      // Cleanup particle animation and listeners
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
      }
      if (counterTimerRef.current) {
        clearInterval(counterTimerRef.current);
      }
    };
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
    counterTimerRef.current = timer;
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
    resizeHandlerRef.current = resizeCanvas;

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

      rafIdRef.current = requestAnimationFrame(animate);
    };

    if (!prefersReducedMotion) {
      animate();
    }
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
            <a className="btn-secondary" href="https://heyzine.com/flip-book/2e51bd7d15.html" target="_blank" rel="noopener noreferrer">
              <span>View CV</span>
              <i className="fas fa-file-alt" aria-hidden="true"></i>
            </a>
            <a className="btn-primary" href="#contact">
              <span>Hire Me</span>
              <i className="fas fa-briefcase" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="hero-social">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
            <i className="fab fa-github" aria-hidden="true"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
            <i className="fab fa-linkedin" aria-hidden="true"></i>
          </a>
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Behance">
            <i className="fab fa-behance" aria-hidden="true"></i>
          </a>
          <a href="https://t.me/Miko_Cr7" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Telegram">
            <i className="fab fa-telegram" aria-hidden="true"></i>
          </a>
        </div>

      </div>
    </section>
  );
};

export default Hero;
