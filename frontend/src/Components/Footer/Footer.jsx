import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintester_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'


const Footer = () => {
  const redirectToHome = () => {
    window.location.href = '/';
  };
  return (
    <div className='footer'>
      <div className="footer-logo" onClick={redirectToHome}>
        <img src={footer_logo} alt="" />
        <p>SHOPEVILS</p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
      <div className="footer-icons-container">
       <a href="https://www.instagram.com/samuevil/" target="_blank" rel="noopener noreferrer">
        <img src={instagram_icon} alt="" />
       </a>
</div>


        <div className="footer-icons-container">
            <img src={pintester_icon} alt="" />
        </div>

        <div className="footer-icons-container">
            <img src={whatsapp_icon} alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p> Copyright @2024 - All Right Reserved</p>
      </div>
    </div>
  )
}

export default Footer
