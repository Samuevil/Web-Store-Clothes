// admin/src/Components/EditHero/EditHero.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditHero.css';

const EditHero = () => {
  const { id } = useParams(); // Pega o ID do banner da URL
  const navigate = useNavigate(); // Para redirecionar após salvar
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    mediaType: 'image', // Valor padrão, será atualizado com os dados do banner
    buttonText: '',
    buttonLink: '',
    isActive: true,
    order: 0
  });
  const [currentMediaUrl, setCurrentMediaUrl] = useState(''); // URL da mídia atual
  const [newMedia, setNewMedia] = useState(null); // Nova mídia selecionada para upload
  const [preview, setPreview] = useState(null); // Prévia da nova mídia
  const [loading, setLoading] = useState(true); // Para mostrar loading ao carregar dados
  const [error, setError] = useState(null); // Para lidar com erros

  // Função para buscar os dados do banner existente
  const fetchBannerData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/hero/${id}`); // Rota para buscar um banner específico
      if (!response.ok) {
        throw new Error(`Erro ao buscar banner: ${response.status}`);
      }
      const banner = await response.json();

      // Preenche o formulário com os dados do banner
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        mediaType: banner.mediaType || 'image',
        buttonText: banner.buttonText || '',
        buttonLink: banner.buttonLink || '',
        isActive: banner.isActive,
        order: banner.order || 0
      });

      // Armazena a URL da mídia atual
      setCurrentMediaUrl(banner.mediaUrl);

      // A prévia não pode ser gerada automaticamente a partir da URL existente, apenas da nova mídia selecionada
      setPreview(null);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados do banner para edição:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Busca os dados quando o componente monta e quando o ID muda
  useEffect(() => {
    fetchBannerData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMedia(file);
      // Cria prévia apenas se for imagem
      if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
      } else {
        // Para vídeo, limpa a prévia anterior (não é comum mostrar uma "prévia" estática de vídeo)
        setPreview(null);
      }
    } else {
      // Se nenhum arquivo for selecionado, limpa o estado da nova mídia e a prévia
      setNewMedia(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Limpa erros anteriores

    // Validação básica (opcional, mas recomendada)
    if (!formData.buttonText.trim() || !formData.buttonLink.trim()) {
      setError('Texto e Link do botão são obrigatórios.');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    if (formData.title !== undefined) formDataToSend.append('title', formData.title || ''); // Envia vazio se for nulo
    if (formData.subtitle !== undefined) formDataToSend.append('subtitle', formData.subtitle || '');
    formDataToSend.append('mediaType', formData.mediaType);
    formDataToSend.append('buttonText', formData.buttonText);
    formDataToSend.append('buttonLink', formData.buttonLink);
    formDataToSend.append('isActive', formData.isActive);
    formDataToSend.append('order', formData.order);

    // Envia a nova mídia apenas se o usuário tiver selecionado uma
    if (newMedia) {
      formDataToSend.append('media', newMedia);
    }
    // Se não enviar nova mídia, o backend deve manter a antiga (lógica a ser implementada no backend)

    try {
      const response = await fetch(`http://localhost:4000/api/hero/update/${id}`, { // Rota para atualizar
        method: 'PUT', // Usando PUT para atualização
        body: formDataToSend, // Envia FormData para lidar com arquivos
      });

      const result = await response.json();

      if (response.ok) {
        alert('Banner atualizado com sucesso!');
        navigate('/listhero'); // Redireciona para a lista após sucesso
      } else {
        setError('Erro: ' + (result.error || 'Falha ao atualizar banner.'));
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !error) {
    return <div className="edit-hero-loading">Carregando dados do banner...</div>;
  }

  if (error) {
    return <div className="edit-hero-error">Erro: {error} <button onClick={() => navigate('/listhero')}>Voltar</button></div>;
  }

  return (
    <div className="edit-hero-container">
      <h2>Editar Banner do Hero</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="edit-hero-form">
        <div className="form-group">
          <label>Título (opcional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Nova Coleção"
          />
        </div>

        <div className="form-group">
          <label>Subtítulo (opcional)</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Ex: Até 40% OFF"
          />
        </div>

        <div className="form-group">
          <label>Tipo de Mídia *</label>
          <select
            name="mediaType"
            value={formData.mediaType}
            onChange={handleChange}
            required
          >
            <option value="image">Imagem</option>
            <option value="video">Vídeo</option>
          </select>
        </div>

        <div className="form-group">
          <label>Texto do Botão *</label>
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            placeholder="Ex: Confira"
            required
          />
        </div>

        <div className="form-group">
          <label>Link do Botão *</label>
          <input
            type="text"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleChange}
            placeholder="Ex: /categoria/verao"
            required
          />
        </div>

        <div className="form-group">
          <label>Mídia Atual</label>
          <div className="current-media-display">
            {currentMediaUrl ? (
              formData.mediaType === 'image' ? (
                <img src={currentMediaUrl} alt="Mídia atual do banner" />
              ) : (
                <video controls width="300"> {/* Exemplo de thumbnail para vídeo */}
                  <source src={currentMediaUrl} type="video/mp4" /> {/* Ajuste o tipo conforme necessário */}
                  Seu navegador não suporta vídeos.
                </video>
              )
            ) : (
              <p>Nenhuma mídia encontrada para este banner.</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Substituir Mídia (opcional)</label>
          <input
            type="file"
            accept={formData.mediaType === 'image' ? "image/*" : "video/*"} // Aceita imagem ou vídeo conforme o tipo selecionado
            onChange={handleMediaChange}
          />
          {preview && formData.mediaType === 'image' && (
            <div className="image-preview">
              <img src={preview} alt="Prévia da nova imagem" />
            </div>
          )}
          {/* Não há prévia para vídeo aqui, apenas o player acima para a mídia atual */}
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Ativo
          </label>
        </div>

        <div className="form-group">
          <label>Ordem</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Atualizar Banner'}
        </button>
      </form>
    </div>
  );
};

export default EditHero;