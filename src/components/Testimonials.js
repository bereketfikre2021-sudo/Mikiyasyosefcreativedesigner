import React from 'react';

const Testimonials = () => {
  const quotes = [
    { name: 'Sara A.', role: 'Product Manager', text: 'Delivered beyond expectations with clear communication and polish.', rating: 5, avatar: '' },
    { name: 'Jon K.', role: 'Founder', text: 'Performance and UX improvements measurably impacted our signups.', rating: 5, avatar: '' },
    { name: 'Liya M.', role: 'Design Lead', text: 'A rare blend of design sensibility and engineering rigor.', rating: 4, avatar: '' }
  ];

  // Removed sample client logo placeholders for simplicity

  return (
    <section id="testimonials" className="testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="section-header">
          <h2 id="testimonials-title" className="section-title">Testimonials</h2>
          <p className="section-subtitle">What clients say</p>
        </div>

        <div className="testimonials-grid">
          {quotes.map((q, i) => {
            const initials = q.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            const fullStars = Math.max(0, Math.min(5, q.rating || 0));
            const emptyStars = 5 - fullStars;
            return (
              <blockquote key={i} className="testimonial">
                <div className="testimonial-header">
                  <div className="avatar avatar-anim" aria-hidden="true">
                    {q.avatar ? (
                      <img src={q.avatar} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="avatar-initials">{initials}</span>
                    )}
                  </div>
                  <div className="testimonial-meta">
                    <cite>{q.name}</cite>
                    <span className="testimonial-role">{q.role}</span>
                    <div className="stars" aria-label={`Rated ${fullStars} out of 5`}>
                      {Array.from({ length: fullStars }).map((_, idx) => (
                        <i key={`f-${idx}`} className="fas fa-star" aria-hidden="true"></i>
                      ))}
                      {Array.from({ length: emptyStars }).map((_, idx) => (
                        <i key={`e-${idx}`} className="far fa-star" aria-hidden="true"></i>
                      ))}
                    </div>
                  </div>
                </div>
                <p>“{q.text}”</p>
              </blockquote>
            );
          })}
        </div>

        {/* Client logos removed */}
      </div>
    </section>
  );
};

export default Testimonials;


