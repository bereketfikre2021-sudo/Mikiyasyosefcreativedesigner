import React, { useState, useEffect } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "I offer a comprehensive range of creative services including graphic design & branding, video editing & motion graphics, social media management & ad boosting, website design & development, app design & development, UI/UX design & prototyping, and bot & game development. Each service is tailored to meet your specific project needs."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on scope and complexity. A simple logo design might take 1-2 weeks, while a complete brand identity package could take 2-3 months. Video editing projects typically range from 1-4 weeks. Website development projects can take 1-3 months depending on features. I'll provide a detailed timeline during our initial consultation."
    },
    {
      question: "What is your pricing structure?",
      answer: "Pricing varies based on project scope, complexity, and timeline. I offer flexible pricing options including hourly rates, fixed project fees, and retainer packages for ongoing work. Contact me for a custom quote tailored to your specific needs. I'm happy to work within your budget while maintaining quality standards."
    },
    {
      question: "Do you work with clients remotely?",
      answer: "Yes! I work with clients worldwide remotely. I'm based in Addis Ababa, Ethiopia, but I've successfully completed projects for clients across different time zones. I use tools like Telegram, email, and video calls to maintain clear communication throughout the project."
    },
    {
      question: "What file formats do you deliver?",
      answer: "I deliver all source files and exports in the formats you need. For design work, I provide AI, PSD, PNG, JPG, PDF, and SVG files. For video projects, I deliver in MP4, MOV, and other formats as requested. Web projects include all source code and documentation. I ensure you have everything needed for future use."
    },
    {
      question: "How many revision rounds are included?",
      answer: "Most projects include 2-3 rounds of revisions within the quoted price. Additional revisions can be arranged at an hourly rate. I believe in collaborative work and will ensure you're satisfied with the final deliverable before project completion."
    },
    {
      question: "Can you work with existing brand guidelines?",
      answer: "Absolutely! I'm experienced in working with existing brand guidelines and can help maintain brand consistency across all materials. I can also assist in updating or expanding brand guidelines when needed."
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes, I offer ongoing support and maintenance packages. This includes website updates, content creation, social media management, and design adjustments. I also offer retainer packages for clients who need regular creative support."
    },
    {
      question: "What payment methods do you accept?",
      answer: "I accept various payment methods including bank transfers, mobile money, and digital payment platforms. Payment terms are typically 50% upfront and 50% upon completion, though this can be adjusted based on project size and duration."
    },
    {
      question: "How do I get started?",
      answer: "Simply reach out through the contact form on this website, or contact me directly via Telegram (@Miko_Cr7), email (Mikiyascr7@gmail.com), or phone (+251-985-535-022). I'll respond within 24 hours to discuss your project needs and provide a detailed quote."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Add FAQ Schema to document head
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    // Remove existing FAQ schema if any
    const existingScript = document.getElementById('faq-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Add FAQ schema to head
    const script = document.createElement('script');
    script.id = 'faq-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById('faq-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="container">
        <div className="section-header">
          <h2 id="faq-title" className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Got questions? I've got answers</p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  <i className={`fas fa-chevron-${openIndex === index ? 'up' : 'down'}`}></i>
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                className="faq-answer"
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default FAQ;

