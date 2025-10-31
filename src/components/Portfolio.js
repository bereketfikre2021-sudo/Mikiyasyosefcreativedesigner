import React, { useState, useEffect, useRef } from 'react';
import projects from '../data/projects';
import { trackProjectView } from '../utils/analytics';

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [loadedIds, setLoadedIds] = useState(new Set());
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const portfolioRef = useRef(null);

  // projects now imported from ../data/projects

  const filters = [
    { id: 'all', label: 'All Projects', icon: 'fas fa-th' },
    { id: 'branding', label: 'Branding', icon: 'fas fa-palette' },
    { id: 'ui-ux', label: 'UI/UX Design', icon: 'fas fa-mobile-alt' },
    { id: 'motion', label: 'Motion Graphics', icon: 'fas fa-video' },
    { id: 'print', label: 'Video Editing', icon: 'fas fa-video' },
    { id: 'web', label: 'Web Design', icon: 'fas fa-globe' },
    { id: 'social', label: 'Social Media', icon: 'fas fa-share-alt' }
  ];

  useEffect(() => {
    // Initialize filter from URL (e.g., ?filter=web)
    const validFilterIds = ['all', 'branding', 'ui-ux', 'motion', 'print', 'web', 'social'];
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get('filter');
    if (urlFilter && validFilterIds.includes(urlFilter)) {
      setActiveFilter(urlFilter);
    }

    // Handle back/forward navigation
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const f = p.get('filter');
      if (f && validFilterIds.includes(f)) {
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

    // Simulate initial loading for skeleton effect
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
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
    // Track project view
    trackProjectView(project.title, project.category);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  // Share functionality
  const handleShare = async (project, platform) => {
    const url = window.location.href;
    const text = `Check out this ${project.title} project by Mikiyas Yosef - ${project.description}`;
    const shareUrl = `${url}#portfolio?project=${project.id}`;

    try {
      if (platform === 'native' && navigator.share) {
        await navigator.share({
          title: project.title,
          text: text,
          url: shareUrl
        });
      } else if (platform === 'copy') {
        await navigator.clipboard.writeText(shareUrl);
        // Could use a toast notification here instead
        const btn = document.querySelector(`button[aria-label="Copy link to clipboard"]`);
        if (btn) {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
          }, 2000);
        }
      } else {
        const shareLinks = {
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
          telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
        };
        if (shareLinks[platform]) {
          window.open(shareLinks[platform], '_blank', 'width=600,height=400');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC to close modal
      if (e.key === 'Escape' && selectedProject) {
        closeModal();
        return;
      }

      // Arrow keys for portfolio navigation (when modal is open)
      if (selectedProject && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id);
        if (currentIndex !== -1 && filteredProjects.length > 0) {
          if (e.key === 'ArrowLeft') {
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredProjects.length - 1;
            openModal(filteredProjects[prevIndex]);
          } else if (e.key === 'ArrowRight') {
            const nextIndex = currentIndex < filteredProjects.length - 1 ? currentIndex + 1 : 0;
            openModal(filteredProjects[nextIndex]);
          }
        }
      }
    };

    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, filteredProjects]);

  // For local images, we don't need srcSet generation
  // The browser will handle WebP images efficiently
  const sizes = "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw";

  const getIntrinsicSize = (url) => {
    // Default aspect ratio for portfolio images
    // Can be customized per project if needed
    return { width: 800, height: 600 };
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
                aria-pressed={activeFilter === filter.id}
                aria-label={`Filter by ${filter.label}`}
              >
                <i className={filter.icon} aria-hidden="true"></i>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          <div className={`portfolio-grid ${isFiltering ? 'animating' : ''}`}>
            {isInitialLoading && filteredProjects.length > 0 ? (
              // Skeleton loaders
              Array.from({ length: filteredProjects.length }).map((_, index) => (
                <div key={`skeleton-${index}`} className="portfolio-item-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className={`portfolio-item ${project.featured ? 'featured' : ''} ${isVisible ? 'animate' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                data-category={project.category}
                onClick={() => openModal(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(project);
                  }
                }}
                aria-label={`View ${project.title} project details`}
              >
                <div className="project-image">
                  <img 
                    src={project.image} 
                    sizes={sizes}
                    loading="lazy"
                    decoding="async"
                    width={getIntrinsicSize(project.image).width}
                    height={getIntrinsicSize(project.image).height}
                    alt={`${project.title} portfolio project - ${project.description}. ${project.category === 'ui-ux' ? 'UI/UX' : project.category === 'print' ? 'Video Editing' : project.category.charAt(0).toUpperCase() + project.category.slice(1).replace(/-/g, ' ')} design work by Mikiyas Yosef`}
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
                    <button 
                      className="view-project-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(project);
                      }} 
                      aria-label={`View details for ${project.title}`}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <span>View Project</span>
                      <i className="fas fa-arrow-right" aria-hidden="true"></i>
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
              ))
            )}
          </div>

        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div id="projectModal" className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal} aria-label="Close modal" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && closeModal()}>&times;</span>
            <div className="modal-body">
              <div className="modal-image">
                <img 
                  src={selectedProject.image}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="eager"
                  decoding="async"
                  width={getIntrinsicSize(selectedProject.image).width}
                  height={getIntrinsicSize(selectedProject.image).height}
                    alt={`${selectedProject.title} detailed view - ${selectedProject.description}. ${selectedProject.category === 'ui-ux' ? 'UI/UX' : selectedProject.category === 'print' ? 'Video Editing' : selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1).replace(/-/g, ' ')} portfolio project by Mikiyas Yosef, Creative Designer & Video Editor`}
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
                <p className="modal-description">{selectedProject.description}</p>
                
                {/* Project Details */}
                <div className="modal-details">
                  {selectedProject.duration && (
                    <div className="detail-item">
                      <i className="fas fa-clock" aria-hidden="true"></i>
                      <div>
                        <span className="detail-label">Duration</span>
                        <span className="detail-value">{selectedProject.duration}</span>
                      </div>
                    </div>
                  )}
                  {selectedProject.client && (
                    <div className="detail-item">
                      <i className="fas fa-user-tie" aria-hidden="true"></i>
                      <div>
                        <span className="detail-label">Client</span>
                        <span className="detail-value">{selectedProject.client}</span>
                      </div>
                    </div>
                  )}
                  {selectedProject.teamSize && (
                    <div className="detail-item">
                      <i className="fas fa-users" aria-hidden="true"></i>
                      <div>
                        <span className="detail-label">Team Size</span>
                        <span className="detail-value">{selectedProject.teamSize}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Deliverables */}
                {selectedProject.deliverables && (
                  <div className="modal-deliverables">
                    <h4 className="deliverables-title">
                      <i className="fas fa-box" aria-hidden="true"></i>
                      Deliverables
                    </h4>
                    <div className="deliverables-list">
                      {selectedProject.deliverables.split(' • ').map((deliverable, i) => (
                        <span key={i} className="deliverable-tag">
                          <i className="fas fa-check" aria-hidden="true"></i>
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Process Workflow */}
                {selectedProject.process && selectedProject.process.length > 0 && (
                  <div className="modal-process-workflow">
                    <h4 className="workflow-title">
                      <i className="fas fa-sitemap" aria-hidden="true"></i>
                      Process Workflow
                    </h4>
                    <div className="workflow-steps">
                      {selectedProject.process.map((step, index) => (
                        <div key={index} className="workflow-step">
                          <div className="step-number">{index + 1}</div>
                          <div className="step-content">
                            <span className="step-name">{step}</span>
                          </div>
                          {index < selectedProject.process.length - 1 && (
                            <div className="step-connector"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenge & Solution */}
                {(selectedProject.challenge || selectedProject.solution) && (
                  <div className="modal-process">
                    {selectedProject.challenge && (
                      <div className="process-item">
                        <h4 className="process-title">
                          <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                          Challenge
                        </h4>
                        <p>{selectedProject.challenge}</p>
                      </div>
                    )}
                    {selectedProject.solution && (
                      <div className="process-item">
                        <h4 className="process-title">
                          <i className="fas fa-check-circle" aria-hidden="true"></i>
                          Solution
                        </h4>
                        <p>{selectedProject.solution}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Metrics/Results */}
                {selectedProject.metrics && (
                  <div className="modal-metrics">
                    <i className="fas fa-chart-line" aria-hidden="true"></i>
                    <p><strong>Results:</strong> {selectedProject.metrics}</p>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="modal-tech">
                  <h4 className="tech-title">Technologies Used</h4>
                  <div className="tech-tags">
                    {selectedProject.tech.split(' • ').map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
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

                {/* Share Buttons */}
                <div className="modal-share">
                  <h4 className="share-title">Share Project</h4>
                  <div className="share-buttons">
                    {navigator.share && (
                      <button 
                        className="share-btn"
                        onClick={() => handleShare(selectedProject, 'native')}
                        aria-label="Share using native share"
                        title="Native Share"
                      >
                        <i className="fas fa-share-alt" aria-hidden="true"></i>
                      </button>
                    )}
                    <button 
                      className="share-btn"
                      onClick={() => handleShare(selectedProject, 'copy')}
                      aria-label="Copy link to clipboard"
                      title="Copy Link"
                    >
                      <i className="fas fa-link" aria-hidden="true"></i>
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => handleShare(selectedProject, 'twitter')}
                      aria-label="Share on Twitter"
                      title="Twitter"
                    >
                      <i className="fab fa-twitter" aria-hidden="true"></i>
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => handleShare(selectedProject, 'facebook')}
                      aria-label="Share on Facebook"
                      title="Facebook"
                    >
                      <i className="fab fa-facebook" aria-hidden="true"></i>
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => handleShare(selectedProject, 'linkedin')}
                      aria-label="Share on LinkedIn"
                      title="LinkedIn"
                    >
                      <i className="fab fa-linkedin" aria-hidden="true"></i>
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => handleShare(selectedProject, 'whatsapp')}
                      aria-label="Share on WhatsApp"
                      title="WhatsApp"
                    >
                      <i className="fab fa-whatsapp" aria-hidden="true"></i>
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => handleShare(selectedProject, 'telegram')}
                      aria-label="Share on Telegram"
                      title="Telegram"
                    >
                      <i className="fab fa-telegram" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                {/* Navigation Hint */}
                <div className="modal-navigation-hint">
                  <p><i className="fas fa-info-circle" aria-hidden="true"></i> Use <kbd>←</kbd> <kbd>→</kbd> arrow keys to navigate • <kbd>ESC</kbd> to close</p>
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
