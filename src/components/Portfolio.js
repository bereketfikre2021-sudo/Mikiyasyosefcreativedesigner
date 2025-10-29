import React, { useState, useEffect, useRef } from 'react';

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const portfolioRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: "Brand Identity Design",
      description: "Complete brand identity package for tech startup",
      tech: "Adobe Illustrator • Photoshop • InDesign",
      category: "branding",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      demo: "#",
      behance: "#",
      featured: true
    },
    {
      id: 2,
      title: "UI/UX Design System",
      description: "Comprehensive design system for mobile app",
      tech: "Figma • Adobe XD • Principle",
      category: "ui-ux",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
      demo: "#",
      behance: "#",
      featured: true
    },
    {
      id: 3,
      title: "Motion Graphics",
      description: "Animated explainer video for product launch",
      tech: "After Effects • Cinema 4D • Premiere Pro",
      category: "motion",
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop",
      demo: "#",
      behance: "#",
      featured: false
    },
    {
      id: 4,
      title: "Print Design Collection",
      description: "Marketing materials and business cards",
      tech: "Adobe InDesign • Illustrator • Photoshop",
      category: "print",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
      demo: "#",
      behance: "#",
      featured: false
    },
    {
      id: 5,
      title: "Web Design & Development",
      description: "Modern portfolio website with custom animations",
      tech: "Figma • React • CSS3 • JavaScript",
      category: "web",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      demo: "#",
      github: "#",
      featured: true
    },
    {
      id: 6,
      title: "Social Media Graphics",
      description: "Instagram campaign and social media assets",
      tech: "Photoshop • Illustrator • Canva",
      category: "social",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      demo: "#",
      behance: "#",
      featured: false
    }
  ];

  const filters = [
    { id: 'all', label: 'All Projects', icon: 'fas fa-th' },
    { id: 'branding', label: 'Branding', icon: 'fas fa-palette' },
    { id: 'ui-ux', label: 'UI/UX Design', icon: 'fas fa-mobile-alt' },
    { id: 'motion', label: 'Motion Graphics', icon: 'fas fa-video' },
    { id: 'print', label: 'Print Design', icon: 'fas fa-print' },
    { id: 'web', label: 'Web Design', icon: 'fas fa-globe' },
    { id: 'social', label: 'Social Media', icon: 'fas fa-share-alt' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (portfolioRef.current) {
      observer.observe(portfolioRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter));
    }
  }, [activeFilter]);

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <section id="portfolio" className="portfolio" ref={portfolioRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Portfolio</h2>
            <p className="section-subtitle">Selected projects that showcase my work</p>
          </div>

          <div className="portfolio-filters">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <i className={filter.icon}></i>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          <div className="portfolio-grid">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className={`portfolio-item ${project.featured ? 'featured' : ''} ${isVisible ? 'animate' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                data-category={project.category}
              >
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <div className="project-badge">
                      {project.featured && <span className="featured-badge">Featured</span>}
                      <span className="category-badge">{project.category}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {project.tech.split(' • ').map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    <button className="view-project-btn" onClick={() => openModal(project)}>
                      <span>View Project</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.tech}</p>
                  <div className="project-links">
                    <a href={project.demo} className="project-link" target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                    <a href={project.behance || project.github} className="project-link" target="_blank" rel="noopener noreferrer">
                      <i className={project.behance ? "fab fa-behance" : "fab fa-github"}></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div id="projectModal" className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedProject.image} alt={selectedProject.title} />
                <div className="modal-badge">
                  {selectedProject.featured && <span className="featured-badge">Featured</span>}
                  <span className="category-badge">{selectedProject.category}</span>
                </div>
              </div>
              <div className="modal-info">
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>
                <div className="modal-tech">
                  {selectedProject.tech.split(' • ').map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="modal-links">
                  <a href={selectedProject.demo} className="modal-link" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-external-link-alt"></i>
                    <span>Live Demo</span>
                  </a>
                  <a href={selectedProject.behance || selectedProject.github} className="modal-link" target="_blank" rel="noopener noreferrer">
                    <i className={selectedProject.behance ? "fab fa-behance" : "fab fa-github"}></i>
                    <span>{selectedProject.behance ? "Behance" : "GitHub"}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Portfolio;
