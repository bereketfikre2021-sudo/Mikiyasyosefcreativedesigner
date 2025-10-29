import React, { useState, useEffect, useRef } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: 'fab fa-telegram', label: 'Telegram', value: '@Miko_Cr7' },
    { icon: 'fas fa-phone', label: 'Phone', value: '+251-985-535-022' },
    { icon: 'fas fa-envelope', label: 'Email', value: 'Mikiyascr7@gmail.com' },
    { icon: 'fas fa-map-marker-alt', label: 'Location', value: 'Addis Ababa, Ethiopia' }
  ];

  return (
    <section id="contact" className="contact" ref={contactRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Let's work together</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Your Name"
                  required 
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Your Email"
                  required 
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                  placeholder="Your Message"
                  required
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>
              
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span>Sending...</span>
                    <div className="spinner"></div>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <i className="fas fa-paper-plane"></i>
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-details">
              {contactInfo.map((info, index) => (
                <div key={index} className={`contact-detail ${isVisible ? 'animate' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="detail-icon">
                    <i className={info.icon}></i>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">{info.label}</span>
                    <span className="detail-value">{info.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
