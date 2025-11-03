// frontend/src/Components/Navbar.jsx
import React, { useContext, useRef, useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const userMenuRef = useRef();
  const location = useLocation();

  const [menu, setMenu] = useState('shop');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState('');

  // Verifica se usuário está logado e pega o nome
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      // Aqui você pode buscar o nome do usuário do banco ou decodificar JWT
      const storedName = localStorage.getItem('user-name') || 'Usuário';
      setUserName(storedName);
    }
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-name');
    window.location.replace('/');
  };

  const redirectToHome = () => window.location.href = '/';

  const isLoggedIn = localStorage.getItem('auth-token');

  return (
    <div className='navbar'>
      <div className="nav-logo" onClick={redirectToHome}>
        <img src={logo} alt="Logo" />
        <p>SHOPEVILS</p>
      </div>

      <img className='nav-dropdown' onClick={() => menuRef.current.classList.toggle('nav-menu-visible')} src={nav_dropdown} alt="" />

      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu('shop')}><Link to='/'>Shop</Link>{menu==='shop' && location.pathname !== '/cart' && <hr />}</li>
        <li onClick={() => setMenu('mens')}><Link to='/mens'>Men</Link>{menu==='mens' && location.pathname !== '/cart' && <hr />}</li>
        <li onClick={() => setMenu('womens')}><Link to='/womens'>Women</Link>{menu==='womens' && location.pathname !== '/cart' && <hr />}</li>
        <li onClick={() => setMenu('kids')}><Link to='/kids'>Kids</Link>{menu==='kids' && location.pathname !== '/cart' && <hr />}</li>
      </ul>

      <div className="nav-login-cart">
        <div className="nav-user-menu-container" ref={userMenuRef}>
          <button className="nav-user-button" onMouseEnter={!isLoggedIn ? toggleUserMenu : null} onClick={isLoggedIn ? toggleUserMenu : null}>
       Olá, {isLoggedIn && userName ? userName.split(' ')[0] : 'faça seu login'}
            <img className={`nav-user-dropdown-icon ${showUserMenu ? 'open' : ''}`} src={nav_dropdown} alt="Menu" />
          </button>

          {showUserMenu && !isLoggedIn && (
            <ul className="nav-user-dropdown-menu">
              <li>
                <Link to='/login'>Faça seu login</Link>
              </li>
              <li style={{ padding: '5px 15px', fontSize: '14px', color: '#666' }}>
                Cliente novo? <Link to='/register'>Comece aqui</Link>
              </li>
            </ul>
          )}

          {showUserMenu && isLoggedIn && (
            <ul className="nav-user-dropdown-menu">
              <li><Link to='/minha-conta' onClick={() => setShowUserMenu(false)}>Minha Conta</Link></li>
              <li><Link to='/minhas-compras' onClick={() => setShowUserMenu(false)}>Minhas Compras</Link></li>
              <li><button onClick={handleLogout}>Sair</button></li>
            </ul>
          )}
        </div>

        <Link to='/cart'>
          <img src={cart_icon} alt='Carrinho' />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
