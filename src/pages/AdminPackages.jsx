import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Form
} from 'react-bootstrap'

import { Link } from 'react-router-dom'

import api from '../services/api'

const AdminPackages = () => {

  const [packages, setPackages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages')
      setPackages(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const deletePackage = async (id) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de eliminar este paquete?'
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/packages/${id}`)
      fetchPackages()
    } catch (error) {
      console.log(error)
    }
  }

  // Helper para buscar el precio de referencia de un paquete
  const getMinPackagePrice = (pkg) => {
    const firstCircuit = pkg.circuits?.[0]
    if (!firstCircuit) return 0

    let minPrice = Infinity

    // Recorremos los hoteles, salidas y precios del primer circuito para encontrar el menor precio
    firstCircuit.hotels?.forEach(hotel => {
      hotel.departures?.forEach(departure => {
        departure.prices?.forEach(priceItem => {
          if (priceItem.amount && priceItem.amount < minPrice) {
            minPrice = priceItem.amount
          }
        })
      })
    })

    return minPrice !== Infinity ? minPrice : 0
  }

  // Obtener categorías únicas disponibles dinámicamente
  const categories = Array.from(
    new Set(packages.map(pkg => pkg.category).filter(Boolean))
  )

  // Filtrar paquetes según la categoría seleccionada
  const filteredPackages = selectedCategory
    ? packages.filter(pkg => pkg.category === selectedCategory)
    : packages

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col xs={12} md={6}>
          <h1 className="fw-bold mb-3 mb-md-0">
            Gestión de Paquetes
          </h1>
        </Col>

        <Col xs={12} md={6} className="text-md-end">
          <Button
            as={Link}
            to="/admin/packages/create"
            variant="primary"
          >
            Crear Nuevo Paquete
          </Button>
        </Col>
      </Row>

      {/* FILTRO POR CATEGORÍA */}
      <Row className="mb-3">
        <Col xs={12} sm={6} md={4} lg={3}>
          <Form.Group controlId="categoryFilter">
            <Form.Label className="fw-semibold text-muted small">
              Filtrar por Categoría:
            </Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Table
        striped
        bordered
        hover
        responsive
      >
        <thead>
          <tr>
            <th>Título</th>
            <th>Destino</th>
            <th>Categoría</th>
            <th>Duración</th>
            <th>Precio Desde</th>
            <th>Transporte</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredPackages.length > 0 ? (
            filteredPackages.map(pkg => {
              // 1. La moneda viene en la raíz del paquete (según Schema)
              const currency = pkg.currency === 'USD' ? 'US$' : '$'

              // 2. Calculamos el precio desde el schema anidado
              const price = getMinPackagePrice(pkg)

              // 3. Transporte
              const currentTransportMode = pkg.transport?.mode || pkg.transport?.type || 'bus'
              const isPlane = 
                typeof currentTransportMode === 'string' && 
                ['plane', 'avion', 'avión'].includes(currentTransportMode.toLowerCase())

              return (
                <tr key={pkg._id}>
                  <td>
                    {pkg.title}
                  </td>

                  <td>
                    {pkg.destination}
                  </td>

                  <td>
                    {pkg.category}
                  </td>

                  <td>
                    {pkg.days}D / {pkg.nights}N
                  </td>

                  <td>
                    {currency} {price > 0 ? price.toLocaleString('es-AR') : 'A consultar'}
                  </td>

                  <td>
                    {isPlane ? 'Avión' : 'Bus'}
                    {' - '}
                    {pkg.transport?.category || 'Sin especificar'}
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        as={Link}
                        to={`/admin/packages/edit/${pkg._id}`}
                        variant="warning"
                        size="sm"
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
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-4"
              >
                {packages.length === 0
                  ? 'No hay paquetes cargados'
                  : 'No hay paquetes en esta categoría'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  )
}

export default AdminPackages