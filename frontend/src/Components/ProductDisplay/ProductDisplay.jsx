import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './ProductDisplay.css';

const ProductDisplay = () => { // ✅ Removido props, usamos URL
  const { allProducts, fetchProducts } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Pega o ID da URL
  const url = window.location.href;
  const id = url.split('/').pop();

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      fetchProducts();
    } else {
      const foundProduct = allProducts.find(p => p._id === id);
      setProduct(foundProduct || null);
    }
  }, [allProducts, id, fetchProducts]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedColor(firstVariant.color);
      if (firstVariant.images?.length > 0) {
        setSelectedImage(firstVariant.images[0]);
      }
    }
  }, [product]);

  const { addToCart } = useContext(ShopContext);

  if (!product) return <div>Carregando produto...</div>;

  const currentVariant = product.variants.find(v => v.color === selectedColor);

  const handleColorChange = (color) => {
    const variant = product.variants.find(v => v.color === color);
    setSelectedColor(color);
    setSelectedSize(null);
    if (variant?.images?.length > 0) {
      setSelectedImage(variant.images[0]);
    }
  };

  const handleSizeSelect = (size) => {
    const sizeData = currentVariant?.sizes.find(s => s.size === size);
    if (sizeData?.stock > 0) {
      setSelectedSize(selectedSize === size ? null : size);
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Selecione cor e tamanho.');
      return;
    }
    addToCart(product._id, {
      variant: currentVariant,
      size: selectedSize,
      image: selectedImage
    });
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {currentVariant?.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product ${index + 1}`}
              onClick={() => setSelectedImage(image)}
              className={`thumbnail ${selectedImage === image ? 'selected' : ''}`}
            />
          )) || <div>Sem imagens</div>}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={selectedImage || "https://via.placeholder.com/400"}
            alt="Produto"
          />
        </div>
      </div>
      
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">⭐⭐⭐⭐☆ <p>(122)</p></div>
        
        <div className="productdisplay-right-prices">
          {product.old_price && (
            <div className="productdisplay-right-price-old">
              ${parseFloat(product.old_price).toFixed(2)}
            </div>
          )}
          <div className="productdisplay-right-price-new">
            ${parseFloat(product.new_price).toFixed(2)}
          </div>
        </div>

        <div className="productdisplay-right-description">
          {product.short_description || "Descrição não disponível."}
        </div>

        <div className="productdisplay-right-size">
          <h1>Cor</h1>
          <div className="productdisplay-right-sizes">
            {product.variants.map((variant) => (
              <div
                key={variant.color}
                onClick={() => handleColorChange(variant.color)}
                className={`color-option ${selectedColor === variant.color ? 'selected' : ''}`}
                style={{ 
                  backgroundColor: variant.colorCode || '#ccc',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: selectedColor === variant.color ? '2px solid black' : '1px solid #ddd'
                }}
              />
            ))}
          </div>
        </div>

        <div className="productdisplay-right-size">
          <h1>Tamanho</h1>
          <div className="productdisplay-right-sizes">
            {currentVariant?.sizes.map((sizeOpt) => (
              <div
                key={sizeOpt.size}
                onClick={() => handleSizeSelect(sizeOpt.size)}
                className={`size-button ${
                  selectedSize === sizeOpt.size ? 'selected' : ''
                } ${
                  sizeOpt.stock === 0 ? 'out-of-stock' : ''
                }`}
                style={{
                  opacity: sizeOpt.stock === 0 ? 0.5 : 1,
                  cursor: sizeOpt.stock === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {sizeOpt.size}
                {sizeOpt.stock === 0 && <span> Esgotado</span>}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleAddToCart}>ADICIONAR AO CARRINHO</button>
        <p className="productdisplay-right-category"><span>Categoria:</span> {product.category}</p>
      </div>
    </div>
  );
};

export default ProductDisplay;