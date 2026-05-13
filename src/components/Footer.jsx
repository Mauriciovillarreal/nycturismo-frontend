import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>NycTurismo</h5>
            <p>Tu agencia de viajes premium</p>
          </Col>
          <Col md={4}>
            <h5>Contacto</h5>
            <p>WhatsApp: +1234567890</p>
            <p>Email: info@nycturismo.com</p>
          </Col>
          <Col md={4}>
            <h5>Enlaces</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">Política de Privacidad</a></li>
              <li><a href="#" className="text-light">Términos y Condiciones</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer