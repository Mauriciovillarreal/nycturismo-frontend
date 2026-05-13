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

import api from '../services/api'

const AdminCreatePackage = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({

    title: '',

    origin: '',

    destination: '',

    category: '',

    description: '',

    price: '',

    duration: '',

    includes: '',

    notIncludes: '',

    images: '',

    featured: false,

    availableDates: ''

  })

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target

    setFormData({

      ...formData,

      [name]:
        type === 'checkbox'
          ? checked
          : value

    })
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

      origin: formData.origin,

      destination: formData.destination,

      category: formData.category,

      description: formData.description,

      price: Number(formData.price),

      duration: Number(formData.duration),

      featured: formData.featured,

      includes: formData.includes
        ? formData.includes
            .split(',')
            .map(item => item.trim())
        : [],

      excludes: formData.notIncludes
        ? formData.notIncludes
            .split(',')
            .map(item => item.trim())
        : [],

      images: formData.images
        ? formData.images
            .split(',')
            .map(item => item.trim())
        : [],

      availableDates: formData.availableDates
        ? formData.availableDates
            .split(',')
            .map(item => item.trim())
        : []

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

        <h2 className="mb-4 fw-bold">
          Crear Nuevo Paquete
        </h2>

        <Form onSubmit={handleSubmit}>

          <Row>

            {/* TITULO */}
            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Título
                </Form.Label>

                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </Form.Group>

            </Col>

            {/* CATEGORIA */}
            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Categoría
                </Form.Label>

                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Seleccionar categoría
                  </option>

                  <option value="Miniturismo">
                    Miniturismo
                  </option>

                  <option value="Nacionales">
                    Nacionales
                  </option>

                  <option value="Internacionales">
                    Internacionales
                  </option>

                  <option value="Europa">
                    Europa
                  </option>

                  <option value="Playa">
                    Playa
                  </option>

                </Form.Select>

              </Form.Group>

            </Col>

            {/* ORIGEN */}
            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Origen
                </Form.Label>

                <Form.Control
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                />

              </Form.Group>

            </Col>

            {/* DESTINO */}
            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Destino
                </Form.Label>

                <Form.Control
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />

              </Form.Group>

            </Col>

            {/* PRECIO */}
            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Precio
                </Form.Label>

                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

              </Form.Group>

            </Col>

            {/* DURACION */}
            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Duración (noches)
                </Form.Label>

                <Form.Control
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />

              </Form.Group>

            </Col>

            {/* DESCRIPCION */}
            <Col md={12}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Descripción
                </Form.Label>

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

            {/* INCLUYE */}
            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Incluye
                </Form.Label>

                <Form.Control
                  type="text"
                  name="includes"
                  value={formData.includes}
                  onChange={handleChange}
                  placeholder="Hotel, desayuno, excursiones..."
                />

              </Form.Group>

            </Col>

            {/* NO INCLUYE */}
            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  No incluye
                </Form.Label>

                <Form.Control
                  type="text"
                  name="notIncludes"
                  value={formData.notIncludes}
                  onChange={handleChange}
                  placeholder="Propinas, comidas..."
                />

              </Form.Group>

            </Col>

            {/* IMAGENES */}
            <Col md={12}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Imágenes
                </Form.Label>

                <Form.Control
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  placeholder="https://imagen1.jpg, https://imagen2.jpg"
                />

              </Form.Group>

            </Col>

            {/* FECHAS */}
            <Col md={12}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Fechas disponibles
                </Form.Label>

                <Form.Control
                  type="text"
                  name="availableDates"
                  value={formData.availableDates}
                  onChange={handleChange}
                  placeholder="2026-07-10, 2026-07-25"
                />

              </Form.Group>

            </Col>

            {/* DESTACADO */}
            <Col md={12}>

              <Form.Group className="mb-4">

                <Form.Check
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  label="Paquete destacado"
                />

              </Form.Group>

            </Col>

            {/* BOTON */}
            <Col md={12}>

              <Button
                type="submit"
                variant="dark"
                className="w-100 py-3 rounded-3 fw-bold"
              >
                Crear paquete
              </Button>

            </Col>

          </Row>

        </Form>

      </Card>

    </Container>
  )
}

export default AdminCreatePackage