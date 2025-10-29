// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const ctaButton = document.querySelector('.cta-button');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const modal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close');
const contactForm = document.querySelector('.contact-form');

// Project data
const projects = {
    1: {
        title: "E-commerce Platform",
        description: "A full-stack e-commerce solution built with React and Node.js. Features include user authentication, product management, shopping cart, payment integration, and admin dashboard. The platform handles thousands of products and supports multiple payment methods.",
        tech: "React • Node.js • MongoDB • Stripe",
        demo: "#",
        github: "#",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    },
    2: {
        title: "Mobile App",
        description: "Cross-platform mobile application developed with React Native. The app provides real-time data synchronization, offline capabilities, push notifications, and seamless user experience across iOS and Android platforms.",
        tech: "React Native • Firebase • Redux",
        demo: "#",
        github: "#",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"
    },
    3: {
        title: "Data Dashboard",
        description: "Interactive data visualization dashboard that processes and displays complex datasets. Features include real-time charts, filtering capabilities, export functionality, and responsive design for various screen sizes.",
        tech: "Vue.js • D3.js • Python • FastAPI",
        demo: "#",
        github: "#",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
    },
    4: {
        title: "SaaS Platform",
        description: "Cloud-based software-as-a-service platform with multi-tenant architecture. Includes user management, subscription billing, API integration, and scalable infrastructure built on AWS.",
        tech: "Next.js • AWS • PostgreSQL • Docker",
        demo: "#",
        github: "#",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"
    },
    5: {
        title: "AI Chatbot",
        description: "Intelligent customer service chatbot powered by machine learning. Features natural language processing, context awareness, multi-language support, and seamless integration with existing systems.",
        tech: "Python • OpenAI • FastAPI • Redis",
        demo: "#",
        github: "#",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"
    },
    6: {
        title: "Blockchain App",
        description: "Decentralized finance application built on Ethereum blockchain. Features include wallet integration, smart contracts, token swapping, and DeFi protocols with secure transaction handling.",
        tech: "Web3 • Solidity • Ethers.js • IPFS",
        demo: "#",
        github: "#",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    }
};

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// CTA Button scroll to portfolio
ctaButton.addEventListener('click', () => {
    const portfolioSection = document.querySelector('#portfolio');
    if (portfolioSection) {
        const offsetTop = portfolioSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
});

// Portfolio item click handlers
portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const projectId = item.getAttribute('data-project');
        const project = projects[projectId];
        
        if (project) {
            openModal(project);
        }
    });
});

// Open project modal
function openModal(project) {
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTech = document.getElementById('modalTech');
    const modalDemo = document.getElementById('modalDemo');
    const modalGithub = document.getElementById('modalGithub');
    
    modalImg.src = project.image;
    modalImg.alt = project.title;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalTech.textContent = project.tech;
    modalDemo.href = project.demo;
    modalGithub.href = project.github;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Close modal
closeModal.addEventListener('click', () => {
    closeModalFunction();
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunction();
    }
});

// Close modal function
function closeModalFunction() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModalFunction();
    }
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4ecdc4' : '#ff6b6b'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Add fade-in class to elements that should animate
function addFadeInClasses() {
    const sections = document.querySelectorAll('section');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const skillItems = document.querySelectorAll('.skill-item');
    
    sections.forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('fade-in');
        }
    });
    
    portfolioItems.forEach(item => {
        item.classList.add('fade-in');
    });
    
    timelineItems.forEach(item => {
        item.classList.add('fade-in');
    });
    
    skillItems.forEach(item => {
        item.classList.add('fade-in');
    });
}

// Parallax effect for hero background
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Navbar background on scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
}

// Active navigation link highlighting
function handleActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Skill items hover effect
function handleSkillHover() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Timeline horizontal scroll
function handleTimelineScroll() {
    const timeline = document.querySelector('.timeline');
    const timelineContainer = document.querySelector('.timeline-container');
    
    if (timeline && timelineContainer) {
        let isScrolling = false;
        
        timelineContainer.addEventListener('wheel', (e) => {
            if (!isScrolling) {
                e.preventDefault();
                isScrolling = true;
                
                const scrollAmount = e.deltaY > 0 ? 300 : -300;
                timelineContainer.scrollLeft += scrollAmount;
                
                setTimeout(() => {
                    isScrolling = false;
                }, 100);
            }
        });
    }
}

// Particle animation for contact section
function createParticles() {
    const particleField = document.querySelector('.particle-field');
    
    if (particleField) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(0, 212, 255, 0.5);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${5 + Math.random() * 10}s linear infinite;
            `;
            
            particleField.appendChild(particle);
        }
    }
}

// Add particle animation keyframes
function addParticleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title .title-line:first-child');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
}

// Initialize all functionality
function init() {
    addFadeInClasses();
    handleSkillHover();
    handleTimelineScroll();
    createParticles();
    addParticleAnimation();
    initTypingEffect();
    
    // Event listeners
    window.addEventListener('scroll', () => {
        handleScrollAnimations();
        handleParallax();
        handleNavbarScroll();
        handleActiveNavLink();
    });
    
    // Initial call
    handleScrollAnimations();
    handleNavbarScroll();
    handleActiveNavLink();
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', init);

// Add CSS for active nav link
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;
document.head.appendChild(activeNavStyle);
