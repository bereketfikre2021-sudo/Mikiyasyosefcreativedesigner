import React, { useState, useEffect, useRef } from 'react';
import projects from '../data/projects';

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [loadedIds, setLoadedIds] = useState(new Set());
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const portfolioRef = useRef(null);

  // projects now imported from ../data/projects

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
    // Initialize filter from URL (e.g., ?filter=web)
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get('filter');
    const validFilterIds = new Set(filters.map(f => f.id));
    if (urlFilter && validFilterIds.has(urlFilter)) {
      setActiveFilter(urlFilter);
    }

    // Handle back/forward navigation
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const f = p.get('filter');
      if (f && validFilterIds.has(f)) {
        setActiveFilter(f);
      } else {
        setActiveFilter('all');
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Reduced motion preference
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(!!mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

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
    // Animate filter transition
    if (!prefersReducedMotion) {
      setIsFiltering(true);
      const t = setTimeout(() => setIsFiltering(false), 200);
      return () => clearTimeout(t);
    }
    // Update URL to reflect current filter (pushState for back/forward)
    const params = new URLSearchParams(window.location.search);
    if (activeFilter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', activeFilter);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`;
    window.history.pushState({}, '', newUrl);
  }, [activeFilter, prefersReducedMotion]);
  const handleFilterClick = (id) => {
    setActiveFilter(id);
  };

  const handleImageLoad = (id) => {
    setLoadedIds(prev => new Set(prev).add(id));
  };

  const openModal = (project) => {
    setSelectedProject(project);
    setModalImageLoaded(false);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const buildSrcSet = (url) => {
    try {
      const widths = [400, 600, 900, 1200];
      return widths
        .map((w) => `${url.replace(/w=\d+/, `w=${w}`)} ${w}w`)
        .join(', ');
    } catch {
      return undefined;
    }
  };

  const sizes = "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw";

  const getIntrinsicSize = (url) => {
    try {
      const u = new URL(url);
      const w = parseInt(u.searchParams.get('w') || '600', 10);
      const h = parseInt(u.searchParams.get('h') || '400', 10);
      return { width: w, height: h };
    } catch {
      return { width: 600, height: 400 };
    }
  };

  return (
    <>
      <section id="portfolio" className="portfolio" ref={portfolioRef} aria-labelledby="portfolio-title">
        <div className="container">
          <div className="section-header">
            <h2 id="portfolio-title" className="section-title">Portfolio</h2>
            <p className="section-subtitle">Selected projects that showcase my work</p>
          </div>

          <div className="portfolio-filters">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => handleFilterClick(filter.id)}
              >
                <i className={filter.icon}></i>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          <div className={`portfolio-grid ${isFiltering ? 'animating' : ''}`}>
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className={`portfolio-item ${project.featured ? 'featured' : ''} ${isVisible ? 'animate' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                data-category={project.category}
              >
                <div className="project-image">
                  <img 
                    src={project.image} 
                    srcSet={buildSrcSet(project.image)}
                    sizes={sizes}
                    loading="lazy"
                    decoding="async"
                    width={getIntrinsicSize(project.image).width}
                    height={getIntrinsicSize(project.image).height}
                    alt={project.title}
                    onLoad={() => handleImageLoad(project.id)}
                    className={loadedIds.has(project.id) ? '' : 'lqip'} 
                  />
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
                  {project.demo && project.demo !== '#' && (
                    <a href={project.demo} className="project-link" target="_blank" rel="noopener noreferrer" aria-label={`Open live demo of ${project.title}`}>
                      <i className="fas fa-external-link-alt" aria-hidden="true"></i>
                    </a>
                  )}
                  {(project.behance && project.behance !== '#') || (project.github && project.github !== '#') ? (
                    <a href={(project.behance && project.behance !== '#') ? project.behance : project.github} className="project-link" target="_blank" rel="noopener noreferrer" aria-label={`${(project.behance && project.behance !== '#') ? 'Open Behance' : 'Open GitHub'} for ${project.title}`}>
                      <i className={(project.behance && project.behance !== '#') ? "fab fa-behance" : "fab fa-github"} aria-hidden="true"></i>
                    </a>
                  ) : null}
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
                <img 
                  src={selectedProject.image}
                  srcSet={buildSrcSet(selectedProject.image)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="eager"
                  decoding="async"
                  width={getIntrinsicSize(selectedProject.image).width}
                  height={getIntrinsicSize(selectedProject.image).height}
                  alt={selectedProject.title}
                  onLoad={() => setModalImageLoaded(true)} 
                  className={modalImageLoaded ? '' : 'lqip'} 
                />
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
                  {selectedProject.demo && selectedProject.demo !== '#' && (
                    <a href={selectedProject.demo} className="modal-link" target="_blank" rel="noopener noreferrer" aria-label={`Open live demo of ${selectedProject.title}`}>
                      <i className="fas fa-external-link-alt" aria-hidden="true"></i>
                      <span>Live Demo</span>
                    </a>
                  )}
                  {(selectedProject.behance && selectedProject.behance !== '#') || (selectedProject.github && selectedProject.github !== '#') ? (
                    <a href={(selectedProject.behance && selectedProject.behance !== '#') ? selectedProject.behance : selectedProject.github} className="modal-link" target="_blank" rel="noopener noreferrer" aria-label={`${(selectedProject.behance && selectedProject.behance !== '#') ? 'Open Behance' : 'Open GitHub'} for ${selectedProject.title}`}>
                      <i className={(selectedProject.behance && selectedProject.behance !== '#') ? "fab fa-behance" : "fab fa-github"} aria-hidden="true"></i>
                      <span>{(selectedProject.behance && selectedProject.behance !== '#') ? "Behance" : "GitHub"}</span>
                    </a>
                  ) : null}
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
