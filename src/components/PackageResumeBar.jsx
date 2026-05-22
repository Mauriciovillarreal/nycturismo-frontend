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
  FaWhatsapp
} from 'react-icons/fa'

import '../styles/packageResume.css'

const PackageResumeBar = ({
  pkg,
  selectedCircuit,
  selectedDateObj,
  hotelThumbnail,
  formattedSelectedDate,
  currencySymbol,
  whatsappUrl,
  scrollToSection
}) => {
  return (
    <div className='packageResumeBar border rounded mb-4 bg-white p-0 overflow-hidden'>
      <Row className='g-0 align-items-stretch'>
        
        {/* COLUMNA 1: ALOJAMIENTO */}
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
                src={hotelThumbnail}
                alt={selectedDateObj?.hotel || pkg.title}
                className='resumeThumb rounded'
              />
            </div>
            <div className='overflow-hidden flex-grow-1'>
              <h5 className='mb-0 fw-bold text-dark text-truncate'>
                {selectedDateObj?.hotel || 'Hotel a confirmar'}
              </h5>
              <div className='text-warning my-1 small'>★★★★☆</div>
              <small className='text-muted d-block text-truncate-2-lines'>
                {selectedCircuit?.title || 'Circuito Estándar'} • {pkg.nights} noches
              </small>
            </div>
          </div>
        </Col>

        {/* COLUMNA 2: TRANSPORTE */}
        <Col xs={12} lg={3} className='resumeSection p-3 border-lg-end bg-light-desktop'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <span className='resumeLabel text-uppercase small fw-bold text-muted'>
              {pkg.transport?.mode === 'plane' || pkg.transport?.type === 'plane' ? <FaPlane className='me-1' /> : <FaBus className='me-1' />} Transporte
            </span>
            <span className='text-muted small-action-disabled'>Incluido</span>
          </div>
          <div className='d-flex align-items-center h-75'>
            <div className='w-100'>
              <div className='d-flex justify-content-between align-items-center fw-bold text-dark mb-1 location-route'>
                <span>{pkg.origin || 'BUE'}</span>
                <span className='route-line flex-grow-1 mx-2 position-relative text-center text-muted fw-normal small'></span>
                <span>{pkg.destination || 'TYO'}</span>
              </div>
              <small className='text-muted d-block text-capitalize text-truncate'>
                {pkg.transport?.category || 'Clase económica-premium'}
              </small>
              <small className='text-success d-block fw-semibold mt-1 text-truncate'>
                <FaCheckCircle size={12} /> Equipaje de mano incluido
              </small>
            </div>
          </div>
        </Col>

        {/* COLUMNA 3: SALIDA Y EXTRAS */}
        <Col xs={12} lg={3} className='resumeSection p-3 border-lg-end'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <span className='resumeLabel text-uppercase small fw-bold text-muted'>
              <FaCalendarAlt className='me-1' /> Salida y Extras
            </span>
            <Button 
              variant='link' 
              className='p-0 text-decoration-none small-action-btn'
              onClick={() => scrollToSection('.circuitsContainer')}
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
                onClick={() => scrollToSection('.circuitsContainer')}
              >
                Ver más
              </Button>
            </div>
          </div>
        </Col>

        {/* COLUMNA 4: TARIFA Y ACCIÓN (TEXTOS IZQUIERDA Y CUADRO AJUSTADO) */}
        <Col xs={12} lg={3} className='resumeSection p-3 bg-action-section d-flex flex-column justify-content-center align-items-center align-items-lg-start'>
          <div className=' price-block-wrapper mb-2 text-center text-lg-start'>
            <span className='resumeLabel d-block text-uppercase small fw-bold text-muted '>
              <FaInfoCircle className='me-1' /> Tarifa Final
            </span>
            <h3 className='mb-0 fw-black text-dark price-display'>
              {currencySymbol} {selectedCircuit?.price?.toLocaleString('es-AR')}
            </h3>
            <small className='text-muted d-block base-text mt-1'>
              Final por persona en base doble
            </small>
          </div>
          <Button 
            href={whatsappUrl}
            target='_blank'
            variant='danger' 
            className='w-100 py-2 btn-despegar-style mt-auto d-flex align-items-center justify-content-center gap-2'
            style={{ maxWidth: '100%' }} // Evita que el botón se estire de forma infinita en pantallas grandes
          >
            <FaWhatsapp size={18} /> Consultar Viaje
          </Button>
        </Col>

      </Row>
    </div>
  )
}

export default PackageResumeBar