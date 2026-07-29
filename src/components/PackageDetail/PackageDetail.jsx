import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { FaWhatsapp, FaHotel, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import Loader from '../Loader/Loader.jsx'
import api from '../../services/api.js'

import PackageResumeBar from '../PackageResumeBar/PackageResumeBar.jsx'
import '../PackageDetail/PackageDetail.css'

// =========================================================
// SUB-COMPONENTE: POPUP CALENDARIO FLOTANTE (ESTILO DESPEGAR)
// =========================================================
const DatePickerPopover = ({ departures, selectedDeparture, onSelectDate, onClose, isDayTrip, currencySymbol, pkgDays }) => {
  const popoverRef = useRef(null)

  // Mapa de fechas disponibles para rápida búsqueda: "YYYY-MM-DD" -> departureObj
  const departureMap = React.useMemo(() => {
    const map = new Map()
    departures.forEach((dep) => {
      if (dep.date) {
        const dateStr = new Date(dep.date).toISOString().split('T')[0]
        map.set(dateStr, dep)
      }
    })
    return map
  }, [departures])

  // Fecha inicial para el mes visible
  const initialDate = departures[0]?.date ? new Date(departures[0].date) : new Date()
  const [currentMonth, setCurrentMonth] = useState(
    new Date(Date.UTC(initialDate.getUTCFullYear(), initialDate.getUTCMonth(), 1))
  )

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 1, 1)))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 1)))
  }

  // Generar días del mes actual
  const year = currentMonth.getUTCFullYear()
  const month = currentMonth.getUTCMonth()
  const monthName = currentMonth.toLocaleDateString('es-AR', { timeZone: 'UTC', month: 'long' })
  const formattedMonthName = monthName.toUpperCase()

  // Día de la semana en que arranca el mes (0=Dom, 1=Lun...)
  // Ajustamos a 0=Lun, 1=Mar ... 6=Dom para que coincida con LU MA MI JU VI SA DO
  let firstDayOfWeek = new Date(Date.UTC(year, month, 1)).getUTCDay() - 1
  if (firstDayOfWeek === -1) firstDayOfWeek = 6

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const calendarDays = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const weekDays = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO']

  // Formateador corto de precio (ej: $642.680 -> 642 K)
  const formatShortPrice = (amount) => {
    if (!amount) return ''
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2).replace('.', ',')} M`
    if (amount >= 1000) return `${Math.round(amount / 1000)} K`
    return `${amount}`
  }

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: '105%',
        left: '0',
        width: '100%',
        maxWidth: '350px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        border: '1px solid #eee',
        zIndex: 1050,
        padding: '16px',
        fontFamily: 'inherit'
      }}
    >
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Salidas disponibles</span>
      </div>

      {/* Navegador del Mes */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
        <button
          onClick={handlePrevMonth}
          type="button"
          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: '#555' }}
        >
          <FaChevronLeft size={12} />
        </button>
        <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#2d3436', letterSpacing: '0.5px' }}>
          {formattedMonthName} {year}
        </span>
        <button
          onClick={handleNextMonth}
          type="button"
          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: '#555' }}
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      {/* Días de la semana */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '6px' }}>
        {weekDays.map((d, idx) => (
          <span key={idx} style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#a4b0be' }}>
            {d}
          </span>
        ))}
      </div>

      {/* Grilla de Días */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '6px', textAlign: 'center' }}>
        {calendarDays.map((day, idx) => {
          if (!day) return <div key={idx} />

          const formattedDay = String(day).padStart(2, '0')
          const formattedMonth = String(month + 1).padStart(2, '0')
          const dateKey = `${year}-${formattedMonth}-${formattedDay}`

          const departureObj = departureMap.get(dateKey)
          const isAvailable = !!departureObj

          const selectedDateStr = selectedDeparture?.date
            ? new Date(selectedDeparture.date).toISOString().split('T')[0]
            : null
          const isSelected = selectedDateStr === dateKey

          // Obtener precio para mostrar bajo el número si está disponible
          const dayPrice = isAvailable && departureObj.calculatedPrice ? departureObj.calculatedPrice : null

          return (
            <div
              key={idx}
              onClick={() => {
                if (isAvailable) {
                  onSelectDate(departureObj)
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '42px',
                padding: '2px',
                borderRadius: '8px',
                cursor: isAvailable ? 'pointer' : 'default',
                backgroundColor: isSelected ? '#d63031' : isAvailable ? '#fff5f5' : 'transparent',
                color: isSelected ? '#ffffff' : isAvailable ? '#2d3436' : '#dcdde1',
                border: isSelected ? '1px solid #d63031' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: isAvailable ? 'bold' : 'normal', lineHeight: '1' }}>
                {day}
              </span>
              {isAvailable && (
                <span style={{ fontSize: '0.62rem', marginTop: '2px', color: isSelected ? '#ffffff' : '#d63031', fontWeight: 'bold' }}>
                  {formatShortPrice(dayPrice)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer desplegable */}
      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
        <div>
          <span className="d-block text-muted" style={{ fontSize: '0.72rem' }}>
            {isDayTrip ? 'Excursión de 1 día' : `Estadía: ${pkgDays} días`}
          </span>
          <strong style={{ fontSize: '0.9rem', color: '#d63031' }}>
            {currencySymbol} {selectedDeparture?.calculatedPrice?.toLocaleString('es-AR') || '0'}
          </strong>
          <span style={{ fontSize: '0.7rem', color: '#666' }}> /persona</span>
        </div>
        <Button
          onClick={onClose}
          size="sm"
          style={{
            backgroundColor: '#d63031',
            borderColor: '#d63031',
            borderRadius: '20px',
            padding: '4px 18px',
            fontWeight: 'bold',
            fontSize: '0.8rem'
          }}
        >
          Listo
        </Button>
      </div>
    </div>
  )
}

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================
const PackageDetail = () => {
  const { slug } = useParams()

  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedCircuit, setSelectedCircuit] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedDeparture, setSelectedDeparture] = useState(null)

  // Control para abrir / cerrar el menú flotante del calendario
  const [showCalendar, setShowCalendar] = useState(false)

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

  const isDayTrip =
    pkg.category?.toLowerCase() === 'miniturismo' ||
    pkg.nights === 0 ||
    pkg.nights === '0'

  const phone = '5491151642289'

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
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
    : 'A confirmar'

  const optionNameText = typeof selectedOption === 'string' ? selectedOption : selectedOption?.name || 'Estándar'

  let rawWhatsappText = ''
  if (isDayTrip) {
    rawWhatsappText =
      `¡Hola! Me interesa la excursión de miniturismo *${pkg.title}* ` +
      `para la salida del *${formattedSelectedDate}*. ` +
      `¿Podrían confirmarme disponibilidad, punto de encuentro y detalles del viaje? ¡Muchas gracias!`
  } else {
    const hotelName = selectedHotel?.name || 'A confirmar'
    rawWhatsappText =
      `¡Hola! Me interesa el paquete *${pkg.title}* para la salida del *${formattedSelectedDate}* ` +
      `(Circuito: *${selectedCircuit?.title || 'Estándar'}* • Opción: *${optionNameText}* • Hotel: *${hotelName}*). ` +
      `¿Podrían confirmarme disponibilidad y detalles? ¡Muchas gracias!`
  }

  const whatsappText = encodeURIComponent(rawWhatsappText)
  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappText}`
  const currencySymbol = pkg.currency === 'USD' ? 'US$' : '$'
  const hotelThumbnail = selectedHotel?.image || pkg.images?.[0]

  // Consolidar todas las salidas del circuito actual agregando precio precalculado
  const allCircuitDepartures = []
  selectedCircuit?.hotels?.forEach((hotel) => {
    hotel.departures?.forEach((dep) => {
      const price = getCalculatedPrice(dep, selectedOption)
      allCircuitDepartures.push({
        ...dep,
        hotel,
        calculatedPrice: price
      })
    })
  })

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
            
            {/* BOTÓN SELECTOR DE FECHAS ESTILO DESPEGAR / VUELOS */}
            <div className="position-relative mt-3 mb-2">
              <label className="d-block text-muted small mb-1 fw-semibold">Fecha de salida</label>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-100 d-flex align-items-center gap-2 px-3 py-2 text-start"
                style={{
                  border: '1.5px solid #d63031',
                  borderRadius: '30px',
                  backgroundColor: showCalendar ? '#fff5f5' : '#ffffff',
                  color: '#2d3436',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: showCalendar ? '0 0 0 3px rgba(214, 48, 49, 0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaCalendarAlt style={{ color: '#d63031', fontSize: '1rem', flexShrink: 0 }} />
                <span className="text-truncate flex-grow-1">
                  Salida: {formattedSelectedDate}
                </span>
              </button>

              {/* MODAL / POPOVER DE CALENDARIO DE DÍAS Y PRECIOS */}
              {showCalendar && (
                <DatePickerPopover
                  departures={allCircuitDepartures}
                  selectedDeparture={selectedDeparture}
                  onSelectDate={(dep) => {
                    setSelectedHotel(dep.hotel)
                    setSelectedDeparture(dep)
                    setShowCalendar(false)
                  }}
                  onClose={() => setShowCalendar(false)}
                  isDayTrip={isDayTrip}
                  currencySymbol={currencySymbol}
                  pkgDays={pkg.days}
                />
              )}
            </div>


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

            {!isDayTrip && (
              <div className="roomDescription border-top pt-2 mt-2" style={{ color: '#ff7675' }}>
                <span>Hotel asignado</span>
                <p className="fw-bold"><FaHotel className="me-1" /> {selectedHotel?.name || 'A confirmar'}</p>
              </div>
            )}



            <span className='priceLabel mt-2 d-block'>Valor por persona en base doble</span>
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

            {/* CIRCUITOS DISPONIBLES */}
            {!isDayTrip && pkg.circuits?.length > 0 && (
              <div className="detailBox">
           
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
                            <div className="circuitOptionsMobile mt-2 pt-2 border-top" onClick={(e) => e.stopPropagation()}>
                              <span className="fw-bold small text-dark d-block mb-2">Opciones disponibles:</span>
                              <Form className="d-flex flex-column gap-2">
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

            {/* QUÉ INCLUYE */}
            <div className="detailBox paddingTopIncludes">
              <h4 className='mb-3 section-table-title'>Incluye</h4>
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