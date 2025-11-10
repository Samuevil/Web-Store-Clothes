import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
  const { 
    _id: id, 
    name, 
    category,
    new_price,
    variants 
  } = props.product || {};
  
  const firstImage = variants?.[0]?.images?.[0] || "/placeholder.jpg";

  return (
    <div className='item'>
      {id && (
        <Link to={`/product/${id}`}>
          <img 
            onClick={() => window.scrollTo(0, 0)} 
            src={firstImage} 
            alt={name} 
          />
        </Link>
      )}
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          ${new_price ? parseFloat(new_price).toFixed(2) : '0.00'}
        </div>
      </div>
      <p className="item-category" style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        {category}
      </p>
    </div>
  );
}

export default Item;