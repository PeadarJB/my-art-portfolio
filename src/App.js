import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavMobile } from './components/NavMobile';

import Home from './pages/Home';
import About from './pages/About';
import CV from './pages/CV';
import Contact from './pages/Contact';

const App = () => {
  return (
    <Router>
      <div className="App">
        <NavMobile />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;