import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Topbar } from './components/Topbar';
import ScrollToTop from './components/ScrollToTop';
import Switch from 'react-switch';
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

  const toggleTheme = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };
  console.log(theme)
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Topbar />
        <label htmlFor="theme-switch" style={{ position: 'fixed', top: '2.5%', right: '5%', zIndex: 100 }}>
          <Switch
            onChange={toggleTheme}
            checked={theme === 'dark'}
            id="theme-switch"
            offColor="#888"
            onColor="#333"
            checkedIcon={false}
            uncheckedIcon={false}
            handleDiameter={0}
            height={18}
            width={38}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          />
        </label>
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