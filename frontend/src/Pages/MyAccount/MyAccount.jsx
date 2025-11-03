// frontend/src/pages/MyAccount.jsx
import React, { useState, useEffect } from 'react';

const MyAccount = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  // Busca os dados do usuário logado
  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/user/me', {
        method: 'GET',
        credentials: 'include', // <-- ESSENCIAL para enviar o cookie JWT
      });

      if (!response.ok) {
        console.log('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Salvar alterações do perfil
  const saveProfile = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // <-- necessário aqui também!
        body: JSON.stringify(user)
      });

      if (!response.ok) throw new Error('Erro ao salvar perfil');
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Falha ao salvar as informações.');
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="minha-conta">
      <h2>Minha Conta</h2>
      <div>
        <label>Nome:</label>
        <input
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </div>
      <div>
        <label>Endereço:</label>
        <input
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
        />
      </div>
      <div>
        <label>Telefone:</label>
        <input
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
        />
      </div>
      <button onClick={saveProfile}>Salvar</button>
    </div>
  );
};

export default MyAccount;
