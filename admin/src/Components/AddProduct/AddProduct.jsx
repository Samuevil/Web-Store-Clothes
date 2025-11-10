import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg?url';

const AddProduct = () => {
  const CATEGORIES = [
    'Masculino - Camisetas', 'Masculino - Camisas', 'Masculino - Polos',
    'Masculino - Regatas', 'Masculino - Moletons', 'Masculino - Jaquetas',
    'Masculino - Calças', 'Masculino - Bermudas', 'Masculino - Tênis',
    'Masculino - Sandálias', 'Masculino - Bonés', 'Masculino - Óculos',
    'Feminino - Camisetas', 'Feminino - Blusas', 'Feminino - Tops',
    'Feminino - Regatas', 'Feminino - Moletons', 'Feminino - Jaquetas',
    'Feminino - Vestidos', 'Feminino - Saias', 'Feminino - Calças',
    'Feminino - Shorts', 'Feminino - Sandálias', 'Feminino - Tênis',
    'Feminino - Bolsas', 'Feminino - Óculos', 'Feminino - Bijuterias',
    'Infantil - Camisetas', 'Infantil - Calças', 'Infantil - Vestidos',
    'Infantil - Conjuntos', 'Infantil - Sapatos', 'Infantil - Bonés'
  ];

  const [productDetails, setProductDetails] = useState({
    name: '',
    category: CATEGORIES[0],
    short_description: '',
    long_description: '',
    old_price: '',
    new_price: ''
  });

  const [variations, setVariations] = useState([
    { 
      color: '', 
      colorCode: '', 
      images: [], 
      imageFiles: [],
      sizes: [{ size: '', stock: 0 }]
    }
  ]);

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const updateVariation = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
  };

  const updateSize = (varIndex, sizeIndex, field, value) => {
    const newVariations = [...variations];
    if (field === 'stock') {
      newVariations[varIndex].sizes[sizeIndex][field] = Number(value);
    } else {
      newVariations[varIndex].sizes[sizeIndex][field] = value;
    }
    setVariations(newVariations);
  };

  const addVariation = () => {
    setVariations([...variations, { 
      color: '', 
      colorCode: '', 
      images: [], 
      imageFiles: [],
      sizes: [{ size: '', stock: 0 }]
    }]);
  };

  const addSize = (varIndex) => {
    const newVariations = [...variations];
    newVariations[varIndex].sizes.push({ size: '', stock: 0 });
    setVariations(newVariations);
  };

  const removeSize = (varIndex, sizeIndex) => {
    const newVariations = [...variations];
    newVariations[varIndex].sizes = newVariations[varIndex].sizes.filter((_, i) => i !== sizeIndex);
    setVariations(newVariations);
  };

  const removeVariation = (index) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
  };

  const handleImageUpload = (varIndex, e) => {
    const files = Array.from(e.target.files);
    const newVariations = [...variations];
    newVariations[varIndex].imageFiles = files;
    newVariations[varIndex].images = files.map(file => URL.createObjectURL(file));
    setVariations(newVariations);
  };

  const addProduct = async () => {
    // ✅ Validação de preço
    const newPrice = parseFloat(productDetails.new_price);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Preço atual deve ser um número válido maior que zero.');
      return;
    }

    const oldPrice = productDetails.old_price ? parseFloat(productDetails.old_price) : null;
    if (oldPrice !== null && (isNaN(oldPrice) || oldPrice <= 0)) {
      alert('Preço antigo deve ser um número válido maior que zero.');
      return;
    }

    if (!productDetails.name.trim() || !productDetails.category.trim()) {
      alert('Preencha nome e categoria do produto.');
      return;
    }

    const validVariations = [];
    for (const variation of variations) {
      if (!variation.color.trim()) continue;
      const validSizes = [];
      for (const size of variation.sizes) {
        if (size.size.trim() && size.stock >= 0) {
          validSizes.push({
            size: size.size.trim(),
            stock: size.stock
          });
        }
      }
      if (validSizes.length > 0 && variation.imageFiles.length > 0) {
        validVariations.push({
          color: variation.color.trim(),
          colorCode: variation.colorCode || '',
          imageCount: variation.imageFiles.length,
          sizes: validSizes
        });
      }
    }

    if (validVariations.length === 0) {
      alert('Adicione pelo menos uma variação completa.');
      return;
    }

    const formData = new FormData();
    formData.append('name', productDetails.name.trim());
    formData.append('category', productDetails.category.trim());
    formData.append('short_description', productDetails.short_description || '');
    formData.append('long_description', productDetails.long_description || '');
    formData.append('new_price', newPrice);
    if (oldPrice !== null) formData.append('old_price', oldPrice);
    formData.append('variations', JSON.stringify(validVariations));

    variations.forEach(variation => {
      if (variation.color.trim() && variation.imageFiles.length > 0) {
        variation.imageFiles.forEach(file => {
          formData.append('images', file);
        });
      }
    });

    try {
      const response = await fetch('http://localhost:4000/api/products/addproduct', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      if (response.ok) {
        alert('Produto adicionado com sucesso!');
        setProductDetails({
          name: '',
          category: CATEGORIES[0],
          short_description: '',
          long_description: '',
          old_price: '',
          new_price: ''
        });
        setVariations([{ color: '', colorCode: '', images: [], imageFiles: [], sizes: [{ size: '', stock: 0 }] }]);
      } else {
        alert('Erro: ' + (result.error || 'Falha ao adicionar produto'));
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  return (
    <div className="add-product-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Adicionar Novo Produto</h2>
      
      <div className="addproduct-itemfield" style={{ marginBottom: '15px' }}>
        <label>Nome do Produto *</label>
        <input value={productDetails.name} onChange={changeHandler} name="name" placeholder="Ex: Camiseta Básica" style={{ width: '100%', padding: '8px' }} required />
      </div>

      <div className="addproduct-itemfield" style={{ marginBottom: '15px' }}>
        <label>Categoria *</label>
        <select value={productDetails.category} onChange={changeHandler} name="category" style={{ width: '100%', padding: '8px' }} required>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="addproduct-itemfield" style={{ marginBottom: '15px' }}>
        <label>Preço Antigo (opcional)</label>
        <input value={productDetails.old_price} onChange={changeHandler} name="old_price" type="number" step="0.01" placeholder="Ex: 129.90" style={{ width: '100%', padding: '8px' }} />
      </div>

      <div className="addproduct-itemfield" style={{ marginBottom: '15px' }}>
        <label>Preço Atual *</label>
        <input value={productDetails.new_price} onChange={changeHandler} name="new_price" type="number" step="0.01" placeholder="Ex: 99.90" style={{ width: '100%', padding: '8px' }} required />
      </div>

      <div className="addproduct-itemfield" style={{ marginBottom: '15px' }}>
        <label>Descrição Curta</label>
        <textarea value={productDetails.short_description} onChange={changeHandler} name="short_description" placeholder="Ex: Tecido 100% algodão" style={{ width: '100%', padding: '8px', height: '60px' }} />
      </div>

      <div className="addproduct-itemfield" style={{ marginBottom: '15px' }}>
        <label>Descrição Completa</label>
        <textarea value={productDetails.long_description} onChange={changeHandler} name="long_description" placeholder="Detalhes completos..." style={{ width: '100%', padding: '8px', height: '100px' }} />
      </div>

      <div className="addproduct-itemfield" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>Variações por Cor</h3>
        {variations.map((variation, varIndex) => (
          <div key={varIndex} className="variation-section" style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Cor {varIndex + 1}</h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input value={variation.color} onChange={(e) => updateVariation(varIndex, 'color', e.target.value)} placeholder="Nome da cor" style={{ flex: 1, padding: '8px' }} />
              <input value={variation.colorCode} onChange={(e) => updateVariation(varIndex, 'colorCode', e.target.value)} placeholder="#000000" style={{ width: '100px', padding: '8px' }} />
            </div>

            <div className="addproduct-itemfield" style={{ marginBottom: '15px' }}>
              <label>Imagens ({variation.images.length})</label>
              <label htmlFor={`file-${varIndex}`} style={{ display: 'block', padding: '20px', border: '2px dashed #ccc', textAlign: 'center', cursor: 'pointer' }}>
                {variation.images.length > 0 ? (
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {variation.images.map((img, i) => <img key={i} src={img} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />)}
                  </div>
                ) : <img src={upload_area} alt="" style={{ width: '100px', height: '100px' }} />}
              </label>
              <input type="file" id={`file-${varIndex}`} multiple onChange={(e) => handleImageUpload(varIndex, e)} accept="image/*" style={{ display: 'none' }} />
            </div>

            <div className="addproduct-itemfield">
              <label>Tamanhos e Estoque</label>
              {variation.sizes.map((size, sizeIndex) => (
                <div key={sizeIndex} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input value={size.size} onChange={(e) => updateSize(varIndex, sizeIndex, 'size', e.target.value)} placeholder="Tamanho" style={{ width: '100px', padding: '6px' }} />
                  <input value={size.stock} onChange={(e) => updateSize(varIndex, sizeIndex, 'stock', e.target.value)} type="number" min="0" placeholder="Estoque" style={{ width: '100px', padding: '6px' }} />
                  {variation.sizes.length > 1 && <button type="button" onClick={() => removeSize(varIndex, sizeIndex)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px' }}>Remover</button>}
                </div>
              ))}
              <button type="button" onClick={() => addSize(varIndex)} style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', marginTop: '5px' }}>+ Tamanho</button>
            </div>

            {variations.length > 1 && <button type="button" onClick={() => removeVariation(varIndex)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', marginTop: '15px' }}>Remover Cor</button>}
          </div>
        ))}
        <button type="button" onClick={addVariation} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px', width: '100%', marginTop: '10px' }}>+ Adicionar Cor</button>
      </div>

      <button onClick={addProduct} style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '12px 24px', width: '100%', marginTop: '20px' }}>ADICIONAR PRODUTO</button>
    </div>
  );
};

export default AddProduct;