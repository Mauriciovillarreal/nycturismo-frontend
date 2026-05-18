import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Card,
  Badge
} from 'react-bootstrap'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaTags, FaTimes } from 'react-icons/fa'

import PackageCard from '../components/PackageCard'
import Loader from '../components/Loader'
import api from '../services/api'

const Packages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const date = searchParams.get('date')
  const category = searchParams.get('category')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages')
      setPackages(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // LÓGICA DE FILTRADO
  const filteredPackages = packages.filter(pkg => {
    const matchSearch = pkg.destination?.toLowerCase().includes(search.toLowerCase()) ||
                        pkg.title?.toLowerCase().includes(search.toLowerCase())

    const matchOrigin = !origin || pkg.origin === origin
    const matchDestination = !destination || pkg.destination === destination
    
    const matchDate = !date || pkg.availableDates?.some(
      item => new Date(item).toISOString().split('T')[0] === date.split('T')[0]
    )

    const matchCategory = !category || pkg.category?.toLowerCase() === category.toLowerCase()

    return matchSearch && matchOrigin && matchDestination && matchDate && matchCategory
  })

  // DETERMINACIÓN DEL TÍTULO DINÁMICO
  const getPageTitle = () => {
    if (category) return `Explorá Paquetes: ${category}`
    if (destination) return `Viajes a ${destination}`
    if (search) return `Resultados para "${search}"`
    return 'Nuestros Paquetes Turísticos'
  }

  // FUNCIÓN PARA LIMPIAR UN FILTRO ESPECÍFICO
  const removeFilter = (key) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete(key)
    setSearchParams(newParams)
  }

  if (loading) return <Loader />

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      
      {/* HEADER DE LA VISTA */}
      <div className="mb-5 text-center text-md-start">
        <h1 className="fw-extrabold display-5 text-dark mb-2">{getPageTitle()}</h1>
        <p className="text-muted fs-5">
          Descubrí las mejores experiencias preparadas para tu próximo viaje.
        </p>
        
        {/* BADGES DE FILTROS ACTIVOS */}
        <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center justify-content-md-start">
          {category && (
            <Badge bg="primary" className="p-2 d-flex align-items-center gap-2 fs-6 fw-normal">
              <FaTags /> Categoría: {category}
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => removeFilter('category')} />
            </Badge>
          )}
          {destination && (
            <Badge bg="success" className="p-2 d-flex align-items-center gap-2 fs-6 fw-normal">
              <FaMapMarkerAlt /> Destino: {destination}
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => removeFilter('destination')} />
            </Badge>
          )}
          {origin && (
            <Badge bg="info" className="p-2 d-flex align-items-center gap-2 fs-6 fw-normal text-white">
              <FaMapMarkerAlt /> Origen: {origin}
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => removeFilter('origin')} />
            </Badge>
          )}
          {date && (
            <Badge bg="warning" className="p-2 d-flex align-items-center gap-2 fs-6 fw-normal text-dark">
              <FaCalendarAlt /> Fecha: {new Date(date).toLocaleDateString('es-AR')}
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => removeFilter('date')} />
            </Badge>
          )}
        </div>
      </div>

      <Row className="g-4">
        
        {/* SIDEBAR DE CONTROL Y BÚSQUEDA */}
        <Col lg={3} md={4} xs={12}>
          <Card className="border-0 shadow-sm p-3 sticky-top" style={{ top: '20px', zIndex: 10 }}>
            <h5 className="fw-bold text-secondary mb-3 d-flex align-items-center gap-2">
              <FaSearch size={16} /> Filtrar resultados
            </h5>
            
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted text-uppercase">Buscador rápido</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Ej. Tokio, Bariloche..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-end-0"
                  />
                  <InputGroup.Text className="bg-white border-start-0 text-muted">
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Form>

            <div className="pt-2 border-top text-center">
              <span className="small text-muted fw-semibold">
                {filteredPackages.length} {filteredPackages.length === 1 ? 'paquete encontrado' : 'paquetes encontrados'}
              </span>
            </div>
          </Card>
        </Col>

        {/* GRID PRINCIPAL DE PAQUETES */}
        <Col lg={9} md={8} xs={12}>
          {filteredPackages.length > 0 ? (
            <Row className="g-4">
              {filteredPackages.map(pkg => (
                <Col
                  key={pkg._id}
                  xl={4}    // 3 tarjetas por fila en pantallas muy grandes
                  lg={6}    // 2 tarjetas por fila en pantallas grandes
                  md={12}   // 1 tarjeta completa en tablets si el sidebar ocupa espacio
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-center"
                >
                  <div className="w-100" style={{ maxWidth: '360px' }}>
                    <PackageCard pkg={pkg} />
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="border-0 shadow-sm p-5 text-center text-muted">
              <div className="py-4">
                <h4 className="fw-bold text-dark mb-2">No encontramos coincidencias</h4>
                <p className="mb-0">Intentá modificando los criterios de búsqueda o limpiando los filtros aplicados.</p>
              </div>
            </Card>
          )}
        </Col>

      </Row>
    </Container>
  )
}

export default Packages