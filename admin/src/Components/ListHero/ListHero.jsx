import React, { useState, useEffect } from 'react';
import './ListHero.css';

const ListHero = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/hero/');
      const data = await response.json();
      setBanners(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar banners do Hero:', error);
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este banner?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/hero/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok) {
          alert('Banner excluído com sucesso!');
          fetchBanners();
        } else {
          alert('Erro: ' + result.error);
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão com o servidor');
      }
    }
  };

  if (loading) {
    return <div className="list-hero-loading">Carregando...</div>;
  }

  return (
    <div className="list-hero-container">
      <h2>Banners do Hero</h2>
      <div className="banners-list">
        {banners.length === 0 ? (
          <p>Nenhum banner cadastrado.</p>
        ) : (
          banners.map((banner) => (
            <div key={banner._id} className="banner-item">
              <div className="banner-info">
                <h3>{banner.title || 'Sem título'}</h3>
                <p>{banner.subtitle || 'Sem subtítulo'}</p>
                <div className="banner-meta">
                  <span>Tipo: {banner.mediaType}</span>
                  <span>Ordem: {banner.order}</span>
                  <span>Ativo: {banner.isActive ? 'Sim' : 'Não'}</span>
                </div>
              </div>
              <div className="banner-image">
                 {banner.mediaType === 'image' ? (
                   <img src={banner.mediaUrl} alt={banner.title || 'Banner'} />
                 ) : (
                   <div className="video-preview">[Vídeo]</div>
                 )}
              </div>
              <div className="banner-actions">
                <button
                  type="button"
                  onClick={() => alert('A funcionalidade de edição ainda não foi implementada.')}
                  className="edit-btn"
               
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteBanner(banner._id)}
                  className="delete-btn"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListHero;