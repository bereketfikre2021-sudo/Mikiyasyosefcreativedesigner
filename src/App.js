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

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Experience />
      <Contact />
      <Footer />
      <ScrollIndicator />
    </div>
  );
}

export default App;
