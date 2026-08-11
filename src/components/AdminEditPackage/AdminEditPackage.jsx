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
import api from '../../services/api'

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
    acceptedCurrencies: ['ARS'],
    featured: false,
    transportType: 'bus',
    transportCategory: '',
    images: ['', '', '', '', ''],
    circuits: []
  })

  useEffect(() => {
    fetchPackage()
  }, [id])

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/id/${id}`)
      const pkg = res.data

      const rawMode = pkg.transport?.mode || pkg.transport?.type || 'bus'
      let normalizedMode = 'bus'
      if (typeof rawMode === 'string' && (rawMode.toLowerCase() === 'avion' || rawMode.toLowerCase() === 'avión' || rawMode.toLowerCase() === 'plane')) {
        normalizedMode = 'plane'
      }

      // Monedas aceptadas (Soporte multimoneda + fallback al campo previo pkg.currency)
      let initialCurrencies = pkg.acceptedCurrencies || []
      if (initialCurrencies.length === 0 && pkg.currency) {
        initialCurrencies = [pkg.currency]
      }
      if (initialCurrencies.length === 0) {
        initialCurrencies = ['ARS']
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
        acceptedCurrencies: initialCurrencies,
        featured: pkg.featured || false,
        transportType: normalizedMode,
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

        circuits: pkg.circuits?.map(circuit => {
          const options = circuit.options?.map(opt => ({
            name: typeof opt === 'string' ? opt : (opt.name || '')
          })) || []

          const hotels = circuit.hotels?.map(hotel => ({
            name: hotel.name || '',
            image: hotel.image || '',
            city: hotel.city || '',
            stars: hotel.stars || '',
            departures: hotel.departures?.map(dep => {
              const dateFormatted = dep.date ? new Date(dep.date).toISOString().split('T')[0] : ''
              
              const prices = options.map(opt => {
                const foundPrice = dep.prices?.find(p => p.option === opt.name)
                return {
                  option: opt.name,
                  amounts: {
                    ars: foundPrice?.amounts?.ars ?? (foundPrice?.amount ?? ''),
                    usd: foundPrice?.amounts?.usd ?? ''
                  }
                }
              })

              return {
                date: dateFormatted,
                prices
              }
            }) || []
          })) || []

          return {
            title: circuit.title || '',
            description: circuit.description || '',
            includes: circuit.includes?.join(', ') || '',
            excludes: circuit.excludes?.join(', ') || '',
            options,
            hotels
          }
        }) || []
      })
    } catch (error) {
      console.error(error)
      alert('Error al cargar los datos del paquete')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
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

  // --- HANDLER DE MONEDAS ACEPTADAS ---
  const handleCurrencyToggle = (curr) => {
    const current = [...formData.acceptedCurrencies]
    let updated = []
    if (current.includes(curr)) {
      if (current.length === 1) return // Requiere al menos una moneda
      updated = current.filter(c => c !== curr)
    } else {
      updated = [...current, curr]
    }
    setFormData({ ...formData, acceptedCurrencies: updated })
  }

  // --- MANEJO DE IMÁGENES ---
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = value
    setFormData({ ...formData, images: updatedImages })
  }

  // --- HANDLERS DE CIRCUITOS ---
  const handleCircuitChange = (circuitIndex, field, value) => {
    const updatedCircuits = [...formData.circuits]
    updatedCircuits[circuitIndex][field] = value
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
          options: [],
          hotels: []
        }
      ]
    })
  }

  const removeCircuit = (circuitIndex) => {
    const updatedCircuits = formData.circuits.filter((_, i) => i !== circuitIndex)
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  // --- HANDLERS DE OPCIONES (CON SINCRONIZACIÓN DE PRECIOS) ---
  const handleOptionChange = (circuitIndex, optionIndex, value) => {
    const updatedCircuits = [...formData.circuits]
    const oldName = updatedCircuits[circuitIndex].options[optionIndex].name
    updatedCircuits[circuitIndex].options[optionIndex].name = value

    updatedCircuits[circuitIndex].hotels.forEach(hotel => {
      hotel.departures.forEach(dep => {
        dep.prices.forEach(priceObj => {
          if (priceObj.option === oldName) {
            priceObj.option = value
          }
        })
      })
    })

    setFormData({ ...formData, circuits: updatedCircuits })
  }

  const addOption = (circuitIndex) => {
    const updatedCircuits = [...formData.circuits]
    const newOption = { name: '' }
    updatedCircuits[circuitIndex].options.push(newOption)

    updatedCircuits[circuitIndex].hotels.forEach(hotel => {
      hotel.departures.forEach(dep => {
        dep.prices.push({
          option: '',
          amounts: { ars: '', usd: '' }
        })
      })
    })

    setFormData({ ...formData, circuits: updatedCircuits })
  }

  const removeOption = (circuitIndex, optionIndex) => {
    const updatedCircuits = [...formData.circuits]
    updatedCircuits[circuitIndex].options.splice(optionIndex, 1)

    updatedCircuits[circuitIndex].hotels.forEach(hotel => {
      hotel.departures.forEach(dep => {
        dep.prices = dep.prices.filter((_, pIdx) => pIdx !== optionIndex)
      })
    })

    setFormData({ ...formData, circuits: updatedCircuits })
  }

  // --- HANDLERS DE HOTELES ---
  const handleHotelChange = (circuitIndex, hotelIndex, field, value) => {
    const updatedCircuits = [...formData.circuits]
    updatedCircuits[circuitIndex].hotels[hotelIndex][field] = value
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  const addHotel = (circuitIndex) => {
    const updatedCircuits = [...formData.circuits]
    updatedCircuits[circuitIndex].hotels.push({
      name: '',
      image: '',
      city: '',
      stars: '',
      departures: []
    })
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  const removeHotel = (circuitIndex, hotelIndex) => {
    const updatedCircuits = [...formData.circuits]
    updatedCircuits[circuitIndex].hotels.splice(hotelIndex, 1)
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  // --- HANDLERS DE SALIDAS ---
  const handleDepartureChange = (circuitIndex, hotelIndex, departureIndex, field, value) => {
    const updatedCircuits = [...formData.circuits]
    updatedCircuits[circuitIndex].hotels[hotelIndex].departures[departureIndex][field] = value
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  const addDeparture = (circuitIndex, hotelIndex) => {
    const updatedCircuits = [...formData.circuits]
    const options = updatedCircuits[circuitIndex].options || []

    const initialPrices = options.map(opt => ({
      option: opt.name,
      amounts: { ars: '', usd: '' }
    }))

    updatedCircuits[circuitIndex].hotels[hotelIndex].departures.push({
      date: '',
      prices: initialPrices
    })

    setFormData({ ...formData, circuits: updatedCircuits })
  }

  const removeDeparture = (circuitIndex, hotelIndex, departureIndex) => {
    const updatedCircuits = [...formData.circuits]
    updatedCircuits[circuitIndex].hotels[hotelIndex].departures.splice(departureIndex, 1)
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  // --- HANDLER DE PRECIOS MULTI-MONEDA ---
  const handlePriceChange = (circuitIndex, hotelIndex, departureIndex, priceIndex, curr, value) => {
    const updatedCircuits = [...formData.circuits]
    const targetPrice = updatedCircuits[circuitIndex].hotels[hotelIndex].departures[departureIndex].prices[priceIndex]
    
    if (!targetPrice.amounts) {
      targetPrice.amounts = { ars: '', usd: '' }
    }
    
    targetPrice.amounts[curr] = value
    setFormData({ ...formData, circuits: updatedCircuits })
  }

  // --- SUBMIT ---
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
      acceptedCurrencies: formData.acceptedCurrencies,
      currency: formData.acceptedCurrencies[0] || 'ARS',
      featured: formData.featured,
      transport: {
        mode: formData.transportType,
        category: formData.transportCategory
      },
      images: formData.images.filter(image => image && image.trim() !== ''),

      circuits: formData.circuits.map(circuit => ({
        title: circuit.title,
        description: circuit.description,
        includes: circuit.includes ? circuit.includes.split(',').map(item => item.trim()).filter(Boolean) : [],
        excludes: circuit.excludes ? circuit.excludes.split(',').map(item => item.trim()).filter(Boolean) : [],
        options: circuit.options
          .filter(opt => opt.name && opt.name.trim() !== '')
          .map(opt => ({ name: opt.name.trim() })),
        hotels: circuit.hotels.map(hotel => ({
          name: hotel.name.trim(),
          image: hotel.image.trim(),
          city: hotel.city.trim(),
          stars: hotel.stars ? Number(hotel.stars) : 0,
          departures: hotel.departures
            .filter(dep => dep.date && dep.date.trim() !== '')
            .map(dep => ({
              date: new Date(dep.date),
              prices: dep.prices
                .filter(p => p.option && p.option.trim() !== '')
                .map(p => ({
                  option: p.option.trim(),
                  amounts: {
                    ars: p.amounts?.ars !== '' && p.amounts?.ars !== null ? Number(p.amounts.ars) : null,
                    usd: p.amounts?.usd !== '' && p.amounts?.usd !== null ? Number(p.amounts.usd) : null
                  }
                }))
            }))
        }))
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
            <Col md={4}>
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
            <Col md={4}>
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

            {/* Monedas Aceptadas */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Monedas Aceptadas</Form.Label>
                <div className="d-flex gap-3 pt-1">
                  <Form.Check
                    type="checkbox"
                    id="edit-curr-ars"
                    label="Pesos (ARS)"
                    checked={formData.acceptedCurrencies.includes('ARS')}
                    onChange={() => handleCurrencyToggle('ARS')}
                  />
                  <Form.Check
                    type="checkbox"
                    id="edit-curr-usd"
                    label="Dólares (USD)"
                    checked={formData.acceptedCurrencies.includes('USD')}
                    onChange={() => handleCurrencyToggle('USD')}
                  />
                </div>
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

            {/* Clase/Categoría de Transporte */}
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

            {/* SECCIÓN DE CIRCUITOS */}
            <Col md={12} className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0">Circuitos / Opciones de Tarifa</h4>
                <Button variant="dark" onClick={addCircuit}>
                  + Agregar circuito
                </Button>
              </div>
            </Col>

            {formData.circuits.map((circuit, cIndex) => (
              <Col md={12} key={cIndex}>
                <Card className="p-4 mb-4 border-secondary-subtle shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0 text-primary">Circuito {cIndex + 1}</h5>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeCircuit(cIndex)}
                    >
                      Eliminar Circuito
                    </Button>
                  </div>
                  <Row>
                    {/* Título del circuito */}
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Título del Circuito</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.title}
                          onChange={(e) => handleCircuitChange(cIndex, 'title', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Descripción corta */}
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Descripción corta</Form.Label>
                        <Form.Control
                          type="text"
                          value={circuit.description}
                          onChange={(e) => handleCircuitChange(cIndex, 'description', e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    {/* Incluye */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Incluye (separado por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Desayuno, Excursión, Coordinador..."
                          value={circuit.includes}
                          onChange={(e) => handleCircuitChange(cIndex, 'includes', e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    {/* No Incluye */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>No Incluye (separado por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Comidas en ruta, Entradas a parques..."
                          value={circuit.excludes}
                          onChange={(e) => handleCircuitChange(cIndex, 'excludes', e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    {/* SUBSECCIÓN: OPCIONES */}
                    <Col md={12} className="mt-3 mb-3">
                      <Card className="p-3 bg-light border">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="fw-bold mb-0">Opciones del Circuito</h6>
                          <Button variant="secondary" size="sm" onClick={() => addOption(cIndex)}>
                            + Agregar Opción
                          </Button>
                        </div>
                        {circuit.options.length === 0 ? (
                          <p className="text-muted small mb-0">No hay opciones agregadas a este circuito.</p>
                        ) : (
                          circuit.options.map((opt, oIndex) => (
                            <Row key={oIndex} className="g-2 mb-2 align-items-center">
                              <Col sm={10}>
                                <Form.Control
                                  type="text"
                                  placeholder="Ej: Desayuno, Media Pensión, All Inclusive"
                                  value={opt.name}
                                  onChange={(e) => handleOptionChange(cIndex, oIndex, e.target.value)}
                                  required
                                />
                              </Col>
                              <Col sm={2}>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="w-100"
                                  onClick={() => removeOption(cIndex, oIndex)}
                                >
                                  Eliminar
                                </Button>
                              </Col>
                            </Row>
                          ))
                        )}
                      </Card>
                    </Col>

                    {/* SUBSECCIÓN: HOTELES */}
                    <Col md={12} className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">Hoteles del Circuito</h6>
                        <Button variant="dark" size="sm" onClick={() => addHotel(cIndex)}>
                          + Agregar Hotel
                        </Button>
                      </div>

                      {circuit.hotels.length === 0 ? (
                        <p className="text-muted small">No hay hoteles cargados en este circuito.</p>
                      ) : (
                        circuit.hotels.map((hotel, hIndex) => (
                          <Card key={hIndex} className="p-3 mb-3 border border-secondary-subtle">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-bold text-secondary">Hotel {hIndex + 1}</span>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeHotel(cIndex, hIndex)}
                              >
                                Quitar Hotel
                              </Button>
                            </div>
                            <Row className="g-2 mb-3">
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Label className="small fw-semibold">Nombre</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Nombre del Hotel"
                                    value={hotel.name}
                                    onChange={(e) => handleHotelChange(cIndex, hIndex, 'name', e.target.value)}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Label className="small fw-semibold">Ciudad</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Ciudad"
                                    value={hotel.city}
                                    onChange={(e) => handleHotelChange(cIndex, hIndex, 'city', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group>
                                  <Form.Label className="small fw-semibold">Imagen (URL)</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="https://..."
                                    value={hotel.image}
                                    onChange={(e) => handleHotelChange(cIndex, hIndex, 'image', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group>
                                  <Form.Label className="small fw-semibold">Estrellas</Form.Label>
                                  <Form.Control
                                    type="number"
                                    placeholder="1-5"
                                    value={hotel.stars}
                                    onChange={(e) => handleHotelChange(cIndex, hIndex, 'stars', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            {/* SUB-SUBSECCIÓN: SALIDAS Y PRECIOS */}
                            <div className="bg-light p-3 rounded border">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-semibold small">Salidas del Hotel</span>
                                <Button
                                  variant="outline-dark"
                                  size="sm"
                                  onClick={() => addDeparture(cIndex, hIndex)}
                                >
                                  + Agregar Salida
                                </Button>
                              </div>

                              {hotel.departures.length === 0 ? (
                                <p className="text-muted small mb-0">No hay salidas registradas para este hotel.</p>
                              ) : (
                                hotel.departures.map((dep, dIndex) => (
                                  <Card key={dIndex} className="p-2 mb-2 bg-white border">
                                    <Row className="align-items-center g-2 mb-2">
                                      <Col sm={4}>
                                        <Form.Group>
                                          <Form.Label className="small fw-bold text-secondary mb-1">
                                            Fecha de Salida
                                          </Form.Label>
                                          <Form.Control
                                            type="date"
                                            value={dep.date}
                                            onChange={(e) => handleDepartureChange(cIndex, hIndex, dIndex, 'date', e.target.value)}
                                            required
                                          />
                                        </Form.Group>
                                      </Col>
                                      <Col sm={8} className="text-end">
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => removeDeparture(cIndex, hIndex, dIndex)}
                                        >
                                          Eliminar Salida
                                        </Button>
                                      </Col>
                                    </Row>

                                    {/* PRECIOS MULTI-MONEDA POR OPCIÓN */}
                                    <div className="border-top pt-2 mt-2">
                                      <Form.Label className="small fw-semibold text-dark mb-2">
                                        Precios por Opción
                                      </Form.Label>
                                      {circuit.options.length === 0 ? (
                                        <p className="text-muted small italic mb-0">
                                          Agregue opciones al circuito para cargar precios en esta salida.
                                        </p>
                                      ) : (
                                        <Row className="g-3">
                                          {dep.prices.map((priceObj, pIndex) => (
                                            <Col md={6} key={pIndex}>
                                              <div className="p-2 border rounded bg-light">
                                                <span className="d-block small fw-bold text-secondary mb-1">
                                                  {priceObj.option || `Opción ${pIndex + 1}`}
                                                </span>
                                                <Row className="g-1">
                                                  {formData.acceptedCurrencies.includes('ARS') && (
                                                    <Col>
                                                      <Form.Group>
                                                        <Form.Label className="small text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                                                          Monto ARS ($)
                                                        </Form.Label>
                                                        <Form.Control
                                                          type="number"
                                                          placeholder="$ ARS"
                                                          value={priceObj.amounts?.ars ?? ''}
                                                          onChange={(e) => handlePriceChange(cIndex, hIndex, dIndex, pIndex, 'ars', e.target.value)}
                                                        />
                                                      </Form.Group>
                                                    </Col>
                                                  )}
                                                  {formData.acceptedCurrencies.includes('USD') && (
                                                    <Col>
                                                      <Form.Group>
                                                        <Form.Label className="small text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                                                          Monto USD (US$)
                                                        </Form.Label>
                                                        <Form.Control
                                                          type="number"
                                                          placeholder="US$ USD"
                                                          value={priceObj.amounts?.usd ?? ''}
                                                          onChange={(e) => handlePriceChange(cIndex, hIndex, dIndex, pIndex, 'usd', e.target.value)}
                                                        />
                                                      </Form.Group>
                                                    </Col>
                                                  )}
                                                </Row>
                                              </div>
                                            </Col>
                                          ))}
                                        </Row>
                                      )}
                                    </div>
                                  </Card>
                                ))
                              )}
                            </div>
                          </Card>
                        ))
                      )}
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