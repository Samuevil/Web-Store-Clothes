import React from 'react'
import './Hero.css'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
          <h2>NOVIDADES</h2>
          <br /><br />
        <div>
              <p>Moda</p>
              <p>Para Todos</p>
        </div>

          <div className="hero-latest-btn">
               <div>
              <button>Ver Novidades
              <img src={arrow_icon} alt="" />
              </button>
              </div>
          </div>
      </div>

      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  )
}

export default Hero;