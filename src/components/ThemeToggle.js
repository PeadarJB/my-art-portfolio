import React, { useState } from 'react';
import Switch from 'react-switch';

const ThemeToggle = () => {
  const [checked, setChecked] = useState(false);
  
  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
    // Add your theme toggle logic here
  };

  return (
    <label>
      <span>Toggle Theme</span>
      <Switch 
        onChange={handleChange} 
        checked={checked} 
        offColor="#bbbbbb" 
        onColor="#222222" 
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </label>
  );
};

export default ThemeToggle;