import React, { useState } from 'react'
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaCalendarPlus, FaTrash, FaImage } from 'react-icons/fa'
import api from '../services/api'

const AdminCreatePackage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    operatorCode: '', // AGREGADO
    origin: '',
    destination: '',
    category: '', // Inicializado correctamente como string vacío
    description: '',
    days: '',
    nights: '',
    featured: false,
    transportType: 'bus',
    transportCategory: '',
    images: ['', '', '', '', ''], 
    availableDates: [
      { date: '', hotel: '', hotelImage: '' } // ACTUALIZADO
    ],
    circuits: [
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // --- MANEJO DE IMÁGENES ---
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = value
    setFormData({
      ...formData,
      images: updatedImages
    })
  }

  // --- MANEJO DE CIRCUITOS ---
  const handleCircuitChange = (index, field, value) => {
    const updatedCircuits = [...formData.circuits]
    updatedCircuits[index][field] = value
    setFormData({
      ...formData,
      circuits: updatedCircuits
    })
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
    if (formData.circuits.length === 1) return
    const updatedCircuits = formData.circuits.filter((_, i) => i !== index)
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  // --- MANEJO DE FECHAS Y HOTELES ---
  const handleDateChange = (index, field, value) => {
    const updatedDates = [...formData.availableDates]
    updatedDates[index][field] = value
    setFormData({
      ...formData,
      availableDates: updatedDates
    })
  }

  const addDateRow = () => {
    setFormData({
      ...formData,
      availableDates: [
        ...formData.availableDates,
        { date: '', hotel: '', hotelImage: '' } // ACTUALIZADO
      ]
    })
  }

  const removeDateRow = (index) => {
    if (formData.availableDates.length === 1) return
    const updatedDates = formData.availableDates.filter((_, i) => i !== index)
    setFormData({ ...formData, availableDates: updatedDates })
  }

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault()

    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    const data = {
      title: formData.title,
      slug,
      operatorCode: formData.operatorCode.trim(), // AGREGADO
      origin: formData.origin,
      destination: formData.destination,
      category: formData.category.trim(), // Se limpia de espacios por las dudas
      description: formData.description,
      days: Number(formData.days),
      nights: Number(formData.nights),
      featured: formData.featured,
      transport: {
        type: formData.transportType,
        category: formData.transportCategory
      },
      
      images: formData.images
        .map(url => url.trim())
        .filter(url => url !== ''),

      availableDates: formData.availableDates
        .filter(item => item.date !== '')
        .map(item => ({
          date: item.date,
          hotel: item.hotel.trim(),
          hotelImage: item.hotelImage.trim() // AGREGADO
        })),

      circuits: formData.circuits.map(circuit => ({
        title: circuit.title,
        description: circuit.description,
        includes: circuit.includes
          ? circuit.includes.split(',').map(item => item.trim())
          : [],
        excludes: circuit.excludes
          ? circuit.excludes.split(',').map(item => item.trim())
          : [],
        price: Number(circuit.price),
        currency: circuit.currency
      }))
    }

    try {
      await api.post('/packages', data)
      navigate('/admin/packages')
    } catch (error) {
      console.error(error)
      alert('Error al crear el paquete')
    }
  }

  return (
    <Container className="py-5">
      <Card className="shadow border-0 rounded-4 p-4">
        <h2 className="mb-4 fw-bold text-dark">Crear Nuevo Paquete</h2>

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* TITULO */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Título</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Japón Soñado 2026"
                  required
                />
              </Form.Group>
            </Col>

            {/* CÓDIGO DE OPERADOR */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Código de Operador</Form.Label>
                <Form.Control
                  type="text"
                  name="operatorCode"
                  value={formData.operatorCode}
                  onChange={handleChange}
                  placeholder="Ej: OP-7721"
                />
              </Form.Group>
            </Col>

            {/* CATEGORIA (MODIFICADO A INPUT LIBRE) */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Categoría</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Ej: Miniturismo, Nacionales, Internacional, Escapadas..."
                  required
                />
              </Form.Group>
            </Col>

            {/* ORIGEN */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Origen</Form.Label>
                <Form.Control
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="Ej: Buenos Aires"
                  required
                />
              </Form.Group>
            </Col>

            {/* DESTINO */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Destino</Form.Label>
                <Form.Control
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Ej: Japón"
                  required
                />
              </Form.Group>
            </Col>

            {/* DIAS */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Cantidad de días</Form.Label>
                <Form.Control
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* NOCHES */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Cantidad de noches</Form.Label>
                <Form.Control
                  type="number"
                  name="nights"
                  value={formData.nights}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* TRANSPORTE */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Transporte</Form.Label>
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

            {/* TIPO CATEGORIA TRANSPORTE */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Tipo/Clase</Form.Label>
                <Form.Control
                  type="text"
                  name="transportCategory"
                  value={formData.transportCategory}
                  onChange={handleChange}
                  placeholder="Ej: semi-cama / business"
                />
              </Form.Group>
            </Col>

            {/* DESCRIPCION */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Descripción del viaje</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <hr className="my-4 text-muted" />

            {/* ===== URLs DE IMÁGENES INDIVIDUALES ===== */}
            <Col md={12} className="mb-3">
              <h4 className="fw-bold m-0"><FaImage className="me-2 text-secondary" />URLs de Imágenes (Máx. 5)</h4>
              <p className="text-muted small mb-0">La primera imagen cargada se tomará como la portada principal del paquete.</p>
            </Col>

            <Col md={12} className="mb-4">
              <Card className="p-3 bg-light border-0 rounded-3">
                {formData.images.map((url, index) => (
                  <Form.Group key={index} className={index < 4 ? "mb-2" : "mb-0"}>
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      {index === 0 ? "Imagen Principal (Portada)" : `Imagen Secundaria #${index + 1}`}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      required={index === 0} 
                    />
                  </Form.Group>
                ))}
              </Card>
            </Col>

            <hr className="my-2 text-muted" />

            {/* ===== FECHAS Y HOTELES DINÁMICOS ===== */}
            <Col md={12} className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold m-0">Fechas de Salida y Hoteles asignados</h4>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={addDateRow}
                  className="d-flex align-items-center gap-1"
                >
                  <FaCalendarPlus /> Añadir Fecha
                </Button>
              </div>
            </Col>

            <Col md={12} className="mb-4">
              <Card className="p-3 bg-light border-0 rounded-3">
                {formData.availableDates.map((item, index) => (
                  <Row key={index} className="align-items-end mb-3">
                    {/* FECHA */}
                    <Col md={3} sm={12}>
                      <Form.Group>
                        {index === 0 && <Form.Label className="small fw-bold text-secondary">Fecha de Salida</Form.Label>}
                        <Form.Control
                          type="date"
                          value={item.date}
                          onChange={(e) => handleDateChange(index, 'date', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    {/* HOTEL */}
                    <Col md={4} sm={12}>
                      <Form.Group>
                        {index === 0 && <Form.Label className="small fw-bold text-secondary">Hotel Asignado</Form.Label>}
                        <Form.Control
                          type="text"
                          value={item.hotel}
                          onChange={(e) => handleDateChange(index, 'hotel', e.target.value)}
                          placeholder="Ej: Hotel Pokemon"
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* IMAGEN DEL HOTEL */}
                    <Col md={4} sm={12}>
                      <Form.Group>
                        {index === 0 && <Form.Label className="small fw-bold text-secondary">URL Imagen del Hotel</Form.Label>}
                        <Form.Control
                          type="text"
                          value={item.hotelImage}
                          onChange={(e) => handleDateChange(index, 'hotelImage', e.target.value)}
                          placeholder="https://ejemplo.com/hotel.jpg"
                        />
                      </Form.Group>
                    </Col>

                    {/* ACCIÓN ELIMINAR */}
                    <Col md={1} sm={12} className="text-end">
                      <Button
                        variant="outline-danger"
                        onClick={() => removeDateRow(index)}
                        disabled={formData.availableDates.length === 1}
                        className="w-100"
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Card>
            </Col>

            <hr className="my-2 text-muted" />

            {/* ===== CIRCUITOS Y TARIFAS ===== */}
            <Col md={12} className="mt-2">
              <h4 className="fw-bold mb-3">Opciones de Circuitos / Servicios</h4>
            </Col>

            {formData.circuits.map((circuit, index) => (
              <Col md={12} key={index}>
                <Card className="p-4 mb-4 border position-relative shadow-sm rounded-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0 text-secondary">
                      Opción #{index + 1}
                    </h5>
                    {formData.circuits.length > 1 && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeCircuit(index)}
                      >
                        Eliminar Opción
                      </Button>
                    )}
                  </div>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Nombre del Circuito</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.title}
                          placeholder="Ej: Circuito Sakura"
                          onChange={(e) => handleCircuitChange(index, 'title', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Moneda</Form.Label>
                        <Form.Select
                          value={circuit.currency}
                          onChange={(e) => handleCircuitChange(index, 'currency', e.target.value)}
                        >
                          <option value="ARS">Pesos ($)</option>
                          <option value="USD">Dólares (US$)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Breve descripción de esta variante</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.description}
                          placeholder="Ej: Alojamiento 4 estrellas con excursiones principales"
                          onChange={(e) => handleCircuitChange(index, 'description', e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Precio por Persona</Form.Label>
                        <Form.Control
                          type="number"
                          value={circuit.price}
                          placeholder="Ej: 5890"
                          onChange={(e) => handleCircuitChange(index, 'price', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">¿Qué Incluye? (separado por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.includes}
                          onChange={(e) => handleCircuitChange(index, 'includes', e.target.value)}
                          placeholder="Pasaje aéreo, Equipaje, Guía..."
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-1">
                        <Form.Label className="small fw-bold">¿Qué NO incluye? (separado por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.excludes}
                          onChange={(e) => handleCircuitChange(index, 'excludes', e.target.value)}
                          placeholder="Propinas, comidas no especificadas..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}

            <Col md={12}>
              <Button
                variant="outline-dark"
                className="mb-4 w-100"
                onClick={addCircuit}
              >
                + Agregar otra opción / circuito de servicio
              </Button>
            </Col>

            {/* DESTACADO */}
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  name="featured"
                  id="featuredCheckbox"
                  checked={formData.featured}
                  onChange={handleChange}
                  label="Destacar este paquete en la Home"
                  className="fw-semibold"
                />
              </Form.Group>
            </Col>

            {/* BOTÓN FINAL */}
            <Col md={12}>
              <Button
                type="submit"
                variant="dark"
                className="w-100 py-3 rounded-3 fw-bold uppercase"
              >
                Guardar y Publicar Paquete
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  )
}

export default AdminCreatePackage