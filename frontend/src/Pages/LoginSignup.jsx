import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState(() => {
    if (location.pathname === '/register') return 'signup';
    if (location.pathname === '/forgot-password') return 'forgot';
    return 'login';
  });

  const [step, setStep] = useState(1);

  // LOGIN
  const [loginData, setLoginData] = useState({ email: '', password: '', code: '' });

  // SIGNUP
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '', code: '' });

  // RECUPERAÇÃO DE SENHA
  const [forgotData, setForgotData] = useState({ email: '', code: '', newPassword: '', confirmNewPassword: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("auth-token", token);
      navigate('/');
    }
  }, [location.search, navigate]);

  // --- LOGIN ---
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLoginSubmitStep1 = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return alert('Preencha o email e a senha.');

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStep(2);
        alert('Código de segurança enviado para seu email.');
      } else {
        alert(data.message || data.error || 'Erro ao tentar login.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  const handleLoginSubmitStep2 = async (e) => {
    e.preventDefault();
    if (!loginData.code) return alert('Digite o código de segurança.');
    try {
      const res = await fetch('http://localhost:4000/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          code: loginData.code,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('auth-token', data.token);
        navigate('/');
      } else alert(data.message || 'Código incorreto.');
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  // --- SIGNUP ---
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleSignupSubmitStep1 = async (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword)
      return alert('Preencha todos os campos.');
    if (signupData.password !== signupData.confirmPassword)
      return alert('As senhas não conferem.');

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Usuário criado com sucesso!');
        setStep(2);
      } else {
        alert(data.error || data.message || 'Erro ao cadastrar.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  const handleSignupSubmitStep2 = async (e) => {
    e.preventDefault();
    if (!signupData.code) return alert('Digite o código de segurança.');
    try {
      const res = await fetch('http://localhost:4000/api/auth/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupData.email,
          code: signupData.code,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Cadastro concluído! Faça login.');
        setCurrentView('login');
        setStep(1);
        setSignupData({ name: '', email: '', password: '', confirmPassword: '', code: '' });
      } else alert(data.message || 'Código incorreto.');
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  // --- ESQUECI MINHA SENHA ---
  const handleForgotSubmitStep1 = async (e) => {
    e.preventDefault();
    if (!forgotData.email) return alert('Digite seu e-mail.');
    try {
      const res = await fetch('http://localhost:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotData.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep(2);
        alert('Código de recuperação enviado para seu e-mail.');
      } else {
        alert(data.message || data.error || 'Erro ao solicitar recuperação.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  const handleForgotSubmitStep2 = async (e) => {
    e.preventDefault();
    if (!forgotData.code) return alert('Digite o código de recuperação.');
    if (!forgotData.newPassword || !forgotData.confirmNewPassword) 
      return alert('Preencha a nova senha.');
    if (forgotData.newPassword !== forgotData.confirmNewPassword)
      return alert('As senhas não conferem.');

    try {
      const res = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotData.email,
          code: forgotData.code,
          newPassword: forgotData.newPassword
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Senha redefinida com sucesso! Faça login.');
        setCurrentView('login');
        setStep(1);
        setForgotData({ email: '', code: '', newPassword: '', confirmNewPassword: '' });
      } else {
        alert(data.message || 'Código inválido ou expirado.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className='loginSignup'>
      <div className="loginsignup-container">
        
        {/* LOGIN */}
        {currentView === 'login' && (
          <form onSubmit={step === 1 ? handleLoginSubmitStep1 : handleLoginSubmitStep2}>
            <h1>Entre</h1>
            {step === 1 && (
              <>
                <input name="email" value={loginData.email} onChange={handleLoginChange} placeholder="Email" required />
                <input name="password" type="password" value={loginData.password} onChange={handleLoginChange} placeholder="Senha" required />
                <button type="submit">Continuar</button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span 
                    onClick={() => setCurrentView('forgot')} 
                    style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Esqueci minha senha
                  </span>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <p>Código enviado para {loginData.email}</p>
                <input name="code" value={loginData.code} onChange={handleLoginChange} placeholder="Digite o código" required />
                <button type="submit">Confirmar</button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span 
                    onClick={() => setStep(1)} 
                    style={{ color: '#666', cursor: 'pointer' }}
                  >
                    ← Voltar
                  </span>
                </div>
              </>
            )}
            <div className="loginsignup-footer">
              <p>Novo na loja? <span onClick={() => { setCurrentView('signup'); setStep(1); }}>Comece aqui</span></p>
            </div>
          </form>
        )}

        {/* SIGNUP */}
        {currentView === 'signup' && (
          <form onSubmit={step === 1 ? handleSignupSubmitStep1 : handleSignupSubmitStep2}>
            <h1>Crie sua conta</h1>
            {step === 1 && (
              <>
                <input name="name" value={signupData.name} onChange={handleSignupChange} placeholder="Nome completo" required />
                <input name="email" value={signupData.email} onChange={handleSignupChange} placeholder="Email" required />
                <input name="password" type="password" value={signupData.password} onChange={handleSignupChange} placeholder="Senha" required />
                <input name="confirmPassword" type="password" value={signupData.confirmPassword} onChange={handleSignupChange} placeholder="Confirme a senha" required />
                <button type="submit">Continuar</button>
              </>
            )}
            {step === 2 && (
              <>
                <p>Código enviado para {signupData.email}</p>
                <input name="code" value={signupData.code} onChange={handleSignupChange} placeholder="Digite o código" required />
                <button type="submit">Confirmar</button>
              </>
            )}
            <div className="loginsignup-footer">
              <p>Já tem conta? <span onClick={() => { setCurrentView('login'); setStep(1); }}>Faça login</span></p>
            </div>
          </form>
        )}

        {/* ESQUECI MINHA SENHA */}
        {currentView === 'forgot' && (
          <form onSubmit={step === 1 ? handleForgotSubmitStep1 : handleForgotSubmitStep2}>
            <h1>Redefinir senha</h1>
            {step === 1 && (
              <>
                <input 
                  name="email" 
                  value={forgotData.email} 
                  onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })} 
                  placeholder="Seu e-mail" 
                  required 
                />
                <button type="submit">Enviar código</button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span 
                    onClick={() => setCurrentView('login')} 
                    style={{ color: '#666', cursor: 'pointer' }}
                  >
                    ← Voltar para login
                  </span>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <p>Código enviado para {forgotData.email}</p>
                <input 
                  name="code" 
                  value={forgotData.code} 
                  onChange={(e) => setForgotData({ ...forgotData, code: e.target.value })} 
                  placeholder="Código de recuperação" 
                  required 
                />
                <input 
                  name="newPassword" 
                  type="password" 
                  value={forgotData.newPassword} 
                  onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })} 
                  placeholder="Nova senha" 
                  required 
                />
                <input 
                  name="confirmNewPassword" 
                  type="password" 
                  value={forgotData.confirmNewPassword} 
                  onChange={(e) => setForgotData({ ...forgotData, confirmNewPassword: e.target.value })} 
                  placeholder="Confirme a nova senha" 
                  required 
                />
                <button type="submit">Redefinir senha</button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span 
                    onClick={() => setStep(1)} 
                    style={{ color: '#666', cursor: 'pointer' }}
                  >
                    ← Voltar
                  </span>
                </div>
              </>
            )}
          </form>
        )}
        
      </div>
    </div>
  );
};

export default LoginSignup;