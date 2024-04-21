import React from 'react';
import { NavMobile } from './NavMobile';
import { NavDesktop } from './NavDesktop';
import './Topbar.scss';

export const Topbar = () => {
  return (
    <div className="topbar">
      <nav className="container">
        <NavMobile />
        <NavDesktop />
      </nav>
    </div>
  );
};