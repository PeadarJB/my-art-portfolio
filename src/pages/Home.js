import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <ul>
        <li><Link>2022</Link></li>
        <li><Link>2021</Link></li>
        <li><Link>2020</Link></li>
        <li><Link>2019</Link></li>
      </ul>
    </div>
  );
};

export default Home;