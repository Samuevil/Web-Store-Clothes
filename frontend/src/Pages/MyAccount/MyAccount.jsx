
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('personal'); 

  const [user, setUser] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
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
        cpf: data.cpf ? formatCPF(data.cpf) : '',
        phone: data.phone || '',
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

  const formatCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 11);
    const formatted = formatCPF(limited);
    setUser({ ...user, cpf: formatted });
  };

  const savePersonal = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Sessão expirada.');
        navigate('/login');
        return;
      }

      const cpfLimpo = user.cpf.replace(/\D/g, '');

      const response = await fetch('http://localhost:4000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          cpf: cpfLimpo,
          phone: user.phone
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro ao salvar');
      }

      alert('Dados pessoais atualizados com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar dados pessoais:', err);
      alert('Falha ao salvar: ' + err.message);
    }
  };

  const saveAddress = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Sessão expirada.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:4000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          address: user.address
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro ao salvar');
      }

      alert('Endereço atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar endereço:', err);
      alert('Falha ao salvar: ' + err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando...</p>;

  return (
    <div className="minha-conta" style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Sidebar */}
      <div style={{ width: '200px', marginRight: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Minha Conta</h3>
        <ul style={{ listStyle: 'none', padding: 0, cursor: 'pointer' }}>
          <li
            onClick={() => setActiveTab('personal')}
            style={{
              padding: '10px',
              backgroundColor: activeTab === 'personal' ? '#e9ecef' : 'transparent',
              borderRadius: '4px',
              marginBottom: '8px'
            }}
          >
            Dados pessoais
          </li>
          <li
            onClick={() => setActiveTab('address')}
            style={{
              padding: '10px',
              backgroundColor: activeTab === 'address' ? '#e9ecef' : 'transparent',
              borderRadius: '4px',
              marginBottom: '8px'
            }}
          >
            Meu endereço
          </li>
        </ul>
      </div>

      {/* Conteúdo principal */}
      <div style={{ flex: 1 }}>
        {activeTab === 'personal' && (
          <div>
            <h2>Dados pessoais</h2>
            
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
                onChange={handleCPFChange}
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

            <button
              onClick={savePersonal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Salvar Dados Pessoais
            </button>
          </div>
        )}

        {activeTab === 'address' && (
          <div>
            <h2>Meu endereço</h2>

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
              onClick={saveAddress}
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
        )}
      </div>
    </div>
  );
};

export default MyAccount;