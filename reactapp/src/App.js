import React, { useEffect, useRef } from 'react';
import './App.css';

// Sections
import Navbar     from './components/Navbar';
import Hero       from './sections/Hero';
import About      from './sections/About';
import Skills     from './sections/Skills';
import Projects   from './sections/Projects';
import Experience from './sections/Experience';
import Contact    from './sections/Contact';
import Footer     from './sections/Footer';

function App() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  /* ── Custom cursor logic ── */
  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      rafId = requestAnimationFrame(animateRing);
    };

    const onEnter = () => ring.classList.add('hovered');
    const onLeave = () => ring.classList.remove('hovered');

    document.addEventListener('mousemove', onMove);
    animateRing();

    // Hover effect on all interactive elements
    const interactables = document.querySelectorAll('a, button, .skill-card, .project-card, input, textarea');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="app">
      {/* Custom cursor */}
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Main content */}
      <Navbar />
      <main>
        <Hero       id="hero"       />
        <About      id="about"      />
        <Skills     id="skills"     />
        <Projects   id="projects"   />
        <Experience id="experience" />
        <Contact    id="contact"    />
      </main>
      <Footer />
    </div>
  );
}

export default App;
