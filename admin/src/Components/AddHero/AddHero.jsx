// admin/src/Components/AddHero/AddHero.jsx
import React, { useState } from 'react';
import './AddHero.css';

const AddHero = () => {
  const [slides, setSlides] = useState([
    {
      id: Date.now(),
      title: '',
      subtitle: '',
      mediaType: 'image',
      mediaFile: null,
      mediaPreview: null,
      mediaUrl: '',
      buttonText: 'Confira',
      buttonLink: '/shop',
      isActive: true,
      order: 0
    }
  ]);
  const [loading, setLoading] = useState(false);

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: '',
      subtitle: '',
      mediaType: 'image',
      mediaFile: null,
      mediaPreview: null,
      mediaUrl: '',
      buttonText: 'Confira',
      buttonLink: '/shop',
      isActive: true,
      order: slides.length
    };
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (idToRemove) => {
    if (slides.length <= 1) {
      alert('O carrossel deve ter pelo menos um slide.');
      return;
    }
    setSlides(slides.filter(slide => slide.id !== idToRemove));
  };

  const updateSlide = (id, field, value) => {
    setSlides(prevSlides => {
      return prevSlides.map(slide =>
        slide.id === id ? { ...slide, [field]: value } : slide
      );
    });
  };

  const handleMediaChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      let preview = null;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }
      updateSlide(id, 'mediaFile', file);
      updateSlide(id, 'mediaPreview', preview);
      updateSlide(id, 'mediaUrl', '');
    }
  };

  const handleInputChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    updateSlide(id, name, fieldValue);
  };

  const updateOrder = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === slides.length - 1)) {
      return;
    }

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    newSlides.forEach((slide, i) => slide.order = i);
    setSlides(newSlides);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const slidesParaEnviar = slides.filter(slide => {
      const temMidia = slide.mediaFile || slide.mediaUrl;
      const temBotao = slide.buttonText.trim() !== '' && slide.buttonLink.trim() !== '';
      return temMidia || temBotao;
    });

    for (let i = 0; i < slidesParaEnviar.length; i++) {
      const slide = slidesParaEnviar[i];

      if (!slide.buttonText || !slide.buttonLink) {
          alert(`Por favor, preencha o texto e o link do botão para o slide ${i + 1}.`);
          setLoading(false);
          return;
      }

      if (!['image', 'video'].includes(slide.mediaType)) {
        alert(`Tipo de mídia inválido para o slide ${i + 1}. Por favor, selecione Imagem ou Vídeo.`);
        setLoading(false);
        return;
      }

      if (!slide._id && slide.mediaType && !slide.mediaFile) {
        alert(`Por favor, selecione um arquivo de mídia para o novo slide ${i + 1}.`);
        setLoading(false);
        return;
      }
    }

    if (slidesParaEnviar.length === 0) {
      alert('Nenhum slide válido para salvar. Adicione slides com mídia ou botão preenchido.');
      setLoading(false);
      return;
    }

    try {
      for (const slide of slidesParaEnviar) {
        const formDataToSend = new FormData();
        if (slide.title) formDataToSend.append('title', slide.title);
        if (slide.subtitle) formDataToSend.append('subtitle', slide.subtitle);

        if (!['image', 'video'].includes(slide.mediaType)) {
          throw new Error(`Tipo de mídia inválido para o slide ${slide.id}. Esperado 'image' ou 'video', recebido '${slide.mediaType}'.`);
        }
        formDataToSend.append('mediaType', slide.mediaType);

        if (slide.mediaFile) {
          formDataToSend.append('media', slide.mediaFile);
        }

        formDataToSend.append('buttonText', slide.buttonText);
        formDataToSend.append('buttonLink', slide.buttonLink);
        formDataToSend.append('isActive', slide.isActive);
        formDataToSend.append('order', slide.order);

        let url, method;
        if (slide._id) {
          url = `http://localhost:4000/api/hero/update/${slide._id}`;
          method = 'PUT';
        } else {
          url = 'http://localhost:4000/api/hero/addbanner';
          method = 'POST';
        }

        const response = await fetch(url, {
          method: method,
          body: formDataToSend,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Erro ao ${method === 'POST' ? 'criar' : 'atualizar'} slide.`);
        }
      }

      alert('Carrossel salvo com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-hero-container">
      <h2>Gerenciar Carrossel Hero</h2>
      <form onSubmit={handleSubmit} className="add-hero-form">
        {slides.map((slide, index) => (
          <div key={slide.id} className="slide-form-group">
            <div className="slide-header">
              <h3>Slide {index + 1}</h3>
              {slides.length > 1 && (
                <button type="button" onClick={() => removeSlide(slide.id)} className="remove-slide-btn">
                  Remover
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Título (opcional)</label>
                <input
                  type="text"
                  name="title"
                  value={slide.title}
                  onChange={(e) => handleInputChange(slide.id, e)}
                  placeholder="Ex: Nova Coleção"
                />
              </div>
              <div className="form-group">
                <label>Subtítulo (opcional)</label>
                <input
                  type="text"
                  name="subtitle"
                  value={slide.subtitle}
                  onChange={(e) => handleInputChange(slide.id, e)}
                  placeholder="Ex: Até 40% OFF"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Mídia *</label>
                <select
                  name="mediaType"
                  value={slide.mediaType}
                  onChange={(e) => handleInputChange(slide.id, e)}
                  required
                >
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ordem</label>
                <div className="order-controls">
                  <input
                    type="number"
                    name="order"
                    value={slide.order}
                    onChange={(e) => handleInputChange(slide.id, e)}
                    min="0"
                    readOnly
                  />
                  <button type="button" onClick={() => updateOrder(index, 'up')} disabled={index === 0}>
                    ↑
                  </button>
                  <button type="button" onClick={() => updateOrder(index, 'down')} disabled={index === slides.length - 1}>
                    ↓
                  </button>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Texto do Botão *</label>
                <input
                  type="text"
                  name="buttonText"
                  value={slide.buttonText}
                  onChange={(e) => handleInputChange(slide.id, e)}
                  placeholder="Ex: Confira"
                  required
                />
              </div>
              <div className="form-group">
                <label>Link do Botão *</label>
                <input
                  type="text"
                  name="buttonLink"
                  value={slide.buttonLink}
                  onChange={(e) => handleInputChange(slide.id, e)}
                  placeholder="Ex: /categoria/verao"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mídia ({slide.mediaType === 'image' ? 'Imagem' : 'Vídeo'}) *</label>
                <input
                  type="file"
                  name="media"
                  accept={slide.mediaType === 'image' ? "image/*" : "video/*"}
                  onChange={(e) => handleMediaChange(slide.id, e)}
                />
                {slide.mediaPreview && slide.mediaType === 'image' && (
                  <div className="image-preview">
                    <img src={slide.mediaPreview} alt="Prévia da Imagem" />
                  </div>
                )}
                {!slide.mediaPreview && slide.mediaFile && slide.mediaType === 'video' && (
                  <p>Prévia de vídeo não disponível. Arquivo selecionado: {slide.mediaFile.name}</p>
                )}
                {slide.mediaUrl && !slide.mediaFile && (
                  <p className="saved-url">Mídia atual: <a href={slide.mediaUrl} target="_blank" rel="noopener noreferrer">Ver mídia</a></p>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={slide.isActive}
                    onChange={(e) => handleInputChange(slide.id, e)}
                  />
                  Ativo
                </label>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addSlide} className="add-slide-btn">
          + Adicionar Slide
        </button>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Salvando...' : 'Salvar Carrossel'}
        </button>
      </form>
    </div>
  );
};

export default AddHero;