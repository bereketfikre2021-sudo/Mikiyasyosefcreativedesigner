import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollIndicator from './components/ScrollIndicator';
import Services from './components/Services';
import Testimonials from './components/Testimonials';

function App() {
  return (
    <div className="App">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <About />
        <Experience />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ScrollIndicator />
    </div>
  );
}

export default App;
