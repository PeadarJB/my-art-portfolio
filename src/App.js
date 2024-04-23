import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Topbar } from './components/Topbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import CV from './pages/CV';
import Contact from './pages/Contact';
import Year2022 from './pages/Year2022';

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme; // Apply theme class to body
  }, [theme]);

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Topbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/2022" element={<Year2022 />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;