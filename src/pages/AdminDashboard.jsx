import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'

const AdminDashboard = () => {
  return (
    <Container>
      <h1 className="mb-4">Dashboard Administrador</h1>
      <Row>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Paquetes</Card.Title>
              <Card.Text>10 paquetes activos</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Reservas</Card.Title>
              <Card.Text>25 reservas totales</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Usuarios</Card.Title>
              <Card.Text>100 usuarios registrados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard