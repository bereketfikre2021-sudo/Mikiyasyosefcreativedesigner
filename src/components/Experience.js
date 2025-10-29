import React, { useState, useEffect, useRef } from 'react';

const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const experienceRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (experienceRef.current) {
      observer.observe(experienceRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const experiences = [
    {
      year: '2024',
      title: 'Web and App Developer',
      company: 'Creative Studio'
    },
    {
      year: '2023',
      title: 'UI/UX Designer',
      company: 'Digital Agency'
    },
    {
      year: '2022',
      title: 'Senior Graphic Designer',
      company: 'Marketing Firm'
    },
    {
      year: '2021',
      title: 'Junior Designer',
      company: 'Design Studio'
    },
    {
      year: '2020',
      title: 'Graphic Design Degree',
      company: 'Art Institute'
    }
  ];

  return (
    <section id="experience" className="experience" ref={experienceRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">Design journey & creative growth</p>
        </div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div key={index} className={`timeline-item ${isVisible ? 'animate' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="timeline-year">{exp.year}</div>
              <div className="timeline-content">
                <h3>{exp.title}</h3>
                <p>{exp.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
