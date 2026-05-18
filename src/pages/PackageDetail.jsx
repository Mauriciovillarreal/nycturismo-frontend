import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap'
import {
  FaWhatsapp,
  FaBus,
  FaPlane,
  FaCalendarAlt,
  FaHotel
} from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import api from '../services/api'
import '../styles/packageDetail.css'

const PackageDetail = () => {
  const { slug } = useParams()

  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  // ESTADOS DE SELECCIÓN
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
    `Hola! Quiero consultar por el paquete "${pkg.title}"\n\n` +
    `• Opción: ${selectedCircuit?.title || 'Estándar'}\n` +
    `• Salida: ${formattedSelectedDate}\n` +
    `• Hotel: ${selectedDateObj?.hotel || 'A combinar'}`
  )

  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappText}`
  const currencySymbol = selectedCircuit?.currency === 'USD' ? 'US$' : '$'

  // DINAMISMO DE IMAGEN: Usamos la foto del hotel seleccionado, si no existe va la del paquete
  const hotelThumbnail = selectedDateObj?.hotelImage || pkg.images?.[0]

  return (
    <section className='packageDetailPage'>

      {/* ===== TOP RESUME BAR ===== */}
      <Container className='packageResumeBar'>

        {/* ALOJAMIENTO */}
        <div className='resumeItem'>
          <span className='resumeLabel'>Alojamiento</span>
          <div className='resumeContent'>
            <img
              src={hotelThumbnail}
              alt={selectedDateObj?.hotel || pkg.title}
              className='resumeThumb'
            />
            <div>
              {/* Ahora muestra el nombre del hotel como título principal */}
              <h4 className='text-truncate' style={{ maxWidth: '160px' }}>
                {selectedDateObj?.hotel || 'Hotel a confirmar'}
              </h4>
              <p>{selectedCircuit?.title} • {pkg.nights} noches</p>
            </div>
          </div>
        </div>

        {/* TRANSPORTE */}
        <div className='resumeItem'>
          <span className='resumeLabel'>Transporte</span>
          <div className='resumeTransport'>
            <div className='resumeIconBox'>
              {pkg.transport?.mode === 'plane' || pkg.transport?.type === 'plane' ? <FaPlane /> : <FaBus />}
            </div>
            <div>
              <h4>{pkg.origin} → {pkg.destination}</h4>
              <p>{pkg.transport?.category || 'Clase Ejecutiva'}</p>
            </div>
          </div>
        </div>

        {/* FECHA Y SALIDA */}
        <div className='resumeItem'>
          <span className='resumeLabel'>Salida Seleccionada</span>
          <div className='resumeDateHotelBox'>
            <p className='dateTopDetail fw-bold mb-1' style={{ color: '#ff7675' }}>
              <FaCalendarAlt className="me-1" /> {formattedSelectedDate}
            </p>
            <p className='small text-muted mb-0 text-truncate' style={{ maxWidth: '180px' }}>
              <FaHotel className="me-1" /> {selectedDateObj?.hotel || 'Consultar Hotel'}
            </p>
          </div>
        </div>

        {/* TARIFA */}
        <div className='resumeItem'>
          <span className='resumeLabel'>Tarifa</span>
          <div className='resumePriceInfo'>
            <h4>Valor por persona en base doble</h4>
            <h5>
              {currencySymbol} {selectedCircuit?.price?.toLocaleString('es-AR')}
            </h5>
          </div>
        </div>

      </Container>

      {/* ===== GALERIA + CARD ===== */}
      <Container className='galleryWrapper'>
        <div className='galleryContent'>

          <div className='gallerySection'>
            <div className='mainImage'>
              <img src={pkg.images?.[0]} alt={pkg.title} />
            </div>
            <div className='sideImages'>
              {pkg.images?.slice(1, 5).map((img, index) => (
                <img key={index} src={img} alt={pkg.title} />
              ))}
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
              <p className="fw-semibold">{pkg.destination}</p>
            </div>

            <div className="roomDescription">
              <span>Origen</span>
              <p>{pkg.origin}</p>
            </div>

            <div className="roomDescription">
              <span>Duración</span>
              <p>{pkg.days} días / {pkg.nights} noches</p>
            </div>

            {/* ENLACE DE HOTEL ASIGNADO */}
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
              <FaWhatsapp /> Consultar disponibilidad
            </Button>
          </div>
        </div>
      </Container>

      {/* ===== CONTENIDO DETALLES ===== */}
      <Container className='packageDetailContent'>
        <Row>
          <Col lg={8}>

            <div className="detailBox">
              <p className='detailDescription'>{pkg.description}</p>
            </div>

            {/* 1. SELECCIONÁ TU OPCIÓN DE SERVICIO */}
            {pkg.circuits?.length > 0 && (
              <div className="detailBox">
                <h4 className='mb-3'>Seleccioná tu opción de circuito:</h4>
                <div className='circuitsContainer'>
                  {pkg.circuits.map((circuit, index) => (
                    <div
                      key={index}
                      className={`circuitCard ${selectedCircuit?.title === circuit.title ? 'activeCircuit' : ''}`}
                      onClick={() => setSelectedCircuit(circuit)}
                    >
                      <h4>{circuit.title}</h4>
                      <p>{circuit.description}</p>
                      <strong>
                        {circuit.currency === 'USD' ? 'US$' : '$'} {circuit.price?.toLocaleString('es-AR')}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. SELECCIONÁ TU FECHA DE SALIDA */}
            {pkg.availableDates?.length > 0 && (
              <div className="detailBox">
                <h4 className='mb-3'>Seleccioná tu fecha de salida:</h4>
                <div className="datesSelectorGrid">
                  {pkg.availableDates.map((item, index) => {
                    const isSelected = selectedDateObj?.date === item.date;
                    return (
                      <div
                        key={index}
                        className={`circuitCard ${isSelected ? 'activeCircuit' : ''}`}
                        onClick={() => setSelectedDateObj(item)}
                        style={{ cursor: 'pointer', marginBottom: '1rem' }}
                      >
                        <Row className="align-items-center py-2">
                          <Col xs={6}>
                            <span className="d-block small text-muted text-uppercase fw-bold">Salida</span>
                            <span className="fw-bold text-dark fs-5">
                              {new Date(item.date).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </Col>
                          <Col xs={6}>
                            <span className="d-block small text-muted text-uppercase fw-bold">
                              <FaHotel size={11} className="me-1" /> Hotel Incluido
                            </span>
                            <span className="text-secondary fw-semibold text-truncate d-block">
                              {item.hotel}
                            </span>
                          </Col>
                        </Row>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TABLA RESUMEN */}
            <div className="detailBox">
              <h4 className='mb-3'>Resumen de tarifas por salida</h4>
              <table className='datesTable'>
                <thead>
                  <tr>
                    <th>Salida</th>
                    <th>Hotel Asignado</th>
                    <th>Duración</th>
                    <th>Precio ({selectedCircuit?.title})</th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.availableDates?.map((item, index) => (
                    <tr
                      key={index}
                      className={selectedDateObj?.date === item.date ? 'table-active fw-bold' : ''}
                      onClick={() => setSelectedDateObj(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        {new Date(item.date).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td><FaHotel className="text-muted me-1" /> {item.hotel}</td>
                      <td>{pkg.days} días / {pkg.nights} noches</td>
                      <td className='priceText'>
                        {currencySymbol} {selectedCircuit?.price?.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* INCLUYE */}
            <div className="detailBox">
              <h4 className='mb-3'>¿Qué incluye la opción {selectedCircuit?.title}?</h4>
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