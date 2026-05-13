import React, { useState, useContext } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/admin/packages')
    } catch (err) {
      setError('Credenciales inválidas')
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h1 className="text-center mb-4">Login Admin</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login