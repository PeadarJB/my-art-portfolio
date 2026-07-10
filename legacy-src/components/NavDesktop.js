import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../routes';
import './NavDesktop.scss';

export const NavDesktop = () => {
  return (
    <ul className="nav-desktop">
      {routes.map((route, index) => {
        return (
          <li key={index}>
            <Link to={route.href} className="nav-link">
              {route.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};