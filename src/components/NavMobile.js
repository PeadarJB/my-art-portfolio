import React, { useState, useRef } from 'react';
import { useClickAway } from 'react-use';
import { Squash as Hamburger } from 'hamburger-react';
import { Link } from 'react-router-dom';
import { routes } from '../routes';
import './NavMobile.scss'; // Ensure the styles are imported
import { AnimatePresence, motion } from 'framer-motion';

export const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, () => setOpen(false));

  return (
    <div ref={ref} className="nav-mobile">
      <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="menu-overlay">
          <ul>
            {routes.map((route, index) => (
              <motion.li 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1 + index / 10, 
              }}
                key={route.title}>
                <Link to={route.href} onClick={() => setOpen(false)}>
                  {route.title}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};