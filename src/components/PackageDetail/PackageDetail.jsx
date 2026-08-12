import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { FaWhatsapp, FaHotel, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaStar, FaMapMarkerAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import Loader from '../Loader/Loader.jsx'
import api from '../../services/api.js'

import PackageResumeBar from '../PackageResumeBar/PackageResumeBar.jsx'
import '../PackageDetail/PackageDetail.css'

// =========================================================
// SUB-COMPONENTE: POPUP CALENDARIO FLOTANTE
// =========================================================
const DatePickerPopover = ({ departures, selectedDeparture, onSelectDate, onClose, isDayTrip, currencySymbol, pkgDays, paymentMode }) => {
  const popoverRef = useRef(null)

  const departureMap = React.useMemo(() => {
    const map = new Map()
    departures.forEach((dep) => {
      if (dep.date) {
        const dateStr = new Date(dep.date).toISOString().split('T')[0]
        if (!map.has(dateStr)) {
          map.set(dateStr, dep)
        }
      }
    })
    return map
  }, [departures])

  const initialDate = departures[0]?.date ? new Date(departures[0].date) : new Date()
  const [currentMonth, setCurrentMonth] = useState(
    new Date(Date.UTC(initialDate.getUTCFullYear(), initialDate.getUTCMonth(), 1))
  )

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

  const year = currentMonth.getUTCFullYear()
  const month = currentMonth.getUTCMonth()
  const monthName = currentMonth.toLocaleDateString('es-AR', { timeZone: 'UTC', month: 'long' })
  const formattedMonthName = monthName.toUpperCase()

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

  const formatShortPrice = (price) => {
    if (!price) return ''
    const amount = typeof price === 'object' ? (price.ars || price.usd) : price
    if (!amount) return ''
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2).replace('.', ',')} M`
    if (amount >= 1000) return `${Math.round(amount / 1000)} K`
    return `${amount}`
  }

  const renderSelectedPriceText = () => {
    if (!selectedDeparture?.calculatedPrice) return '0'
    const price = selectedDeparture.calculatedPrice
    if (paymentMode === 'SPLIT' || typeof price === 'object') {
      const arsPart = price.ars ? `$${price.ars.toLocaleString('es-AR')}` : ''
      const usdPart = price.usd ? `US$${price.usd.toLocaleString('es-AR')}` : ''
      return [arsPart, usdPart].filter(Boolean).join(' + ')
    }
    return `${currencySymbol} ${price.toLocaleString('es-AR')}`
  }

  return (
    <div ref={popoverRef} className="datePickerPopover">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="popoverHeaderTitle">Salidas disponibles</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
        <button onClick={handlePrevMonth} type="button" className="calendarNavBtn">
          <FaChevronLeft size={12} />
        </button>
        <span className="calendarMonthTitle">
          {formattedMonthName} {year}
        </span>
        <button onClick={handleNextMonth} type="button" className="calendarNavBtn">
          <FaChevronRight size={12} />
        </button>
      </div>

      <div className="calendarWeekGrid">
        {weekDays.map((d, idx) => (
          <span key={idx} className="calendarWeekDay">
            {d}
          </span>
        ))}
      </div>

      <div className="calendarDaysGrid">
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

          const dayPrice = isAvailable && departureObj.calculatedPrice ? departureObj.calculatedPrice : null

          return (
            <div
              key={idx}
              onClick={() => {
                if (isAvailable) {
                  onSelectDate(departureObj)
                }
              }}
              className={`calendarDayCell ${isAvailable ? 'available' : ''} ${isSelected ? 'selected' : ''}`}
            >
              <span className={`calendarDayNumber ${isAvailable ? 'fw-bold' : ''}`}>
                {day}
              </span>
              {isAvailable && (
                <span className="calendarDayPrice">
                  {formatShortPrice(dayPrice)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
        <div>
          <span className="popoverStayText">
            {isDayTrip ? 'Excursión de 1 día' : `Estadía: ${pkgDays} días`}
          </span>
          <strong className="popoverPriceText">
            {renderSelectedPriceText()}
          </strong>
          <span className="popoverPerPersonText"> /persona</span>
        </div>
        <Button onClick={onClose} size="sm" className="popoverReadyBtn">
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
  const [selectedCurrency, setSelectedCurrency] = useState('ARS')

  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    fetchPackage()
  }, [slug])

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

  useEffect(() => {
    if (selectedHotel && selectedDeparture) {
      const activeDateStr = new Date(selectedDeparture.date).toISOString().split('T')[0]
      const matchingDep = selectedHotel.departures?.find(
        (dep) => new Date(dep.date).toISOString().split('T')[0] === activeDateStr
      )
      if (matchingDep) {
        setSelectedDeparture(matchingDep)
      } else {
        setSelectedDeparture(selectedHotel.departures?.[0] || null)
      }
    }
  }, [selectedHotel])

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/${slug}`)
      const data = res.data
      setPkg(data)

      // Establecer moneda inicial predeterminada
      if (Array.isArray(data.acceptedCurrencies) && data.acceptedCurrencies.length > 0) {
        setSelectedCurrency(data.acceptedCurrencies[0])
      } else if (data.currency) {
        setSelectedCurrency(data.currency)
      }

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

  const paymentMode = pkg.paymentMode || 'CHOICE'

  // DETERMINACIÓN ROBUSTA DE MONEDAS ACEPTADAS
  let acceptedCurrencies = []
  if (Array.isArray(pkg.acceptedCurrencies) && pkg.acceptedCurrencies.length > 0) {
    acceptedCurrencies = pkg.acceptedCurrencies
  } else {
    let hasUsdPrices = false
    pkg.circuits?.forEach(c => {
      c.hotels?.forEach(h => {
        h.departures?.forEach(d => {
          d.prices?.forEach(p => {
            if (p.amounts?.usd || (p.amountUsd && Number(p.amountUsd) > 0)) {
              hasUsdPrices = true
            }
          })
        })
      })
    })

    if (hasUsdPrices) {
      acceptedCurrencies = ['ARS', 'USD']
    } else if (pkg.currency) {
      acceptedCurrencies = [pkg.currency]
    } else {
      acceptedCurrencies = ['ARS']
    }
  }

  // LÓGICA ADAPTADA PARA OBTENCIÓN Y CÁLCULO DE TARIFAS
  const getCalculatedPrice = (departure, option, currency = selectedCurrency) => {
    if (!departure || !option) return paymentMode === 'SPLIT' ? { ars: 0, usd: 0 } : 0
    const optionName = typeof option === 'string' ? option : option.name
    const priceObj = departure.prices?.find((p) => p.option === optionName)

    if (!priceObj) return paymentMode === 'SPLIT' ? { ars: 0, usd: 0 } : 0

    // MODO SPLIT: Retorna objeto con ambos montos obligatorios
    if (paymentMode === 'SPLIT') {
      let arsAmount = 0
      let usdAmount = 0

      if (priceObj.amounts) {
        arsAmount = Number(priceObj.amounts.ars || 0)
        usdAmount = Number(priceObj.amounts.usd || 0)
      } else {
        arsAmount = Number(priceObj.amount || 0)
        usdAmount = Number(priceObj.amountUsd || 0)
      }

      return { ars: arsAmount, usd: usdAmount }
    }

    // MODOS SINGLE / CHOICE:
    const currKey = currency.toLowerCase()

    if (priceObj.amounts) {
      if (priceObj.amounts[currKey] !== null && priceObj.amounts[currKey] !== undefined && priceObj.amounts[currKey] !== '') {
        return Number(priceObj.amounts[currKey])
      }
      return Number(priceObj.amounts.ars || priceObj.amounts.usd || 0)
    }

    if (currKey === 'usd' && priceObj.amountUsd) {
      return Number(priceObj.amountUsd)
    }

    return Number(priceObj.amount || 0)
  }

  const currentPrice = getCalculatedPrice(selectedDeparture, selectedOption)

  // FORMATO DE RENDERIZADO DEL PRECIO (SOPORTA PAGO DIVIDIDO)
