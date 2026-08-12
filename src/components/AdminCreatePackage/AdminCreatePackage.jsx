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
import api from '../../services/api'

const AdminCreatePackage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    operatorCode: '',
    origin: '',
    destination: '',
    category: '',
    secondaryCategories: '', // 👈 Estado para categorías secundarias (texto separado por comas)
    description: '',
    days: '',
    nights: '',
    currency: 'ARS',
    acceptedCurrencies: ['ARS'],
    featured: false,
    transportType: 'bus',
    transportCategory: '',
    images: ['', '', '', '', ''],
    circuits: [
      {
        title: '',
        description: '',
        includes: '',
        excludes: '',
        options: [{ name: 'Desayuno' }],
        hotels: [
          {
            name: '',
            image: '',
            city: '',
            stars: 3,
            departures: [
              {
                date: '',
                prices: [{ option: 'Desayuno', amounts: { ars: '', usd: '' } }]
              }
            ]
          }
        ]
      }
    ]
  })

  // Manejo de cambios generales y checkboxes de Monedas
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === 'acceptedCurrencies') {
      const currencyValue = value
      let updatedCurrencies = [...formData.acceptedCurrencies]

      if (checked) {
        if (!updatedCurrencies.includes(currencyValue)) {
          updatedCurrencies.push(currencyValue)
        }
      } else {
        if (updatedCurrencies.length > 1) {
          updatedCurrencies = updatedCurrencies.filter((c) => c !== currencyValue)
        }
      }

      setFormData((prev) => ({
        ...prev,
        acceptedCurrencies: updatedCurrencies,
        currency: updatedCurrencies[0] || 'ARS'
      }))
      return
    }

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      }

      if (name === 'transportType') {
        updatedData.transportCategory = ''
      }

      return updatedData
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
  const addCircuit = () => {
    setFormData((prev) => ({
      ...prev,
      circuits: [
        ...prev.circuits,
        {
          title: '',
          description: '',
          includes: '',
          excludes: '',
          options: [{ name: 'Desayuno' }],
          hotels: [
            {
              name: '',
              image: '',
              city: '',
              stars: 3,
              departures: [
                {
                  date: '',
                  prices: [{ option: 'Desayuno', amounts: { ars: '', usd: '' } }]
                }
              ]
            }
          ]
        }
      ]
    }))
  }

  const removeCircuit = (circuitIndex) => {
    if (formData.circuits.length === 1) return
    setFormData((prev) => ({
      ...prev,
      circuits: prev.circuits.filter((_, i) => i !== circuitIndex)
    }))
  }

  const handleCircuitChange = (circuitIndex, field, value) => {
    setFormData((prev) => {
      const newCircuits = [...prev.circuits]
      newCircuits[circuitIndex][field] = value
      return { ...prev, circuits: newCircuits }
    })
  }

  // --- MANEJO DE OPCIONES DE CIRCUITO ---
  const addOption = (circuitIndex) => {
    setFormData((prev) => {
      const newCircuits = prev.circuits.map((circuit, cIdx) => {
        if (cIdx !== circuitIndex) return circuit

        const newOptions = [...circuit.options, { name: '' }]

        const newHotels = circuit.hotels.map((hotel) => {
          const newDepartures = hotel.departures.map((dep) => ({
            ...dep,
            prices: [...dep.prices, { option: '', amounts: { ars: '', usd: '' } }]
          }))
          return { ...hotel, departures: newDepartures }
        })

        return {
          ...circuit,
          options: newOptions,
          hotels: newHotels
        }
      })

      return { ...prev, circuits: newCircuits }
    })
  }

  const removeOption = (circuitIndex, optionIndex) => {
    setFormData((prev) => {
      const newCircuits = prev.circuits.map((circuit, cIdx) => {
        if (cIdx !== circuitIndex) return circuit
        if (circuit.options.length === 1) return circuit

        const newOptions = circuit.options.filter((_, oIdx) => oIdx !== optionIndex)

        const newHotels = circuit.hotels.map((hotel) => {
          const newDepartures = hotel.departures.map((dep) => ({
            ...dep,
            prices: dep.prices.filter((_, pIdx) => pIdx !== optionIndex)
          }))
          return { ...hotel, departures: newDepartures }
        })

        return {
          ...circuit,
          options: newOptions,
          hotels: newHotels
        }
      })

      return { ...prev, circuits: newCircuits }
    })
  }

  const handleOptionNameChange = (circuitIndex, optionIndex, newName) => {
    setFormData((prev) => {
      const newCircuits = prev.circuits.map((circuit, cIdx) => {
        if (cIdx !== circuitIndex) return circuit

        const newOptions = circuit.options.map((opt, oIdx) =>
          oIdx === optionIndex ? { ...opt, name: newName } : opt
        )

        const newHotels = circuit.hotels.map((hotel) => {
          const newDepartures = hotel.departures.map((dep) => {
            const newPrices = dep.prices.map((p, pIdx) =>
              pIdx === optionIndex ? { ...p, option: newName } : p
            )
            return { ...dep, prices: newPrices }
          })
          return { ...hotel, departures: newDepartures }
        })

        return {
          ...circuit,
          options: newOptions,
          hotels: newHotels
        }
      })

      return { ...prev, circuits: newCircuits }
    })
  }

  // --- MANEJO DE HOTELES ---
  const addHotel = (circuitIndex) => {
    setFormData((prev) => {
      const newCircuits = [...prev.circuits]
      const circuit = newCircuits[circuitIndex]

      const initialPrices = circuit.options.map((opt) => ({
        option: opt.name,
        amounts: { ars: '', usd: '' }
      }))

      circuit.hotels.push({
        name: '',
        image: '',
        city: '',
        stars: 3,
        departures: [
          {
            date: '',
            prices: [...initialPrices]
          }
        ]
      })

      return { ...prev, circuits: newCircuits }
    })
  }

  const removeHotel = (circuitIndex, hotelIndex) => {
    setFormData((prev) => {
      const newCircuits = [...prev.circuits]
      if (newCircuits[circuitIndex].hotels.length === 1) return prev
      newCircuits[circuitIndex].hotels = newCircuits[circuitIndex].hotels.filter(
        (_, i) => i !== hotelIndex
      )
      return { ...prev, circuits: newCircuits }
    })
  }

  const handleHotelChange = (circuitIndex, hotelIndex, field, value) => {
    setFormData((prev) => {
      const newCircuits = [...prev.circuits]
      newCircuits[circuitIndex].hotels[hotelIndex][field] = value
      return { ...prev, circuits: newCircuits }
    })
  }

  // --- MANEJO DE SALIDAS Y PRECIOS ---
  const addDeparture = (circuitIndex, hotelIndex) => {
    setFormData((prev) => {
      const newCircuits = [...prev.circuits]
      const circuit = newCircuits[circuitIndex]
      const hotel = circuit.hotels[hotelIndex]

      const initialPrices = circuit.options.map((opt) => ({
        option: opt.name,
        amounts: { ars: '', usd: '' }
      }))

      hotel.departures.push({
        date: '',
        prices: initialPrices
      })

      return { ...prev, circuits: newCircuits }
    })
  }

  const removeDeparture = (circuitIndex, hotelIndex, depIndex) => {
    setFormData((prev) => {
      const newCircuits = [...prev.circuits]
      const hotel = newCircuits[circuitIndex].hotels[hotelIndex]
      if (hotel.departures.length === 1) return prev
      hotel.departures = hotel.departures.filter((_, i) => i !== depIndex)
      return { ...prev, circuits: newCircuits }
    })
  }

  const handleDepartureDateChange = (circuitIndex, hotelIndex, depIndex, dateValue) => {
    setFormData((prev) => {
      const newCircuits = [...prev.circuits]
      newCircuits[circuitIndex].hotels[hotelIndex].departures[depIndex].date = dateValue
      return { ...prev, circuits: newCircuits }
    })
  }

  const handleAmountChange = (circuitIndex, hotelIndex, depIndex, priceIndex, curr, val) => {
    setFormData((prev) => {
      const newCircuits = [...prev.circuits]
      const priceObj = newCircuits[circuitIndex].hotels[hotelIndex].departures[depIndex].prices[priceIndex]

      if (!priceObj.amounts) {
        priceObj.amounts = { ars: '', usd: '' }
      }

      priceObj.amounts[curr] = val
      return { ...prev, circuits: newCircuits }
    })
  }

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault()

    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    // Formatear categorías secundarias en un Array de strings
    const secondaryCategoriesArray = formData.secondaryCategories
      ? formData.secondaryCategories
          .split(',')
          .map((cat) => cat.trim())
          .filter(Boolean)
      : []

    const cleanedCircuits = formData.circuits.map((circuit) => {
      const cleanedIncludes = circuit.includes
        ? circuit.includes.split(',').map((item) => item.trim()).filter(Boolean)
        : []

      const cleanedExcludes = circuit.excludes
        ? circuit.excludes.split(',').map((item) => item.trim()).filter(Boolean)
        : []

      const cleanedOptions = circuit.options
        .map((opt) => ({ name: opt.name.trim() }))
        .filter((opt) => opt.name !== '')

      const cleanedHotels = circuit.hotels
        .map((hotel) => {
          const cleanedDepartures = hotel.departures
            .filter((dep) => dep.date !== '')
            .map((dep) => {
              const cleanedPrices = dep.prices
                .filter((p) => p.option && p.option.trim() !== '')
                .map((p) => {
                  const arsNum = Number(p.amounts?.ars)
                  const usdNum = Number(p.amounts?.usd)
                  
                  return {
                    option: p.option.trim(),
                    amount: !isNaN(arsNum) && arsNum > 0 ? arsNum : undefined,
                    amountUsd: !isNaN(usdNum) && usdNum > 0 ? usdNum : undefined,
                    amounts: {
                      ars: !isNaN(arsNum) && arsNum > 0 ? arsNum : undefined,
                      usd: !isNaN(usdNum) && usdNum > 0 ? usdNum : undefined
                    }
                  }
                })

              return {
                date: dep.date,
                prices: cleanedPrices
              }
            })

          return {
            name: hotel.name.trim(),
            image: hotel.image.trim(),
            city: hotel.city.trim(),
            stars: Number(hotel.stars),
            departures: cleanedDepartures
          }
        })
        .filter((h) => h.name !== '')

      return {
        title: circuit.title.trim(),
        description: circuit.description.trim(),
        includes: cleanedIncludes,
        excludes: cleanedExcludes,
        options: cleanedOptions,
        hotels: cleanedHotels
      }
    })

    const payload = {
      title: formData.title.trim(),
      slug,
      operatorCode: formData.operatorCode.trim(),
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      category: formData.category.trim(),
      secondaryCategories: secondaryCategoriesArray, // 👈 Se envía como Array
      description: formData.description.trim(),
      days: Number(formData.days),
      nights: Number(formData.nights),
      currency: formData.acceptedCurrencies[0] || 'ARS',
      acceptedCurrencies: formData.acceptedCurrencies,
      featured: formData.featured,
      transport: {
        mode: formData.transportType,
        category: formData.transportCategory.trim().toLowerCase()
      },
      images: formData.images
        .map((url) => url.trim())
        .filter((url) => url !== ''),
      circuits: cleanedCircuits
    }

    try {
      await api.post('/packages', payload)
      navigate('/admin/packages')
    } catch (error) {
      console.error(error)
      alert('Error al crear el paquete. Verificá los campos ingresados.')
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

            {/* CATEGORIA PRINCIPAL */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Categoría Principal</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Ej: Miniturismo, Nacionales, Internacional..."
                  required
                />
              </Form.Group>
            </Col>

            {/* CATEGORIAS SECUNDARIAS */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Categorías Secundarias (separadas por comas)</Form.Label>
                <Form.Control
                  type="text"
                  name="secondaryCategories"
                  value={formData.secondaryCategories}
                  onChange={handleChange}
                  placeholder="Ej: Paquetes en bus, Finde largo, Vacaciones de verano"
                />
              </Form.Group>
            </Col>

            {/* ORIGEN */}
            <Col md={6}>
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
            <Col md={6}>
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
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Días</Form.Label>
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
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Noches</Form.Label>
                <Form.Control
                  type="number"
                  name="nights"
                  value={formData.nights}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* MONEDAS ACEPTADAS */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold d-block">Monedas Aceptadas</Form.Label>
                <div className="d-flex gap-3 pt-1">
                  <Form.Check
                    type="checkbox"
                    id="create-curr-ars"
                    label="Pesos (ARS)"
                    value="ARS"
                    name="acceptedCurrencies"
                    checked={formData.acceptedCurrencies.includes('ARS')}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="checkbox"
                    id="create-curr-usd"
                    label="Dólares (USD)"
                    value="USD"
                    name="acceptedCurrencies"
                    checked={formData.acceptedCurrencies.includes('USD')}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>

            {/* TRANSPORTE */}
            <Col md={2}>
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
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Tipo/Clase</Form.Label>
                <Form.Select
                  name="transportCategory"
                  value={formData.transportCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {formData.transportType === 'bus' && (
                    <>
                      <option value="semi-cama">Semi-Cama</option>
                      <option value="cama">Cama</option>
                      <option value="semi-cama/cama">Semi-Cama / Cama</option>
                    </>
                  )}
                  {formData.transportType === 'plane' && (
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

            {/* URLs DE IMÁGENES */}
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

            {/* CIRCUITOS Y TARIFAS */}
            <Col md={12} className="mt-2">
              <h4 className="fw-bold mb-3">Circuitos y Opciones</h4>
            </Col>

            {formData.circuits.map((circuit, circuitIndex) => (
              <Col md={12} key={circuitIndex}>
                <Card className="p-4 mb-4 border position-relative shadow-sm rounded-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0 text-secondary">
                      Circuito #{circuitIndex + 1}
                    </h5>
                    {formData.circuits.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeCircuit(circuitIndex)}
                      >
                        Eliminar Circuito
                      </Button>
                    )}
                  </div>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Nombre del Circuito</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.title}
                          placeholder="Ej: Clásico, Premium, etc."
                          onChange={(e) => handleCircuitChange(circuitIndex, 'title', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Descripción del Circuito</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.description}
                          placeholder="Ej: Recorrido completo por la costa norte"
                          onChange={(e) => handleCircuitChange(circuitIndex, 'description', e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">¿Qué Incluye? (separado por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.includes}
                          onChange={(e) => handleCircuitChange(circuitIndex, 'includes', e.target.value)}
                          placeholder="Pasaje aéreo, Equipaje, Guía..."
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">¿Qué NO incluye? (separado por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.excludes}
                          onChange={(e) => handleCircuitChange(circuitIndex, 'excludes', e.target.value)}
                          placeholder="Propinas, comidas no especificadas..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr className="my-3 text-muted" />

                  {/* OPCIONES DE RÉGIMEN / SERVICIO */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold m-0 text-dark">Opciones del Circuito</h6>
                      <Button
                        type="button"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => addOption(circuitIndex)}
                      >
                        + Agregar Opción
                      </Button>
                    </div>

                    <Card className="p-3 bg-light border-0 rounded-3 mb-3">
                      {circuit.options.map((option, optionIndex) => (
                        <Row key={optionIndex} className="align-items-center mb-2">
                          <Col md={10}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                value={option.name}
                                placeholder="Ej: Desayuno, Media Pensión, All Inclusive"
                                onChange={(e) => handleOptionNameChange(circuitIndex, optionIndex, e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={2} className="text-end">
                            <Button
                              type="button"
                              variant="outline-danger"
                              size="sm"
                              className="w-100"
                              onClick={() => removeOption(circuitIndex, optionIndex)}
                              disabled={circuit.options.length === 1}
                            >
                              <FaTrash /> Eliminar
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    </Card>
                  </div>

                  <hr className="my-3 text-muted" />

                  {/* HOTELES */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold m-0 text-dark">Hoteles del Circuito</h6>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => addHotel(circuitIndex)}
                      >
                        + Agregar Hotel
                      </Button>
                    </div>

                    {circuit.hotels.map((hotel, hotelIndex) => (
                      <Card key={hotelIndex} className="p-3 mb-3 bg-light border border-secondary-subtle rounded-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-dark small">Hotel #{hotelIndex + 1}</span>
                          {circuit.hotels.length > 1 && (
                            <Button
                              type="button"
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeHotel(circuitIndex, hotelIndex)}
                            >
                              Eliminar Hotel
                            </Button>
                          )}
                        </div>

                        <Row className="g-2 mb-3">
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary mb-1">Nombre del Hotel</Form.Label>
                              <Form.Control
                                type="text"
                                value={hotel.name}
                                placeholder="Ej: Hotel Gran Palace"
                                onChange={(e) => handleHotelChange(circuitIndex, hotelIndex, 'name', e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>

                          <Col md={3}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary mb-1">Ciudad</Form.Label>
                              <Form.Control
                                type="text"
                                value={hotel.city}
                                placeholder="Ej: Tokio"
                                onChange={(e) => handleHotelChange(circuitIndex, hotelIndex, 'city', e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>

                          <Col md={2}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary mb-1">Estrellas</Form.Label>
                              <Form.Select
                                value={hotel.stars}
                                onChange={(e) => handleHotelChange(circuitIndex, hotelIndex, 'stars', e.target.value)}
                              >
                                <option value={1}>1 ★</option>
                                <option value={2}>2 ★★</option>
                                <option value={3}>3 ★★★</option>
                                <option value={4}>4 ★★★★</option>
                                <option value={5}>5 ★★★★★</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>

                          <Col md={3}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary mb-1">Imagen del Hotel (URL)</Form.Label>
                              <Form.Control
                                type="text"
                                value={hotel.image}
                                placeholder="https://ejemplo.com/hotel.jpg"
                                onChange={(e) => handleHotelChange(circuitIndex, hotelIndex, 'image', e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* SALIDAS Y PRECIOS POR MONEDA */}
                        <div className="mt-2 bg-white p-3 rounded-2 border">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold small text-primary d-flex align-items-center gap-1">
                              <FaCalendarPlus /> Salidas del Hotel
                            </span>
                            <Button
                              type="button"
                              variant="outline-primary"
                              size="sm"
                              onClick={() => addDeparture(circuitIndex, hotelIndex)}
                            >
                              + Agregar Salida
                            </Button>
                          </div>

                          {hotel.departures.map((dep, depIndex) => (
                            <div key={depIndex} className="p-3 mb-2 bg-light rounded border">
                              <Row className="g-2 align-items-start">
                                <Col md={3}>
                                  <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary mb-1">Fecha de Salida</Form.Label>
                                    <Form.Control
                                      type="date"
                                      value={dep.date}
                                      onChange={(e) => handleDepartureDateChange(circuitIndex, hotelIndex, depIndex, e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>

                                <Col md={8}>
                                  <Form.Label className="small fw-bold text-secondary mb-1 d-block">
                                    Precios por Opción
                                  </Form.Label>
                                  
                                  <div className="d-flex flex-wrap gap-2">
                                    {circuit.options.map((opt, optIdx) => {
                                      const priceObj = dep.prices[optIdx] || { amounts: { ars: '', usd: '' } }
                                      const amounts = priceObj.amounts || { ars: '', usd: '' }

                                      return (
                                        <Card key={optIdx} className="p-2 border rounded bg-white flex-fill">
                                          <div className="small fw-semibold text-dark mb-1">
                                            {opt.name || `Opción ${optIdx + 1}`}
                                          </div>
                                          
                                          <div className="d-flex gap-2">
                                            {formData.acceptedCurrencies.includes('ARS') && (
                                              <div className="w-100">
                                                <Form.Label className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                  Monto ARS ($)
                                                </Form.Label>
                                                <Form.Control
                                                  type="number"
                                                  size="sm"
                                                  placeholder="0"
                                                  value={amounts.ars || ''}
                                                  onChange={(e) => handleAmountChange(circuitIndex, hotelIndex, depIndex, optIdx, 'ars', e.target.value)}
                                                />
                                              </div>
                                            )}

                                            {formData.acceptedCurrencies.includes('USD') && (
                                              <div className="w-100">
                                                <Form.Label className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                  Monto USD (US$)
                                                </Form.Label>
                                                <Form.Control
                                                  type="number"
                                                  size="sm"
                                                  placeholder="0"
                                                  value={amounts.usd || ''}
                                                  onChange={(e) => handleAmountChange(circuitIndex, hotelIndex, depIndex, optIdx, 'usd', e.target.value)}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        </Card>
                                      )
                                    })}
                                  </div>
                                </Col>

                                <Col md={1} className="text-end">
                                  <Button
                                    type="button"
                                    variant="outline-danger"
                                    size="sm"
                                    className="mt-4 w-100"
                                    onClick={() => removeDeparture(circuitIndex, hotelIndex, depIndex)}
                                    disabled={hotel.departures.length === 1}
                                  >
                                    <FaTrash />
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}

            <Col md={12}>
              <Button
                type="button"
                variant="outline-dark"
                className="mb-4 w-100"
                onClick={addCircuit}
              >
                + Agregar otro circuito
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
                  label="Marcar este paquete como Destacado"
                  className="fw-semibold"
                />
              </Form.Group>
            </Col>

            {/* BOTÓN SUBMIT */}
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