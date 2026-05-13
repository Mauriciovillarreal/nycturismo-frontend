import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../services/api'

const AdminPackages = () => {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    const res = await api.get('/packages')
    setPackages(res.data)
  }

  const deletePackage = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este paquete?')) {
      await api.delete(`/packages/${id}`)
      fetchPackages()
    }
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Gestión de Paquetes</h1>
        </Col>
        <Col className="text-end">
          <Button as={Link} to="/admin/packages/create" variant="primary">
            Crear Nuevo Paquete
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Título</th>
            <th>Destino</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {packages.map(pkg => (
            <tr key={pkg._id}>
              <td>{pkg.title}</td>
              <td>{pkg.destination}</td>
              <td>${pkg.price}</td>
              <td>
                <Button
                  as={Link}
                  to={`/admin/packages/edit/${pkg._id}`}
                  variant="warning"
                  size="sm"
                  className="me-2"
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deletePackage(pkg._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default AdminPackages