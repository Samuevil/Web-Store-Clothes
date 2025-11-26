// frontend/src/Components/Hero/Hero.jsx
import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Certifique-se de que esta URL está correta e aponta para a nova rota
        const response = await fetch('http://localhost:4000/api/hero/all');
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dados recebidos do backend (Hero.jsx):", data); // Log de depuração
        setBanners(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar banners do Hero:', error);
        setBanners([]);
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading || banners.length === 0) {
    return <div className="hero-loading">Carregando...</div>;
  }

  const currentBanner = banners[currentSlide];

  return (
    <div className="hero">
      <div className="hero-slide-container">
        <div className="hero-slide">
          {/* Renderização condicional baseada em mediaType */}
          {currentBanner.mediaType === 'image' ? (
            <div
              className="hero-background-image"
              // --- USANDO mediaUrl CORRETAMENTE ---
              style={{ backgroundImage: `url("${currentBanner.mediaUrl}")` }} // Use mediaUrl e aspas extras para a URL
            >
              {/* Overlay opcional para melhor contraste */}
              <div className="hero-overlay"></div>
            </div>
          ) : (
            // Caso seja vídeo
            <div className="hero-background-video">
              <video autoPlay muted loop playsInline>
                <source src={currentBanner.mediaUrl} type={`video/${currentBanner.mediaUrl.split('.').pop()}`} />
                Seu navegador não suporta vídeos.
              </video>
              <div className="hero-overlay"></div>
            </div>
          )}

          {/* Conteúdo do Slide */}
          <div className="hero-content">
            {/* Renderização condicional de título e subtítulo */}
            {currentBanner.title && <h2 className="hero-title">{currentBanner.title}</h2>}
            {currentBanner.subtitle && <p className="hero-subtitle">{currentBanner.subtitle}</p>}
            {currentBanner.buttonText && currentBanner.buttonLink && (
              <a href={currentBanner.buttonLink} className="hero-button">
                {currentBanner.buttonText}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Controles do Carrossel - Só exibe se houver mais de um banner */}
      {banners.length > 1 && (
        <>
          <div className="hero-controls">
            <button className="hero-btn hero-btn-prev" onClick={prevSlide}>
              {'<'}
            </button>
            <button className="hero-btn hero-btn-next" onClick={nextSlide}>
              {'>'}
            </button>
          </div>
          <div className="hero-indicators">
            {banners.map((_, index) => (
              <span
                key={index}
                className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;