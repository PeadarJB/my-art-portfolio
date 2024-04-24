import React from 'react';
import Switch from 'react-switch';

const ThemeToggle = ({ isDarkMode, onChange }) => {
  return (
    <label htmlFor="theme-switch">
      <span>Dark Mode:</span>
      <Switch
        onChange={onChange}
        checked={isDarkMode}
        id="theme-switch"
        offColor="#bbb"
        onColor="#333"
        checkedIcon={false}
        uncheckedIcon={false}
        handleDiameter={18}
        height={20}
        width={48}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      />
    </label>
  );
};

export default ThemeToggle;