import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    category: 'women',
    new_price: '',
    old_price: '',
    short_description: '',
    long_description: '',
  });

  const [variations, setVariations] = useState([
    { size: '', color: '', stock: '' },
  ]);

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const variationHandler = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
  };

  const addVariation = () => {
    setVariations([...variations, { size: '', color: '', stock: '' }]);
  };

  const removeVariation = (index) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
  };

  const imageHandler = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
  };

  const showAlertAndReload = () => {
    if (window.confirm('Upload bem-sucedido!')) {
      window.location.reload();
    }
  };

  const addProduct = async () => {
    if (
      !productDetails.name ||
      !productDetails.category ||
      !productDetails.new_price ||
      !productDetails.old_price ||
      images.length === 0 ||
      variations.length === 0
    ) {
      console.error('Preencha todos os campos e forneça pelo menos uma imagem.');
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));

    formData.append('name', productDetails.name);
    formData.append('category', productDetails.category);
    formData.append('new_price', productDetails.new_price);
    formData.append('old_price', productDetails.old_price);
    formData.append('short_description', productDetails.short_description);
    formData.append('long_description', productDetails.long_description);
    formData.append('variations', JSON.stringify(variations));

    try {
      const response = await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        showAlertAndReload();
      } else {
        console.error('Erro no upload:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro no upload:', error.message);
    }
  };

  return (
    <div>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Old Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>New Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <p>Short Description</p>
        <textarea
          value={productDetails.short_description}
          onChange={changeHandler}
          name="short_description"
          placeholder="Ex: Tecido leve"
          className="addproduct-description-input"
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Long Description</p>
        <textarea
          value={productDetails.long_description}
          onChange={changeHandler}
          name="long_description"
          placeholder="Descreva detalhes completos..."
          className="addproduct-description-input"
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Product Variations</p>
        {variations.map((v, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              value={v.size}
              placeholder="Size"
              onChange={(e) => variationHandler(index, 'size', e.target.value)}
            />
            <input
              value={v.color}
              placeholder="Color"
              onChange={(e) => variationHandler(index, 'color', e.target.value)}
            />
            <input
              value={v.stock}
              placeholder="Stock"
              type="number"
              onChange={(e) => variationHandler(index, 'stock', e.target.value)}
            />
            <button onClick={() => removeVariation(index)}>Remove</button>
          </div>
        ))}
        <button onClick={addVariation}>Add Variation</button>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input" className="image-upload-container">
          {images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`product-thumbnail-${index}`}
                className="uploaded-image"
              />
            ))
          ) : (
            <img src={upload_area} alt="upload area" className="upload-area" />
          )}
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="images"
          id="file-input"
          multiple
          hidden
        />
      </div>

      <button onClick={addProduct} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