// FORMATO DE RENDERIZADO DEL PRECIO (SOPORTA PAGO DIVIDIDO)
const renderFormattedPrice = (price = currentPrice) => {
  if (paymentMode === 'SPLIT' || typeof price === 'object') {
    const arsValue = price?.ars ? `$${price.ars.toLocaleString('es-AR')}` : ''
    const usdValue = price?.usd ? `US$${price.usd.toLocaleString('es-AR')}` : ''

    if (arsValue && usdValue) {
      return `${arsValue} + ${usdValue}`
    }
    return arsValue || usdValue || '$0'
  }

  // Se remueve el espacio entre el símbolo y el valor numérico
  return `${selectedCurrency === 'USD' ? 'US$' : '$'}${price?.toLocaleString('es-AR') || '0'}`
}

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
      `para la salida del *${formattedSelectedDate}* (Valor: *${renderFormattedPrice()}*). ` +
      `¿Podrían confirmarme disponibilidad, punto de encuentro y detalles del viaje? ¡Muchas gracias!`
  } else {
    const hotelName = selectedHotel?.name || 'A confirmar'
    rawWhatsappText =
      `¡Hola! Me interesa el paquete *${pkg.title}* para la salida del *${formattedSelectedDate}* ` +
      `(Circuito: *${selectedCircuit?.title || 'Estándar'}* • Opción: *${optionNameText}* • Hotel: *${hotelName}* • Valor: *${renderFormattedPrice()}*). ` +
      `¿Podrían confirmarme disponibilidad y detalles? ¡Muchas gracias!`
  }

  const whatsappText = encodeURIComponent(rawWhatsappText)
  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappText}`

  const currencySymbol = selectedCurrency === 'USD' ? 'US$' : '$'
  const hotelThumbnail = selectedHotel?.image || pkg.images?.[0]

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

  const selectedDateStr = selectedDeparture?.date
    ? new Date(selectedDeparture.date).toISOString().split('T')[0]
    : null

  const availableHotelsForSelectedDate = selectedCircuit?.hotels?.filter((hotel) => {
    return hotel.departures?.some(
      (dep) => new Date(dep.date).toISOString().split('T')[0] === selectedDateStr
    )
  }) || []

  return (
    <section className='packageDetailPage'>

      <Container>
        <PackageResumeBar
          pkg={pkg}
          selectedCircuit={selectedCircuit}
          selectedHotel={selectedHotel}
          selectedDeparture={selectedDeparture}
          selectedOption={selectedOption}
          selectedPrice={currentPrice}
          formattedPrice={renderFormattedPrice()}
          hotelThumbnail={hotelThumbnail}
          formattedSelectedDate={formattedSelectedDate}
          currencySymbol={currencySymbol}
          whatsappUrl={whatsappUrl}
          scrollToSection={scrollToSection}
          isDayTrip={isDayTrip}
          paymentMode={paymentMode}
        />
      </Container>

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
              <div className="roomDescription border-top pt-2 mt-2 assignedHotelText">
                <span>Hotel asignado</span>
                <p className="fw-bold"><FaHotel className="me-1" /> {selectedHotel?.name || 'A confirmar'}</p>
              </div>
            )}

            <div className="position-relative mt-3 mb-2">
              <label className="d-block text-muted small mb-1 fw-semibold">Fecha de salida</label>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className={`datePickerTrigger ${showCalendar ? 'active' : ''}`}
              >
                <FaCalendarAlt className="calendarIcon" />
                <span className="text-truncate flex-grow-1">
                  Salida: {formattedSelectedDate}
                </span>
              </button>

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
                  paymentMode={paymentMode}
                />
              )}
            </div>

            {/* HOTELES DISPONIBLES */}
            {!isDayTrip && availableHotelsForSelectedDate.length > 0 && (
              <div className="detailBox">
                <div className='hotelsContainer'>
                  {availableHotelsForSelectedDate.map((hotel, hIdx) => {
                    const isHotelSelected = selectedHotel?.name === hotel.name

                    return (
                      <div
                        key={hIdx}
                        onClick={() => setSelectedHotel(hotel)}
                        className={`hotelCardRow ${isHotelSelected ? 'activeHotel' : ''}`}
                      >
                        <div className="g-0 gridHotel">
                          <div className="hotelImgCol">
                            {hotel.image ? (
                              <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="hotelImage"
                              />
                            ) : (
                              <div className="hotelImgPlaceholder">
                                <FaHotel size={30} />
                              </div>
                            )}
                          </div>

                          <div className="px-3 py-2 py-sm-0">
                            <div className="gap-2 mb-1 marginTopHotel">
                              <h6 className="hotelTitle m-0">
                                {hotel.name}
                              </h6>
                              {hotel.stars > 0 && (
                                <span className="hotelStars" >
                                  {Array.from({ length: Number(hotel.stars) }, (_, index) => (
                                    <FaStar key={index} />
                                  ))}
                                </span>
                              )}
                            </div>

                            {hotel.city && (
                              <p className="hotelCity text-muted small m-0">
                                <FaMapMarkerAlt className="me-1" /> {hotel.city}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* SELECTOR DE MONEDA (SOLO SI NO ES PAGO DIVIDIDO Y HAY MÁS DE 1 MONEDA) */}
            {paymentMode !== 'SPLIT' && acceptedCurrencies.length > 1 && (
              <div className="currencySelectorContainer">
                <span className="currencyLabel">Moneda</span>
                <div className="currencyButtonGroup">
                  <button
                    type="button"
                    className={`currencyBtn ${selectedCurrency === 'ARS' ? 'active' : ''}`}
                    onClick={() => setSelectedCurrency('ARS')}
                  >
                    Pesos (ARS)
                  </button>
                  <button
                    type="button"
                    className={`currencyBtn ${selectedCurrency === 'USD' ? 'active' : ''}`}
                    onClick={() => setSelectedCurrency('USD')}
                  >
                    Dólares (USD)
                  </button>
                </div>
              </div>
            )}

            <span className='priceLabel mt-2 d-block'>
              {paymentMode === 'SPLIT'
                ? 'Valor combinado por persona (ARS + USD)'
                : 'Valor por persona en base doble'}
            </span>
            <h2 className='mainPrice'>
              {renderFormattedPrice()}
            </h2>

            {pkg.exchangeRate && (
              <p className="text-muted small mt-1 mb-2">
                Tipo de cambio ref: ${pkg.exchangeRate.toLocaleString('es-AR')}
              </p>
            )}

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
                          {renderFormattedPrice(circuitPrice)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* QUÉ INCLUYE */}
            <div className="detailBox detailBoxIncludes">
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