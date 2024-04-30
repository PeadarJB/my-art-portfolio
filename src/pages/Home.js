import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss'

const Home = () => {
  return (
    <div className='home'>
      <ul>
        <li><Link to="/2022">2022</Link></li>
        <li><Link to="/2021">2021</Link></li>
        <li><Link to="/2020">2020</Link></li>
        <li><Link to="/2019">2019</Link></li>
      </ul>
    </div>
  );
};

export default Home;