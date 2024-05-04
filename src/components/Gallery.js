import React from 'react';
import paintingsData from '../data/paintingsData'; // Import your data
import '../components/Gallery.scss';


const Gallery = ({ year }) => {
  const imagesForYear = paintingsData[year] || []; // Access data for the specific year

  return (
    <div className="gallery">
      {imagesForYear.map((painting, index) => (
        <div key={index} className="gallery-item">
          <picture>
            <source media="(min-width: 1024px)" srcSet={painting.sizes.large} />
            <source media="(min-width: 768px)" srcSet={painting.sizes.medium} />
            <img src={painting.sizes.small} alt={painting.title} className="gallery-image" />
          </picture>
          <div className="gallery-item-info">
            <h3>{painting.title}</h3>
            <p>{painting.description}</p>
            <p>{painting.dimensions}</p>
            <p>{painting.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;