import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FaWhatsapp, FaHotel } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import api from '../services/api'

// IMPORTAMOS EL NUEVO COMPONENTE HIJO
import PackageResumeBar from '../components/PackageResumeBar'
import '../styles/packageDetail.css'

const PackageDetail = () => {
  const { slug } = useParams()

  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedCircuit, setSelectedCircuit] = useState(null)
  const [selectedDateObj, setSelectedDateObj] = useState(null)

  useEffect(() => {
    fetchPackage()
  }, [slug])

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/${slug}`)
      const data = res.data
      setPkg(data)

      if (data.circuits?.length > 0) {
        setSelectedCircuit(data.circuits[0])
      }

      if (data.availableDates?.length > 0) {
        setSelectedDateObj(data.availableDates[0])
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

  const phone = '5491151642289'

  const formattedSelectedDate = selectedDateObj?.date
    ? new Date(selectedDateObj.date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    : 'A confirmar'

  const whatsappText = encodeURIComponent(
    `¡Hola! Me interesa el paquete *${pkg.title}* para la salida del *${formattedSelectedDate}* ` +
    `(Opción: *${selectedCircuit?.title || 'Estándar'}* • Hotel: *${selectedDateObj?.hotel || 'A confirmar'}*). ` +
    `¿Podrían confirmarme disponibilidad y detalles? ¡Muchas gracias!`
  )

  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappText}`
  const currencySymbol = selectedCircuit?.currency === 'USD' ? 'US$' : '$'
  const hotelThumbnail = selectedDateObj?.hotelImage || pkg.images?.[0]

  return (
    <section className='packageDetailPage'>

      {/* ===== LLAMADO AL COMPONENTE HIJO ===== */}
      <Container>
        <PackageResumeBar 
          pkg={pkg}
          selectedCircuit={selectedCircuit}
          selectedDateObj={selectedDateObj}
          hotelThumbnail={hotelThumbnail}
          formattedSelectedDate={formattedSelectedDate}
          currencySymbol={currencySymbol}
          whatsappUrl={whatsappUrl}
          scrollToSection={scrollToSection}
        />
      </Container>

      {/* ===== GALERIA + CARD ===== */}
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
          <div className='floatingCard'>
            <div className='floatingTop'>
              <span className='flightText'>
                {pkg.transport?.mode === 'plane' || pkg.transport?.type === 'plane'
                  ? 'Vuelo + Alojamiento'
                  : 'Bus + Alojamiento'}
              </span>
            </div>

            <h3 className='roomTitle'>{pkg.title}</h3>
            <p className='roomDescription text-muted small'>{selectedCircuit?.description || 'Paquete turístico completo'}</p>

            <div className="roomDescription">
              <span>Destino</span>
              <p>{pkg.destination}</p>
            </div>

            <div className="roomDescription">
              <span>Origen</span>
              <p>{pkg.origin}</p>
            </div>

            <div className="roomDescription">
              <span>Duración</span>
              <p>{pkg.days} días / {pkg.nights} noches</p>
            </div>

            <div className="roomDescription border-top pt-2 mt-2" style={{ color: '#ff7675' }}>
              <span>Hotel asignado</span>
              <p className="fw-bold"><FaHotel className="me-1" /> {selectedDateObj?.hotel || 'A confirmar'}</p>
            </div>

            <span className='priceLabel mt-3 d-block'>Valor por persona en base doble </span>
            <h2 className='mainPrice'>
              {currencySymbol} {selectedCircuit?.price?.toLocaleString('es-AR')}
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

      {/* ===== CONTENIDO DETALLES ===== */}
      <Container className='packageDetailContent'>
        <Row>
          <Col className='detailCol'>

            <div className="detailBox">
              <p className='detailDescription'>{pkg.description}</p>
            </div>

            {/* CIRCUITOS */}
            {pkg.circuits?.length > 0 && (
              <div className="detailBox">
                <h4 className='mb-3 section-table-title'>Circuitos disponibles:</h4>
                <div className='circuitsContainer'>
                  {pkg.circuits.map((circuit, index) => (
                    <div
                      key={index}
                      className={`circuitCardRow ${selectedCircuit?.title === circuit.title ? 'activeCircuit' : ''}`}
                      onClick={() => setSelectedCircuit(circuit)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="circuitField" data-label="Circuito">
                        <span className="circuitMainTitle">{circuit.title}</span>
                      </div>
                      <div className="circuitField" data-label="Descripción">
                        <span className="circuitDescText text-muted">{circuit.description || 'Circuito clásico completo'}</span>
                      </div>
                      <div className="circuitField priceText circuitPriceText" data-label="Precio">
                        {circuit.currency === 'USD' ? 'US$' : '$'} {circuit.price?.toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CRONOGRAMA */}
            <div className="detailBox">
              <h4 className='mb-3 section-table-title'>Cronograma de salidas y alojamiento: </h4>
              <div className='datesContainerCustom'>
                {pkg.availableDates?.map((item, index) => (
                  <div
                    key={index}
                    className={`dateCardRowCustom ${selectedDateObj?.date === item.date ? 'activeDateCustom' : ''}`}
                    onClick={() => setSelectedDateObj(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="dateFieldCustom" data-label="Salida">
                      <span className="dateMainTitleCustom">
                        {new Date(item.date).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="dateFieldCustom" data-label="Hotel Asignado">
                      <span className="dateHotelTextCustom">
                        <FaHotel className="text-muted me-1" /> {item.hotel}
                      </span>
                    </div>
                    <div className="dateFieldCustom" data-label="Duración">
                      <span className="dateDurationTextCustom">{pkg.days} días / {pkg.nights} noches</span>
                    </div>
                    <div className="dateFieldCustom priceText circuitPriceText" data-label={`Precio (${selectedCircuit?.title || 'Circuito'})`}>
                      {currencySymbol} {selectedCircuit?.price?.toLocaleString('es-AR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INCLUYE */}
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