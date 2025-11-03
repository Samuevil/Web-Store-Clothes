import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    if (window.confirm('Deseja remover este produto?')) {
      await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchInfo();
    }
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Images</p>
        <p>Title</p>
        <p>Category</p>
        <p>Price</p>
        <p>Variations</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <div key={product.id || index} className="listproduct-format-main listproduct-format">
            <div className="listproduct-product-icons">
              {product.images?.length > 0 ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <span>No image</span>
              )}
            </div>
            <p>{product.name}</p>
            <p>{product.category}</p>
            <p>${product.new_price}</p>
            <p>
              {product.variations?.map((v, i) => (
                <div key={i}>
                  {v.size} / {v.color} : {v.stock} pcs
                </div>
              ))}
            </p>
            <img
              onClick={() => removeProduct(product.id)}
              className="listproduct-remove-icon"
              src={cross_icon}
              alt="Remove"
            />
          </div>
        ))}
        <hr />
      </div>
    </div>
  );
};

export default ListProduct;
