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
  const [filterStatus, setFilterStatus] = useState('') // Nuevo estado para el filtro de estado (vencidos/vigentes)

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

  // Obtener los precios mínimos en ARS y USD
  const getMinPackagePrices = (pkg) => {
    let minArs = Infinity
    let minUsd = Infinity

    pkg.circuits?.forEach(circuit => {
      circuit.hotels?.forEach(hotel => {
        hotel.departures?.forEach(departure => {
          departure.prices?.forEach(priceItem => {
            const arsVal =
              priceItem.amounts?.ars ?? priceItem.amount

            if (
              arsVal != null &&
              Number(arsVal) > 0 &&
              Number(arsVal) < minArs
            ) {
              minArs = Number(arsVal)
            }

            const usdVal =
              priceItem.amounts?.usd ?? priceItem.amountUsd

            if (
              usdVal != null &&
              Number(usdVal) > 0 &&
              Number(usdVal) < minUsd
            ) {
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

  // Obtener las fechas de salida de todos los circuitos y hoteles
  const getPackageDates = (pkg) => {
    const dates = []

    pkg.circuits?.forEach(circuit => {
      circuit.hotels?.forEach(hotel => {
        hotel.departures?.forEach(departure => {
          if (departure.date) {
            dates.push(departure.date)
          }
        })
      })
    })

    // Eliminar fechas duplicadas y ordenar cronológicamente
    return [...new Set(dates)].sort(
      (a, b) => new Date(a) - new Date(b)
    )
  }

  // Formatear fechas al formato argentino
  const formatPackageDate = (date) => {
    const parsedDate = new Date(date)

    if (isNaN(parsedDate.getTime())) {
      return 'Fecha inválida'
    }

    return parsedDate.toLocaleDateString('es-AR', {
      timeZone: 'UTC',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Obtener categorías únicas
  const categories = Array.from(
    new Set(packages.map(pkg => pkg.category).filter(Boolean))
  )

  // Filtrar por categoría Y por estado (vencidos / vigentes)
  const filteredPackages = packages.filter(pkg => {
    // Filtro por categoría
    const matchesCategory = selectedCategory 
      ? pkg.category === selectedCategory 
      : true

    if (!matchesCategory) return false

    // Si no hay filtro de estado, pasa
    if (!filterStatus) return true

    const packageDates = getPackageDates(pkg)

    // Validar si tiene alguna fecha futura (vigente)
    const hasFutureDates = packageDates.some(date => {
      const parsedDate = new Date(date)
      if (isNaN(parsedDate.getTime())) return false
      parsedDate.setUTCHours(0, 0, 0, 0)
      const todayUTC = new Date()
      todayUTC.setUTCHours(0, 0, 0, 0)
      return parsedDate >= todayUTC
    })

    // Comprobar la regla seleccionada
    if (filterStatus === 'expired') {
      // Vencido: O bien no tiene fechas, o todas sus fechas son pasadas (no tiene futuras)
      return packageDates.length === 0 || !hasFutureDates
    } else if (filterStatus === 'active') {
      // Vigente: Tiene al menos una fecha futura
      return hasFutureDates
    }

    return true
  })

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

      {/* FILTROS (Categoría y Estado) */}
      <Row className="mb-3 g-3">
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
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Form.Group controlId="statusFilter">
            <Form.Label className="fw-semibold text-muted small">
              Filtrar por Estado:
            </Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="active">Vigentes (Con salidas futuras)</option>
              <option value="expired">Vencidos (Sin salidas vigentes)</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Título</th>
            <th>Destino</th>
            <th>Categoría</th>
            <th>Duración</th>
            <th>Fechas de salida</th>
            <th>Monedas / Precio Desde</th>
            <th>Transporte</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredPackages.length > 0 ? (
            filteredPackages.map(pkg => {
              const minPrices = getMinPackagePrices(pkg)

              const packageDates = getPackageDates(pkg)

              const accepted = pkg.acceptedCurrencies?.length
                ? pkg.acceptedCurrencies
                : [pkg.currency || 'ARS']

              const currentTransportMode =
                pkg.transport?.mode ||
                pkg.transport?.type ||
                'bus'

              const isPlane =
                typeof currentTransportMode === 'string' &&
                ['plane', 'avion', 'avión'].includes(
                  currentTransportMode.toLowerCase()
                )

              // Determinar si existen salidas futuras
              const hasFutureDates = packageDates.some(date => {
                const parsedDate = new Date(date)

                if (isNaN(parsedDate.getTime())) {
                  return false
                }

                parsedDate.setUTCHours(0, 0, 0, 0)

                const todayUTC = new Date()
                todayUTC.setUTCHours(0, 0, 0, 0)

                return parsedDate >= todayUTC
              })

              return (
                <tr key={pkg._id}>
                  <td>{pkg.title}</td>

                  <td>{pkg.destination}</td>

                  <td>{pkg.category || 'Sin categoría'}</td>

                  <td>
                    {pkg.days}D / {pkg.nights}N
                  </td>

                  {/* FECHAS DE SALIDA */}
                  <td>
                    {packageDates.length > 0 ? (
                      <div className="d-flex flex-column gap-1">
                        {packageDates.map((date, index) => {
                          const parsedDate = new Date(date)

                          if (isNaN(parsedDate.getTime())) {
                            return (
                              <Badge
                                key={`${date}-${index}`}
                                bg="secondary"
                                className="text-start"
                              >
                                Fecha inválida
                              </Badge>
                            )
                          }

                          parsedDate.setUTCHours(0, 0, 0, 0)

                          const todayUTC = new Date()
                          todayUTC.setUTCHours(0, 0, 0, 0)

                          const isPast = parsedDate < todayUTC

                          return (
                            <Badge
                              key={`${date}-${index}`}
                              bg={isPast ? 'danger' : 'success'}
                              className="text-start"
                            >
                              {formatPackageDate(date)}
                              {isPast ? ' - Vencida' : ' - Vigente'}
                            </Badge>
                          )
                        })}

                        {!hasFutureDates && (
                          <small className="text-danger fw-bold mt-1">
                            Todas las fechas vencieron
                          </small>
                        )}
                      </div>
                    ) : (
                      <small className="text-muted">
                        Sin fechas cargadas
                      </small>
                    )}
                  </td>

                  {/* PRECIOS */}
                  <td>
                    <div className="d-flex flex-column gap-1">
                      {accepted.includes('ARS') && (
                        <div>
                          <Badge bg="secondary" className="me-1">
                            ARS
                          </Badge>

                          <small className="fw-semibold">
                            {minPrices.ars != null
                              ? `$ ${minPrices.ars.toLocaleString('es-AR')}`
                              : 'Sin precio'}
                          </small>
                        </div>
                      )}

                      {accepted.includes('USD') && (
                        <div>
                          <Badge bg="success" className="me-1">
                            USD
                          </Badge>

                          <small className="fw-semibold">
                            {minPrices.usd != null
                              ? `US$ ${minPrices.usd.toLocaleString('es-AR')}`
                              : 'Sin precio'}
                          </small>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* TRANSPORTE */}
                  <td>
                    {isPlane ? 'Avión' : 'Bus'}
                    {' - '}
                    {pkg.transport?.category || 'Sin especificar'}
                  </td>

                  {/* ACCIONES */}
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
              <td colSpan={8} className="text-center py-4">
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