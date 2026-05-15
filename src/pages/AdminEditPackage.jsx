import React, { useState, useEffect } from 'react'

import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card
} from 'react-bootstrap'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import api from '../services/api'

const AdminEditPackage = () => {

  const { id } = useParams()

  const navigate = useNavigate()

  const [formData, setFormData] = useState({

    title: '',

    origin: '',

    destination: '',

    category: '',

    description: '',

    days: '',

    nights: '',

    featured: false,

    transportType: 'bus',

    transportCategory: '',

    images: '',

    availableDates: '',

    circuits: []

  })

  useEffect(() => {
    fetchPackage()
  }, [id])

  const fetchPackage = async () => {

    try {

      const res = await api.get(`/packages/id/${id}`)

      const pkg = res.data

      setFormData({

        title: pkg.title || '',

        origin: pkg.origin || '',

        destination: pkg.destination || '',

        category: pkg.category || '',

        description: pkg.description || '',

        days: pkg.days || '',

        nights: pkg.nights || '',

        featured: pkg.featured || false,

        transportType:
          pkg.transport?.type || 'bus',

        transportCategory:
          pkg.transport?.category || '',

        images:
          pkg.images?.join(', ') || '',

        availableDates:
          pkg.availableDates
            ?.map(date =>
              new Date(date)
                .toISOString()
                .split('T')[0]
            )
            .join(', ') || '',

        circuits:
          pkg.circuits?.map(circuit => ({

            title: circuit.title || '',

            description:
              circuit.description || '',

            includes:
              circuit.includes?.join(', ') || '',

            excludes:
              circuit.excludes?.join(', ') || '',

            price: circuit.price || '',

            currency:
              circuit.currency || 'ARS'

          })) || []

      })

    } catch (error) {

      console.error(error)

    }
  }

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

  const handleCircuitChange = (
    index,
    field,
    value
  ) => {

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

    const updatedCircuits =
      formData.circuits.filter(
        (_, i) => i !== index
      )

    setFormData({

      ...formData,

      circuits: updatedCircuits

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

      days: Number(formData.days),

      nights: Number(formData.nights),

      featured: formData.featured,

      transport: {

        type: formData.transportType,

        category: formData.transportCategory

      },

      images: formData.images
        ? formData.images
            .split(',')
            .map(item => item.trim())
        : [],

      availableDates: formData.availableDates
        ? formData.availableDates
            .split(',')
            .map(item => item.trim())
        : [],

      circuits: formData.circuits.map(circuit => ({

        title: circuit.title,

        description: circuit.description,

        includes: circuit.includes
          ? circuit.includes
              .split(',')
              .map(item => item.trim())
          : [],

        excludes: circuit.excludes
          ? circuit.excludes
              .split(',')
              .map(item => item.trim())
          : [],

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

        <h2 className="fw-bold mb-4">
          Editar paquete
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
                >

                  <option value="">
                    Seleccionar
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
                />

              </Form.Group>

            </Col>

            {/* DIAS */}

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Días
                </Form.Label>

                <Form.Control
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                />

              </Form.Group>

            </Col>

            {/* NOCHES */}

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Noches
                </Form.Label>

                <Form.Control
                  type="number"
                  name="nights"
                  value={formData.nights}
                  onChange={handleChange}
                />

              </Form.Group>

            </Col>

            {/* TRANSPORTE */}

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Transporte
                </Form.Label>

                <Form.Select
                  name="transportType"
                  value={formData.transportType}
                  onChange={handleChange}
                >

                  <option value="bus">
                    Bus
                  </option>

                  <option value="plane">
                    Avión
                  </option>

                </Form.Select>

              </Form.Group>

            </Col>

            {/* TIPO */}

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Tipo
                </Form.Label>

                <Form.Control
                  type="text"
                  name="transportCategory"
                  value={formData.transportCategory}
                  onChange={handleChange}
                  placeholder="semi-cama / economy"
                />

              </Form.Group>

            </Col>

            {/* DESCRIPCION */}

            <Col md={12}>

              <Form.Group className="mb-4">

                <Form.Label>
                  Descripción
                </Form.Label>

                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />

              </Form.Group>

            </Col>

            {/* IMAGENES */}

            <Col md={12}>

              <Form.Group className="mb-4">

                <Form.Label>
                  Imágenes
                </Form.Label>

                <Form.Control
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                />

              </Form.Group>

            </Col>

            {/* FECHAS */}

            <Col md={12}>

              <Form.Group className="mb-4">

                <Form.Label>
                  Fechas disponibles
                </Form.Label>

                <Form.Control
                  type="text"
                  name="availableDates"
                  value={formData.availableDates}
                  onChange={handleChange}
                />

              </Form.Group>

            </Col>

            {/* CIRCUITOS */}

            <Col md={12}>

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h4 className="fw-bold mb-0">
                  Circuitos
                </h4>

                <Button
                  variant="dark"
                  onClick={addCircuit}
                >
                  Agregar circuito
                </Button>

              </div>

            </Col>

            {formData.circuits.map((circuit, index) => (

              <Col md={12} key={index}>

                <Card className="p-4 mb-4">

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="fw-bold mb-0">
                      Circuito {index + 1}
                    </h5>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeCircuit(index)}
                    >
                      Eliminar
                    </Button>

                  </div>

                  <Row>

                    <Col md={6}>

                      <Form.Group className="mb-3">

                        <Form.Label>
                          Título
                        </Form.Label>

                        <Form.Control
                          type="text"
                          value={circuit.title}
                          onChange={(e) =>
                            handleCircuitChange(
                              index,
                              'title',
                              e.target.value
                            )
                          }
                        />

                      </Form.Group>

                    </Col>

                    <Col md={6}>

                      <Form.Group className="mb-3">

                        <Form.Label>
                          Moneda
                        </Form.Label>

                        <Form.Select
                          value={circuit.currency}
                          onChange={(e) =>
                            handleCircuitChange(
                              index,
                              'currency',
                              e.target.value
                            )
                          }
                        >

                          <option value="ARS">
                            Pesos
                          </option>

                          <option value="USD">
                            USD
                          </option>

                        </Form.Select>

                      </Form.Group>

                    </Col>

                    <Col md={12}>

                      <Form.Group className="mb-3">

                        <Form.Label>
                          Descripción
                        </Form.Label>

                        <Form.Control
                          type="text"
                          value={circuit.description}
                          onChange={(e) =>
                            handleCircuitChange(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                        />

                      </Form.Group>

                    </Col>

                    <Col md={6}>

                      <Form.Group className="mb-3">

                        <Form.Label>
                          Precio
                        </Form.Label>

                        <Form.Control
                          type="number"
                          value={circuit.price}
                          onChange={(e) =>
                            handleCircuitChange(
                              index,
                              'price',
                              e.target.value
                            )
                          }
                        />

                      </Form.Group>

                    </Col>

                    <Col md={6}>

                      <Form.Group className="mb-3">

                        <Form.Label>
                          Incluye
                        </Form.Label>

                        <Form.Control
                          type="text"
                          value={circuit.includes}
                          onChange={(e) =>
                            handleCircuitChange(
                              index,
                              'includes',
                              e.target.value
                            )
                          }
                        />

                      </Form.Group>

                    </Col>

                    <Col md={12}>

                      <Form.Group>

                        <Form.Label>
                          No incluye
                        </Form.Label>

                        <Form.Control
                          type="text"
                          value={circuit.excludes}
                          onChange={(e) =>
                            handleCircuitChange(
                              index,
                              'excludes',
                              e.target.value
                            )
                          }
                        />

                      </Form.Group>

                    </Col>

                  </Row>

                </Card>

              </Col>

            ))}

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
                Guardar cambios
              </Button>

            </Col>

          </Row>

        </Form>

      </Card>

    </Container>

  )
}

export default AdminEditPackage