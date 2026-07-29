import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

const Contact = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center mb-4">Contacto</h1>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Tu nombre" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="tu@email.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Enviar Mensaje
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Contact