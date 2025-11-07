// frontend/src/pages/MyAccount.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '', // ✅ novo campo
    address: {
      street: '',
      number: '',
      neighborhood: '',
      complement: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Você precisa estar logado.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:4000/api/user/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Não autorizado');

      const data = await response.json();
      
      setUser({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        cpf: data.cpf ? formatCPF(data.cpf) : '', // ✅ formata ao carregar
        address: {
          street: data.address?.street || '',
          number: data.address?.number || '',
          neighborhood: data.address?.neighborhood || '',
          complement: data.address?.complement || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          zip: data.address?.zip || ''
        }
      });
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Função para formatar CPF com máscara
  const formatCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // ✅ Função para lidar com input de CPF
  const handleCPFChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, ''); // Remove tudo que não é dígito
    const limited = cleaned.slice(0, 11); // Máximo 11 dígitos
    const formatted = formatCPF(limited);
    setUser({ ...user, cpf: formatted });
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Sessão expirada.');
        navigate('/login');
        return;
      }

      // ✅ Remove máscara antes de enviar
      const cpfLimpo = user.cpf.replace(/\D/g, '');

      const response = await fetch('http://localhost:4000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          cpf: cpfLimpo, // ✅ envia só os números
          address: user.address
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro ao salvar');
      }

      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Falha ao salvar: ' + err.message);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="minha-conta" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Meu Endereço</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Nome Completo:</label>
        <input
          type="text"
          value={user.name}
          onChange={e => setUser({ ...user, name: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>E-mail:</label>
        <input
          type="email"
          value={user.email}
          readOnly
          style={{ width: '100%', padding: '8px', backgroundColor: '#f5f5f5' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>CPF:</label>
        <input
          type="text"
          value={user.cpf}
          onChange={handleCPFChange} // ✅ usa função especial
          placeholder="000.000.000-00"
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Telefone:</label>
        <input
          type="tel"
          value={user.phone}
          onChange={e => setUser({ ...user, phone: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <h3>Endereço</h3>

      <div style={{ marginBottom: '15px' }}>
        <label>CEP:</label>
        <input
          value={user.address.zip}
          onChange={e => setUser({
            ...user,
            address: { ...user.address, zip: e.target.value }
          })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Rua:</label>
        <input
          value={user.address.street}
          onChange={e => setUser({
            ...user,
            address: { ...user.address, street: e.target.value }
          })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Número:</label>
        <input
          value={user.address.number}
          onChange={e => setUser({
            ...user,
            address: { ...user.address, number: e.target.value }
          })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Complemento:</label>
        <input
          value={user.address.complement}
          onChange={e => setUser({
            ...user,
            address: { ...user.address, complement: e.target.value }
          })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Bairro:</label>
        <input
          value={user.address.neighborhood}
          onChange={e => setUser({
            ...user,
            address: { ...user.address, neighborhood: e.target.value }
          })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Cidade:</label>
        <input
          value={user.address.city}
          onChange={e => setUser({
            ...user,
            address: { ...user.address, city: e.target.value }
          })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Estado (UF):</label>
        <input
          value={user.address.state}
          onChange={e => setUser({
            ...user,
            address: { ...user.address, state: e.target.value }
          })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button
        onClick={saveProfile}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Salvar Endereço
      </button>
    </div>
  );
};

export default MyAccount;