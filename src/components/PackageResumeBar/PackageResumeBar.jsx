import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import {
  FaBus,
  FaPlane,
  FaCalendarAlt,
  FaHotel,
  FaCheckCircle,
  FaPlus,
  FaInfoCircle,
  FaWhatsapp,
  FaStar,
  FaRegStar
} from 'react-icons/fa'

import '../PackageResumeBar/PackageResumeBar.css'

const PackageResumeBar = ({
  pkg,
  selectedCircuit,
  selectedHotel,
  selectedDateObj,
  hotelThumbnail,
  formattedSelectedDate,
  currencySymbol,
  whatsappUrl,
  scrollToSection,
  selectedPrice,
  isDayTrip
}) => {
  // Precio a mostrar
  const displayPrice = selectedPrice || selectedCircuit?.price || 0;

  // Ancho dinámico de columnas
  const colSize = isDayTrip ? 4 : 3;

  // Rating de estrellas dinámico
  const starRating = selectedHotel?.stars ?? selectedDateObj?.stars ?? 0;

  // Helper para renderizar estrellas dinamicas
  const renderStars = (rating) => {
    const starsCount = Math.min(Math.max(Number(rating) || 0, 0), 5);
    if (starsCount === 0) return null;

    return (
      <div className='text-warning my-1 small d-flex align-items-center gap-1'>
        {[...Array(5)].map((_, index) => (
          index < starsCount ? (
            <FaStar key={index} />
          ) : (
            <FaRegStar key={index} className='text-muted opacity-25' />
          )
        ))}
      </div>
    );
  };

  return (
    <div className='packageResumeBar border rounded mb-4 bg-white p-0 overflow-hidden'>
      <Row className='g-0 align-items-stretch'>
        
        {/* COLUMNA 1: ALOJAMIENTO */}
        {!isDayTrip && (
          <Col xs={12} lg={3} className='resumeSection p-3 border-lg-end'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
              <span className='resumeLabel text-uppercase small fw-bold text-muted'>
                <FaHotel className='me-1' /> Alojamiento
              </span>
              <Button 
                variant='link' 
                className='p-0 text-decoration-none small-action-btn'
                onClick={() => scrollToSection('.datesContainerCustom')}
              >
                Cambiar
              </Button>
            </div>
            <div className='d-flex gap-3'>
              <div className='position-relative'>
                <img
                  src={hotelThumbnail || selectedHotel?.image}
                  alt={selectedHotel?.name || pkg.title}
                  className='resumeThumb rounded'
                />
              </div>
              <div className='overflow-hidden flex-grow-1'>
                <h5 className='mb-0 fw-bold text-dark text-truncate'>
                  {selectedHotel?.name || selectedDateObj?.hotel || 'Hotel a confirmar'}
                </h5>

                {/* RENDEREADO DINÁMICO DE ESTRELLAS */}
                {renderStars(starRating)}

                <small className='text-muted d-block text-truncate-2-lines'>
                  {selectedCircuit?.title || 'Circuito Estándar'} • {pkg.nights} noches
                </small>
              </div>
            </div>
          </Col>
        )}

        {/* COLUMNA 2: TRANSPORTE */}
        <Col xs={12} lg={colSize} className='resumeSection p-3 border-lg-end bg-light-desktop'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <span className='resumeLabel text-uppercase small fw-bold text-muted'>
              {pkg.transport?.mode === 'plane' || pkg.transport?.type === 'plane' ? <FaPlane className='me-1' /> : <FaBus className='me-1' />} Transporte
            </span>
            <span className='text-muted small-action-disabled'>Incluido</span>
          </div>
          <div className='d-flex align-items-center h-75'>
            <div className='w-100'>
              <div className='d-flex justify-content-between align-items-center fw-bold text-dark mb-1 location-route'>
                <span>{pkg.origin || 'Buenos Aires'}</span>
                <span className='route-line flex-grow-1 mx-2 position-relative text-center text-muted fw-normal small'></span>
                <span>{pkg.destination || 'Tomas Jofré'}</span>
              </div>
              <small className='text-muted d-block text-capitalize text-truncate'>
                {pkg.transport?.category || 'Semi-Cama'}
              </small>
              <small className='text-success d-block fw-semibold mt-1 text-truncate'>
                <FaCheckCircle size={12} /> Equipaje de mano incluido
              </small>
            </div>
          </div>
        </Col>

        {/* COLUMNA 3: SALIDA Y EXTRAS */}
        <Col xs={12} lg={colSize} className='resumeSection p-3 border-lg-end'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <span className='resumeLabel text-uppercase small fw-bold text-muted'>
              <FaCalendarAlt className='me-1' /> Salida y Extras
            </span>
            <Button 
              variant='link' 
              className='p-0 text-decoration-none small-action-btn'
              onClick={() => scrollToSection(isDayTrip ? '.datesContainerCustom' : '.circuitsContainer')}
            >
              Cambiar Opción
            </Button>
          </div>
          <div className='mb-2 textDanger'>
            <h6 className='mb-0 fw-bold d-flex align-items-center gap-2'>
              {formattedSelectedDate}
            </h6>
          </div>
          <div className='adicionales-list pt-2 border-top'>
            <div className='d-flex justify-content-between align-items-center small text-muted mb-1'></div>
            <div className='d-flex justify-content-between align-items-center small text-muted'>
              <span><FaPlus className='me-1 text-primary' /> Excursiones</span>
              <Button 
                variant='link' 
                className='p-0 text-decoration-none extra-btn'
                onClick={() => scrollToSection(isDayTrip ? '.datesContainerCustom' : '.circuitsContainer')}
              >
                Ver más
              </Button>
            </div>
          </div>
        </Col>

        {/* COLUMNA 4: TARIFA FINAL Y ACCIÓN */}
        <Col xs={12} lg={colSize} className='resumeSection p-3 bg-action-section d-flex flex-column justify-content-center align-items-center align-items-lg-start'>
          <div className='price-block-wrapper mb-2 text-center text-lg-start'>
            <span className='resumeLabel d-block text-uppercase small fw-bold text-muted '>
              <FaInfoCircle className='me-1' /> Tarifa Final
            </span>
            <h3 className='mb-0 fw-black text-dark price-display'>
              {currencySymbol} {displayPrice ? displayPrice.toLocaleString('es-AR') : 'A confirmar'}
            </h3>
            <small className='text-muted d-block base-text mt-1'>
              {isDayTrip ? 'Final por persona' : 'Final por persona en base doble'}
            </small>
          </div>
          <Button 
            href={whatsappUrl}
            target='_blank'
            variant='danger' 
            className='w-100 py-2 btn-despegar-style mt-auto d-flex align-items-center justify-content-center gap-2'
            style={{ maxWidth: '100%' }}
          >
            <FaWhatsapp size={18} /> Consultar Viaje
          </Button>
        </Col>

      </Row>
    </div>
  )
}

export default PackageResumeBar