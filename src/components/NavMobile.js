import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';
import { Squash as Hamburger } from 'hamburger-react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import './NavMobile.scss'; // Your custom styles for the nav

const navVariants = {
  hidden: { opacity: 0, x: '-100%' },
  visible: { opacity: 1, x: 0 }
};

export const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, () => setOpen(false));

  return (
    <div ref={ref} className="nav-mobile">
      <Hamburger toggled={isOpen} toggle={setOpen} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={navVariants}
            className="nav-overlay"
          >
            <ul className="nav-items">
              <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
              <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
              <li><Link to="/cv" onClick={() => setOpen(false)}>CV</Link></li>
              <li><Link to="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};