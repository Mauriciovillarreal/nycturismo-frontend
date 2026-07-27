import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { FaWhatsapp, FaHotel, FaCalendarAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import api from '../services/api'

import PackageResumeBar from '../components/PackageResumeBar'
import '../styles/packageDetail.css'

const PackageDetail = () => {
  const { slug } = useParams()

  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedCircuit, setSelectedCircuit] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedDeparture, setSelectedDeparture] = useState(null)

  useEffect(() => {
    fetchPackage()
  }, [slug])

  // EFECTO DE CASCADA AL CAMBIAR CIRCUITO
  useEffect(() => {
    if (selectedCircuit) {
      const firstOpt = selectedCircuit.options?.[0] || null
      setSelectedOption(firstOpt)

      const firstHotel = selectedCircuit.hotels?.[0] || null
      setSelectedHotel(firstHotel)

      const firstDeparture = firstHotel?.departures?.[0] || null
      setSelectedDeparture(firstDeparture)
    }
  }, [selectedCircuit])

  // EFECTO AL CAMBIAR HOTEL
  useEffect(() => {
    if (selectedHotel) {
      const firstDeparture = selectedHotel.departures?.[0] || null
      setSelectedDeparture(firstDeparture)
    }
  }, [selectedHotel])

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/${slug}`)
      const data = res.data
      setPkg(data)

      if (data.circuits?.length > 0) {
        setSelectedCircuit(data.circuits[0])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToSection = (selector) => {
    const element = document.querySelector(selector)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (loading) return <Loader />

  if (!pkg) {
    return (
      <Container className="py-5">
        <p>Paquete no encontrado</p>
      </Container>
    )
  }

  // DETECTAR SI ES MINITURISMO / SALIDA DEL DÍA (Resuelve mayúsculas/minúsculas)
  const isDayTrip =
    pkg.category?.toLowerCase() === 'miniturismo' ||
    pkg.nights === 0 ||
    pkg.nights === '0'

  const phone = '5491151642289'

  // OBTENER PRECIO DINÁMICO
  const getCalculatedPrice = (departure, option) => {
    if (!departure || !option) return 0
    const optionName = typeof option === 'string' ? option : option.name
    const priceObj = departure.prices?.find((p) => p.option === optionName)
    return priceObj ? priceObj.amount : 0
  }

  const currentPrice = getCalculatedPrice(selectedDeparture, selectedOption)

  const formattedSelectedDate = selectedDeparture?.date
    ? new Date(selectedDeparture.date).toLocaleDateString('es-AR', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'A confirmar'

  const optionNameText = typeof selectedOption === 'string' ? selectedOption : selectedOption?.name || 'Estándar'

  // Mensaje adaptado para WhatsApp según el tipo de viaje
  const hotelInfoMsg = isDayTrip ? '' : ` • Hotel: *${selectedHotel?.name || 'A confirmar'}*`
  
  const whatsappText = encodeURIComponent(
    `¡Hola! Me interesa el paquete *${pkg.title}* para la salida del *${formattedSelectedDate}* ` +
    `(Circuito: *${selectedCircuit?.title || 'Estándar'}* • Opción: *${optionNameText}*${hotelInfoMsg}). ` +
    `¿Podrían confirmarme disponibilidad y detalles? ¡Muchas gracias!`
  )

  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappText}`
  const currencySymbol = pkg.currency === 'USD' ? 'US$' : '$'
  const hotelThumbnail = selectedHotel?.image || pkg.images?.[0]

  return (
    <section className='packageDetailPage'>

      {/* ===== BARRA RESUMEN INFERIOR / SUPERIOR ===== */}
      <Container>
        <PackageResumeBar
          pkg={pkg}
          selectedCircuit={selectedCircuit}
          selectedHotel={selectedHotel}
          selectedDeparture={selectedDeparture}
          selectedOption={selectedOption}
          selectedPrice={currentPrice}
          hotelThumbnail={hotelThumbnail}
          formattedSelectedDate={formattedSelectedDate}
          currencySymbol={currencySymbol}
          whatsappUrl={whatsappUrl}
          scrollToSection={scrollToSection}
          isDayTrip={isDayTrip}
        />
      </Container>

      {/* ===== GALERIA + CARD DERECHA ===== */}
      <Container className='galleryWrapper'>
        <div className='galleryContent'>

          <div className='gallerySection'>
            <div className='mainImage'>
              <img src={pkg.images?.[0]} alt={pkg.title} />
            </div>
            <div className='sideImages'>
              <img src={pkg.images?.[1]} alt={pkg.title} />
              <img src={pkg.images?.[2]} alt={pkg.title} />
              <img src={pkg.images?.[3]} alt={pkg.title} />
              <img src={pkg.images?.[4]} alt={pkg.title} />
            </div>
          </div>

          {/* CARD FLOTANTE DERECHA */}
          <div className='floatingCard '>
            <div className='floatingTop'>
              <span className='flightText'>
                {isDayTrip
                  ? 'Excursión de 1 Día'
                  : pkg.transport?.mode === 'plane' || pkg.transport?.type === 'plane'
                  ? 'Vuelo + Alojamiento'
                  : 'Bus + Alojamiento'}
              </span>
            </div>

            <h3 className='roomTitle '>{pkg.title}</h3>
            <p className='roomDescription text-muted small'>{selectedCircuit?.description || 'Paquete turístico completo'}</p>

            <div className="roomDescription ">
              <span>Destino</span>
              <p>{pkg.destination}</p>
            </div>

            <div className="roomDescription">
              <span>Origen</span>
              <p>{pkg.origin}</p>
            </div>

            <div className="roomDescription">
              <span>Duración</span>
              <p>{isDayTrip ? 'Excursión en el día' : `${pkg.days} días / ${pkg.nights} noches`}</p>
            </div>

            {/* OCULTA HOTEL SI ES MINITURISMO */}
            {!isDayTrip && (
              <div className="roomDescription border-top pt-2 mt-2" style={{ color: '#ff7675' }}>
                <span>Hotel asignado</span>
                <p className="fw-bold"><FaHotel className="me-1" /> {selectedHotel?.name || 'A confirmar'}</p>
              </div>
            )}

            <span className='priceLabel mt-3 d-block'>Valor por persona</span>
            <h2 className='mainPrice'>
              {currencySymbol} {currentPrice?.toLocaleString('es-AR')}
            </h2>

            <Button
              href={whatsappUrl}
              target='_blank'
              className='roomsButton'
            >
              <FaWhatsapp /> Consultar Viaje
            </Button>
          </div>
        </div>
      </Container>

      {/* ===== CONTENIDO Y DETALLES ===== */}
      <Container className='packageDetailContent'>
        <Row>
          <Col className='detailCol'>

            <div className="detailBox">
              <p className='detailDescription'>{pkg.description}</p>
            </div>

            {/* CIRCUITOS DISPONIBLES (SE OCULTA COMPLETAMENTE SI ES MINITURISMO/1 DÍA) */}
            {!isDayTrip && pkg.circuits?.length > 0 && (
              <div className="detailBox">
                <h4 className='mb-3 section-table-title'>Circuitos disponibles:</h4>
                <div className='circuitsContainer'>
                  {pkg.circuits.map((circuit, index) => {
                    const isSelected = selectedCircuit?.title === circuit.title
                    const activeOpt = isSelected ? selectedOption : circuit.options?.[0]
                    const firstDep = circuit.hotels?.[0]?.departures?.[0]
                    const circuitPrice = isSelected ? currentPrice : getCalculatedPrice(firstDep, activeOpt)

                    return (
                      <div
                        key={index}
                        className={`circuitCardRow ${isSelected ? 'activeCircuit' : ''}`}
                        onClick={() => setSelectedCircuit(circuit)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="circuitField" data-label="Circuito">
                          <span className="circuitMainTitle">{circuit.title}</span>
                        </div>

                        <div className="circuitField" data-label="Descripción">
                          <span className="circuitDescText text-muted d-block mb-2">
                            {circuit.description || 'Circuito clásico completo'}
                          </span>

                          {isSelected && circuit.options?.length > 0 && (
                            <div className="mt-2 pt-2 border-top" onClick={(e) => e.stopPropagation()}>
                              <span className="fw-bold small text-dark d-block mb-1">Opciones disponibles:</span>
                              <Form className="d-flex flex-wrap gap-3">
                                {circuit.options.map((opt, optIdx) => {
                                  const optName = typeof opt === 'string' ? opt : opt.name
                                  const currentSelectedName = typeof selectedOption === 'string' ? selectedOption : selectedOption?.name

                                  return (
                                    <Form.Check
                                      key={optIdx}
                                      type="radio"
                                      id={`circuit-${index}-option-${optIdx}`}
                                      name={`circuitOptions-${index}`}
                                      label={optName}
                                      checked={currentSelectedName === optName}
                                      onChange={() => setSelectedOption(opt)}
                                      className="fw-semibold small checkOption"
                                    />
                                  )
                                })}
                              </Form>
                            </div>
                          )}
                        </div>

                        <div className="circuitField priceText circuitPriceText" data-label="Precio">
                          {currencySymbol} {circuitPrice?.toLocaleString('es-AR')}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* CRONOGRAMA DE SALIDAS */}
            <div className="detailBox">
              <h4 className='mb-3 section-table-title'>
                {isDayTrip ? 'Cronograma de salidas:' : 'Cronograma de salidas y alojamiento:'}
              </h4>

              {selectedCircuit?.hotels?.map((hotel, hIdx) => (
                <div key={hIdx} className="mb-4">

                  {/* Título del Hotel SOLO si NO es Miniturismo */}
                  {!isDayTrip && (
                    <div className="mb-2 p-2 border-bottom bg-light rounded">
                      <h5 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                        <FaHotel /> {hotel.name} {hotel.city ? `(${hotel.city})` : ''}
                      </h5>
                    </div>
                  )}

                  <div className='datesContainerCustom'>
                    {hotel.departures?.map((item, index) => {
                      const itemPrice = getCalculatedPrice(item, selectedOption)
                      const isSelected = selectedDeparture?.date === item.date && selectedHotel?.name === hotel.name

                      return (
                        <div
                          key={index}
                          className={`dateCardRowCustom ${isSelected ? 'activeDateCustom' : ''}`}
                          onClick={() => {
                            setSelectedHotel(hotel)
                            setSelectedDeparture(item)
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="dateFieldCustom" data-label="Salida">
                            <span className="dateMainTitleCustom">
                              {new Date(item.date).toLocaleDateString('es-AR', {
                                timeZone: 'UTC',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          <div className="dateFieldCustom" data-label={isDayTrip ? "Tipo de viaje" : "Hotel Asignado"}>
                            <span className="dateHotelTextCustom">
                              {isDayTrip ? (
                                <><FaCalendarAlt className="text-muted me-1" /> Excursión de 1 día</>
                              ) : (
                                <><FaHotel className="text-muted me-1" /> {hotel.name}</>
                              )}
                            </span>
                          </div>

                          <div className="dateFieldCustom" data-label="Duración">
                            <span className="dateDurationTextCustom">
                              {isDayTrip ? '1 día / Salida y regreso en el día' : `${pkg.days} días / ${pkg.nights} noches`}
                            </span>
                          </div>

                          <div className="dateFieldCustom priceText circuitPriceText" data-label={`Precio (${selectedCircuit?.title || 'Circuito'})`}>
                            {currencySymbol} {itemPrice?.toLocaleString('es-AR')}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                </div>
              ))}
            </div>

            {/* QUÉ INCLUYE */}
            <div className="detailBox">
              <h4 className='mb-3 section-table-title'>¿Qué incluye la opción {selectedCircuit?.title}?</h4>
              {selectedCircuit?.includes?.length > 0 ? (
                <div className='includesGrid'>
                  {selectedCircuit.includes.map((item, index) => (
                    <div key={index} className='includeItem'>
                      <div className='includeIcon'>✓</div>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No especificado</p>
              )}
            </div>

          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default PackageDetail