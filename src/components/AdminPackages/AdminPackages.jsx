import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Form,
  Badge
} from 'react-bootstrap'

import { Link } from 'react-router-dom'

import api from '../../services/api'

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

  // Helper para buscar los precios mínimos de referencia en ARS y USD
  const getMinPackagePrices = (pkg) => {
    let minArs = Infinity
    let minUsd = Infinity

    pkg.circuits?.forEach(circuit => {
      circuit.hotels?.forEach(hotel => {
        hotel.departures?.forEach(departure => {
          departure.prices?.forEach(priceItem => {
            // Evaluamos ARS (soporta amounts.ars y el campo legacy amount)
            const arsVal = priceItem.amounts?.ars ?? priceItem.amount
            if (arsVal && Number(arsVal) > 0 && Number(arsVal) < minArs) {
              minArs = Number(arsVal)
            }

            // Evaluamos USD (soporta amounts.usd y el campo legacy amountUsd)
            const usdVal = priceItem.amounts?.usd ?? priceItem.amountUsd
            if (usdVal && Number(usdVal) > 0 && Number(usdVal) < minUsd) {
              minUsd = Number(usdVal)
            }
          })
        })
      })
    })

    return {
      ars: minArs !== Infinity ? minArs : null,
      usd: minUsd !== Infinity ? minUsd : null
    }
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
            <th>Monedas / Precio Desde</th>
            <th>Transporte</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredPackages.length > 0 ? (
            filteredPackages.map(pkg => {
              // 1. Calculamos los precios mínimos actualizados
              const minPrices = getMinPackagePrices(pkg)

              // 2. Monedas aceptadas (Array o fallback a currency raíz)
              const accepted = pkg.acceptedCurrencies?.length
                ? pkg.acceptedCurrencies
                : [pkg.currency || 'ARS']

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
                    <div className="d-flex flex-column gap-1">
                      {accepted.includes('ARS') && (
                        <div>
                          <Badge bg="secondary" className="me-1">ARS</Badge>
                          <small className="fw-semibold">
                            {minPrices.ars ? `$ ${minPrices.ars.toLocaleString('es-AR')}` : 'Sin precio'}
                          </small>
                        </div>
                      )}

                      {accepted.includes('USD') && (
                        <div>
                          <Badge bg="success" className="me-1">USD</Badge>
                          <small className="fw-semibold">
                            {minPrices.usd ? `US$ ${minPrices.usd.toLocaleString('es-AR')}` : 'Sin precio'}
                          </small>
                        </div>
                      )}
                    </div>
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