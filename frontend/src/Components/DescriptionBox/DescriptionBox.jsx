import React from 'react';
import './DescriptionBox.css';

const DescriptionBox = ({ description }) => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews(152)</div>
      </div>
      <div className="descriptionbox-description">
        {description ? (
          <p>{description}</p>
        ) : (
          <p>No description available for this product.</p>
        )}
      </div>
    </div>
  );
};

export default DescriptionBox;