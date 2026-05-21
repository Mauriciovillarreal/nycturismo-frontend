import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaPlane, FaHotel, FaBus, FaSuitcaseRolling, FaArrowRight } from 'react-icons/fa';
import '../styles/superFeaturedPackage.css';

const SuperFeaturedPackage = ({ pkg }) => {
  // Validamos que el paquete exista de forma segura
  if (!pkg) return null;

  const firstCircuit = pkg.circuits?.[0];
  const currencySymbol = firstCircuit?.currency === 'USD' ? 'US$' : '$';

  // Lógica unificada para el icono de transporte
  const currentTransportMode = pkg.transport?.mode || pkg.transport?.type || 'bus';
  const isPlane = 
    typeof currentTransportMode === 'string' && 
    ['plane', 'avion', 'avión'].includes(currentTransportMode.toLowerCase());

  return (
    <div className="superFeaturedWrapper">
      {/* IMAGEN DE FONDO EN ALTA DEFINICIÓN */}
      <img 
        src={ 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'} 
        alt={pkg.title} 
        className="superFeaturedBg"
      />
      
      {/* CAPA DE DEGRADADO (Garantiza lectura perfecta en blanco) */}
      <div className="superFeaturedOverlay"></div>

      {/* CONTENIDO INTERNO */}
      <Container className="superFeaturedContainer">
        <div className="superFeaturedContent">
          
          {/* TAG EXCLUSIVO PREMIUM */}
          <span className="superFeaturedTag">Recomendado de la semana</span>

          {/* TÍTULO GRANDE E IMPACTANTE */}
          <h2 className="superFeaturedTitle">{pkg.title}</h2>

          {/* DETALLES DE DURACIÓN Y TRANSPORTE */}
          <div className="superFeaturedDetails">
            <span className="superFeaturedBadge">
              {pkg.days} días / {pkg.nights} noches
            </span>
            <span className="superFeaturedTransportText">
              {isPlane ? <FaPlane className="me-2" /> : <FaBus className="me-2" />}
              {isPlane ? 'Aéreo Incluido' : 'Bus Semi-Cama'}
            </span>
          </div>

    

          {/* BLOQUE DE PRECIO Y BOTÓN DE ACCIÓN */}
          <div className="superFeaturedFooter">
            <div className="superFeaturedPriceBox">
              <span className="priceLabelBase">Precio por persona en base doble</span>
              <h3 className="priceValueBase">
                {currencySymbol}{firstCircuit?.price?.toLocaleString('es-AR') || 'Consulte'}
              </h3>
            </div>

            <Link to={`/packages/${pkg.slug}`} className="superFeaturedBtn">
              Ver Detalle del Viaje <FaArrowRight className="ms-2" />
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default SuperFeaturedPackage;