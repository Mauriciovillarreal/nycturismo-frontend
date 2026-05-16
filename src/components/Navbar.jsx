import React from 'react'

import {
  Navbar,
  Container
} from 'react-bootstrap'

import { LinkContainer } from 'react-router-bootstrap'

import {
  FaPhoneAlt,
  FaWhatsapp
} from 'react-icons/fa'

import '../styles/navbar.css'

const NavbarComponent = () => {

  return (

    <Navbar className='customNavbar'>

      <Container className='navbarContent'>

        {/* LOGO */}
        <LinkContainer to='/'>
          <Navbar.Brand className='imgLogoNav'>

            <img
              src='../img/logonyc.png'
              alt='NYC Travel'
            />

          </Navbar.Brand>
        </LinkContainer>

        {/* INFO */}
        <div className='navInfo'>

          <span className='ventasText'>
            VENTAS:
          </span>

          <a
            href='tel:08102201031'
            className='navLink'
          >

            <FaPhoneAlt />

            4627-7994

          </a>

          <a
            href='https://wa.me/5491140500111'
            target='_blank'
            rel='noreferrer'
            className='navLink'
          >

            <FaWhatsapp />

            +54 9 11 5164-2289

          </a>

          <span className='navSchedule'>
            Lunes a Viernes 09 a 17 hs
          </span>

        </div>

      </Container>

    </Navbar>

  )
}

export default NavbarComponent