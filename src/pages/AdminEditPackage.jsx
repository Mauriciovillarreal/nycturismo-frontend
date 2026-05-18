import React, { useState, useEffect } from 'react'
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const AdminEditPackage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    operatorCode: '',
    origin: '',
    destination: '',
    category: '',
    description: '',
    days: '',
    nights: '',
    featured: false,
    transportType: 'bus',
    transportCategory: '',
    images: ['', '', '', '', ''],
    availableDates: [],
    circuits: []
  })

  useEffect(() => {
    fetchPackage()
  }, [id])

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/id/${id}`)
      const pkg = res.data

      // Normalizamos el tipo de transporte heredado por si viene en español
      const rawMode = pkg.transport?.mode || pkg.transport?.type || 'bus'
      let normalizedMode = 'bus'
      if (typeof rawMode === 'string' && (rawMode.toLowerCase() === 'avion' || rawMode.toLowerCase() === 'avión' || rawMode.toLowerCase() === 'plane')) {
        normalizedMode = 'plane'
      }

      setFormData({
        title: pkg.title || '',
        operatorCode: pkg.operatorCode || '',
        origin: pkg.origin || '',
        destination: pkg.destination || '',
        category: pkg.category || '',
        description: pkg.description || '',
        days: pkg.days || '',
        nights: pkg.nights || '',
        featured: pkg.featured || false,
        transportType: normalizedMode,
        // Guardamos la categoría normalizada en minúsculas (Mongoose backend)
        transportCategory: pkg.transport?.category?.toLowerCase() || '',
        images: pkg.images?.length
          ? [
            pkg.images[0] || '',
            pkg.images[1] || '',
            pkg.images[2] || '',
            pkg.images[3] || '',
            pkg.images[4] || ''
          ]
          : ['', '', '', '', ''],

        availableDates: pkg.availableDates?.map(item => ({
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
          hotel: item.hotel || '',
          hotelImage: item.hotelImage || ''
        })) || [],

        circuits: pkg.circuits?.map(circuit => ({
          title: circuit.title || '',
          description: circuit.description || '',
          includes: circuit.includes?.join(', ') || '',
          excludes: circuit.excludes?.join(', ') || '',
          price: circuit.price || '',
          currency: circuit.currency || 'ARS'
        })) || []
      })
    } catch (error) {
      console.error(error)
      alert('Error al cargar los datos del paquete')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Si cambia el tipo de transporte, reseteamos la categoría para evitar desajustes de validación
    if (name === 'transportType') {
      setFormData({
        ...formData,
        [name]: value,
        transportCategory: ''
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }
  }

  // --- MANEJO DE FECHAS Y HOTELES ---
  const handleDateChange = (index, field, value) => {
    const updatedDates = [...formData.availableDates]
    updatedDates[index][field] = value
    setFormData({ ...formData, availableDates: updatedDates })
  }

  const addAvailableDate = () => {
    setFormData({
      ...formData,
      availableDates: [...formData.availableDates, { date: '', hotel: '', hotelImage: '' }]
    })
  }

  const removeAvailableDate = (index) => {
    const updatedDates = formData.availableDates.filter((_, i) => i !== index)
    setFormData({ ...formData, availableDates: updatedDates })
  }

  // --- MANEJO DE CIRCUITOS ---
  const handleCircuitChange = (index, field, value) => {
    const updatedCircuits = [...formData.circuits]
    updatedCircuits[index][field] = value
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  const addCircuit = () => {
    setFormData({
      ...formData,
      circuits: [
        ...formData.circuits,
        {
          title: '',
          description: '',
          includes: '',
          excludes: '',
          price: '',
          currency: 'ARS'
        }
      ]
    })
  }

  const removeCircuit = (index) => {
    const updatedCircuits = formData.circuits.filter((_, i) => i !== index)
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  // --- MANEJO DE IMÁGENES ---
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = value
    setFormData({ ...formData, images: updatedImages })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    const data = {
      title: formData.title,
      slug,
      operatorCode: formData.operatorCode.trim(),
      origin: formData.origin,
      destination: formData.destination,
      category: formData.category,
      description: formData.description,
      days: Number(formData.days),
      nights: Number(formData.nights),
      featured: formData.featured,
      transport: {
        mode: formData.transportType,
        category: formData.transportCategory // Envía el string estructurado en minúscula
      },
      images: formData.images.filter(image => image.trim() !== ''),

      availableDates: formData.availableDates
        .filter(item => item.date.trim() !== '' && item.hotel.trim() !== '')
        .map(item => ({
          date: new Date(item.date),
          hotel: item.hotel.trim(),
          hotelImage: item.hotelImage.trim()
        })),

      circuits: formData.circuits.map(circuit => ({
        title: circuit.title,
        description: circuit.description,
        includes: circuit.includes ? circuit.includes.split(',').map(item => item.trim()) : [],
        excludes: circuit.excludes ? circuit.excludes.split(',').map(item => item.trim()) : [],
        price: Number(circuit.price),
        currency: circuit.currency
      }))
    }

    try {
      await api.put(`/packages/${id}`, data)
      navigate('/admin/packages')
    } catch (error) {
      console.error(error)
      alert('Error al actualizar el paquete')
    }
  }

  return (
    <Container className="py-5">
      <Card className="shadow border-0 rounded-4 p-4">
        <h2 className="fw-bold mb-4">Editar paquete</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Título */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Código de Operador */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Código de Operador</Form.Label>
                <Form.Control
                  type="text"
                  name="operatorCode"
                  placeholder="Ej: OPER-748"
                  value={formData.operatorCode}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Categoría */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  placeholder="Ej: Internacional, Miniturismo..."
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Origen */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Origen</Form.Label>
                <Form.Control
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Destino */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Destino</Form.Label>
                <Form.Control
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Días */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Días</Form.Label>
                <Form.Control
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Noches */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Noches</Form.Label>
                <Form.Control
                  type="number"
                  name="nights"
                  value={formData.nights}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Medio de Transporte */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Transporte</Form.Label>
                <Form.Select
                  name="transportType"
                  value={formData.transportType}
                  onChange={handleChange}
                >
                  <option value="bus">Bus</option>
                  <option value="plane">Avión</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Clase/Categoría de Transporte (Select Dinámico) */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo / Clase de servicio</Form.Label>
                <Form.Select
                  name="transportCategory"
                  value={formData.transportCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una opción...</option>
                  {formData.transportType === 'bus' ? (
                    <>
                      <option value="semi-cama">Semi-Cama</option>
                      <option value="cama">Cama</option>
                      <option value="semi-cama/cama">Semi-Cama / Cama</option>
                    </>
                  ) : (
                    <>
                      <option value="clase-economica">Clase Económica</option>
                      <option value="economica-premium">Económica Premium</option>
                      <option value="clase-ejecutiva">Clase Ejecutiva</option>
                      <option value="primera-clase">Primera Clase</option>
                    </>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Descripción */}
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* SECCIÓN DE IMÁGENES */}
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold mb-3">URLs de Imágenes (Máx. 5)</Form.Label>
                {formData.images.map((image, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    className="mb-3"
                    placeholder={`URL de Imagen ${index + 1}`}
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                ))}
              </Form.Group>
            </Col>

            {/* SECCIÓN: FECHAS DISPONIBLES + HOTELES */}
            <Col md={12} className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">Fechas Disponibles y Hoteles</h4>
                <Button variant="dark" onClick={addAvailableDate}>
                  + Agregar Fecha y Hotel
                </Button>
              </div>

              {formData.availableDates.length === 0 ? (
                <p className="text-muted small italic">No hay fechas asignadas a este paquete aún.</p>
              ) : (
                formData.availableDates.map((item, index) => (
                  <Row key={index} className="align-items-end mb-2 g-2 bg-light p-2 rounded-3 border">
                    <Col sm={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-secondary">Fecha de Salida</Form.Label>
                        <Form.Control
                          type="date"
                          value={item.date}
                          onChange={(e) => handleDateChange(index, 'date', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-secondary">Hotel Asignado</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nombre del Hotel"
                          value={item.hotel}
                          onChange={(e) => handleDateChange(index, 'hotel', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={3}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold text-secondary">Miniatura del Hotel (URL)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="https://link-de-la-foto.jpg"
                          value={item.hotelImage}
                          onChange={(e) => handleDateChange(index, 'hotelImage', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={2} className="text-end">
                      <Button
                        variant="danger"
                        className="w-100"
                        onClick={() => removeAvailableDate(index)}
                      >
                        Quitar
                      </Button>
                    </Col>
                  </Row>
                ))
              )}
            </Col>

            {/* SECCIÓN DE CIRCUITOS */}
            <Col md={12} className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0">Circuitos / Opciones de Tarifa</h4>
                <Button variant="dark" onClick={addCircuit}>
                  + Agregar circuito
                </Button>
              </div>
            </Col>

            {formData.circuits.map((circuit, index) => (
              <Col md={12} key={index}>
                <Card className="p-4 mb-4 border-secondary-subtle shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0 text-primary">Circuito {index + 1}</h5>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeCircuit(index)}
                    >
                      Eliminar Circuito
                    </Button>
                  </div>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Título del Circuito</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.title}
                          onChange={(e) => handleCircuitChange(index, 'title', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Moneda</Form.Label>
                        <Form.Select
                          value={circuit.currency}
                          onChange={(e) => handleCircuitChange(index, 'currency', e.target.value)}
                        >
                          <option value="ARS">Pesos (ARS)</option>
                          <option value="USD">Dólares (USD)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Descripción corta</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.description}
                          onChange={(e) => handleCircuitChange(index, 'description', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Precio base</Form.Label>
                        <Form.Control
                          type="number"
                          value={circuit.price}
                          onChange={(e) => handleCircuitChange(index, 'price', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Incluye (separado por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Desayuno, Excursión, Coordinador..."
                          value={circuit.includes}
                          onChange={(e) => handleCircuitChange(index, 'includes', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>No Incluye (separado por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Comidas en ruta, Entradas a parques..."
                          value={circuit.excludes}
                          onChange={(e) => handleCircuitChange(index, 'excludes', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}

            {/* Paquete Destacado */}
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  label="Marcar este paquete como Destacado"
                  className="fw-semibold"
                />
              </Form.Group>
            </Col>

            {/* Botón de envío */}
            <Col md={12}>
              <Button
                type="submit"
                variant="dark"
                className="w-100 py-3 rounded-3 fw-bold XML-btn-submit"
              >
                Guardar cambios del paquete
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  )
}

export default AdminEditPackage