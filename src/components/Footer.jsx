import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaChevronRight
} from 'react-icons/fa'

import '../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="main-footer">
      <Container className="py-5">
        <Row className="g-4">

          {/* COLUMNA 1: LOGO Y BREVE DESCRIPCIÓN */}
          <Col lg={4} md={6} sm={12}>
            <div className="footer-brand-box">
              <img src="/img/logoblanconyc.png" alt="NYC Turismo" className="footer-logo mb-3" />
              <p className="footer-text">
                Tu próximo destino está más cerca de lo que imaginás. Llevamos años organizando las mejores experiencias de viaje nacionales e internacionales.
              </p>
              <div className="footer-socials mt-4">
                <a href="https://www.instagram.com/nyctravelviajes/" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                <a href="https://www.facebook.com/share/1D9ZSBoKme/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              </div>
            </div>
          </Col>

          {/* COLUMNA 2: CATEGORÍAS RÁPIDAS */}
          <Col lg={2} md={6} sm={6} xs={6}>
            <h5 className="footer-title">Destinos</h5>
            <ul className="footer-links list-unstyled">
              <li className="footer-link-item"><Link to="/packages?category=Nacionales"><FaChevronRight className="link-arrow" /> Nacionales</Link></li>
              <li className="footer-link-item"><Link to="/packages?category=Internacional"><FaChevronRight className="link-arrow" /> Internacional</Link></li>
              <li className="footer-link-item"><Link to="/packages?category=Europa"><FaChevronRight className="link-arrow" /> Europa</Link></li>
              <li className="footer-link-item"><Link to="/packages?category=Caribe"><FaChevronRight className="link-arrow" /> Caribe</Link></li>
            </ul>
          </Col>

          {/* COLUMNA 3: ENLACES CORPORATIVOS / LEGALES */}
          {/* COLUMNA 3: ENLACES CORPORATIVOS / LEGALES */}
          <Col lg={2} md={6} sm={6} xs={6}>
            <h5 className="footer-title">Empresa</h5>
            <ul className="footer-links list-unstyled">
              {/* Cambiado de <a> a <Link> apuntando a la nueva ruta */}
              <li className="footer-link-item">
                <Link to="/quienes-somos">
                  <FaChevronRight className="link-arrow" /> Quiénes somos
                </Link>
              </li>
              <li className="mt-3"><span className="footer-legal-text">LEG 7865 D.N.T 27692</span></li>
            </ul>
          </Col>

          {/* COLUMNA 4: DATOS DE CONTACTO */}
          <Col lg={4} md={6} sm={12}>
            <h5 className="footer-title">Contacto</h5>
            <ul className="footer-contact list-unstyled">
              <li className="d-flex align-items-start mb-3 gap-2">
                <FaMapMarkerAlt className="contact-icon mt-1" />
                <span className="contact-text">Buenos Aires, Argentina</span>
              </li>
              <li className="d-flex align-items-start mb-3 gap-2">
                <FaWhatsapp className="contact-icon mt-1" />
                <a href="https://wa.me/5491151642289" target="_blank" rel="noreferrer" className="contact-link">+54 9 11 5164-2289</a>
              </li>
              <li className="d-flex align-items-start mb-3 gap-2">
                <FaEnvelope className="contact-icon mt-1" />
                <a href="mailto:nyctravelviajesyturismo@gmail.com" className="contact-link text-break">nyctravelviajesyturismo@gmail.com</a>
              </li>
            </ul>
          </Col>

        </Row>
      </Container>

      {/* BARRA INFERIOR DE COPYRIGHT */}
      <div className="footer-bottom py-3">
        <Container>
          <Row>
            <Col md={12} className="text-center">
              <p className="mb-0 small footer-copyright">
                &copy; {new Date().getFullYear()} NYC Travel. Todos los derechos reservados.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  )
}

export default Footer