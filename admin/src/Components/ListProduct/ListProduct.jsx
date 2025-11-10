import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListProduct.css';

const ListProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/products/all');
      
      if (!response.ok) throw new Error('Falha ao carregar produtos');
      
      const data = await response.json();
      setProducts(data);
      setError('');
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        fetchProducts();
      } else {
        alert('Erro ao excluir produto: ' + (result.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro de conexão com o servidor');
    }
  };

  const editProduct = (id) => {
    alert(`Editar produto ${id} - funcionalidade em desenvolvimento`);
  };

  if (loading) return <div className="list-product"><p>Carregando produtos...</p></div>;
  if (error) return <div className="list-product"><p className="error">{error}</p></div>;

  return (
    <div className="list-product">
      <div className="list-header">
        <h1>Gerenciar Produtos</h1>
        <button 
          onClick={() => navigate('/add-product')}
          className="add-new-btn"
        >
          + Adicionar Produto
        </button>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">
            <p>Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.variants?.[0]?.images?.[0] ? (
                  <img 
                    src={product.variants[0].images[0]} 
                    alt={product.name} 
                  />
                ) : (
                  <div className="no-image">Sem imagem</div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">
                  <strong>Categoria:</strong> {product.category}
                </p>
                
                <div className="product-variants">
                  <h4>Variações:</h4>
                  {product.variants?.map((variant, vIdx) => (
                    <div key={vIdx} className="variant-item">
                      <div className="variant-color">
                        <span 
                          className="color-dot"
                          style={{ backgroundColor: variant.colorCode || '#ccc' }}
                        ></span>
                        {variant.color}
                      </div>
                      <div className="variant-sizes">
                        {variant.sizes?.map((size, sIdx) => (
                          <span key={sIdx} className="size-stock">
                            {size.size}: {size.stock} und
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="product-actions">
                <button 
                  onClick={() => editProduct(product._id)}
                  className="action-btn edit"
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => deleteProduct(product._id)}
                  className="action-btn delete"
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListProduct;