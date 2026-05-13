import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const AdminNavbar = () => {
  const { logout } = useContext(AuthContext)

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand>Admin Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/admin/packages">
              <Nav.Link>Paquetes</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            <Nav.Link onClick={logout}>Cerrar Sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AdminNavbar