import React, { useState, useContext } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin/packages');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-page">

      {/* Lado Izquierdo */}
      <div className="login-image">
        <div className="overlay">
         
        </div>
      </div>

      {/* Lado Derecho */}
      <div className="login-form-container">
        <div className="login-card">

         

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} className="loginForm">
            <Form.Group className="mb-3">
            
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </Form.Group>

            <Button
              variant="warning"
              type="submit"
              className="login-btn"
            >
              Iniciar Sesión
            </Button>
          </Form>

        </div>
      </div>

    </div>
  );
};

export default Login;