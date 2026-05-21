import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaHotel, FaBus, FaSuitcaseRolling } from 'react-icons/fa';
import '../styles/packageCard.css';

const PackageCard = ({ pkg }) => {
  // Obtención del primer circuito para extraer la moneda y el precio base
  const firstCircuit = pkg.circuits?.[0];
  const currencySymbol = firstCircuit?.currency === 'USD' ? 'US$' : '$';

  // Centralización y normalización de la lógica de transporte
  const currentTransportMode = pkg.transport?.mode || pkg.transport?.type || 'bus';
  const isPlane = 
    typeof currentTransportMode === 'string' && 
    ['plane', 'avion', 'avión'].includes(currentTransportMode.toLowerCase());

  return (
    <Link to={`/packages/${pkg.slug}`} className="packageCardLink">
      <div className="packageCard">
        
        {/* IMAGEN DE FONDO DE LA TARJETA */}
        <img
          src={pkg.images?.[0]}
          alt={pkg.title}
          className="packageCardImage"
        />
        <div className="packageOverlay"></div>

        {/* ETIQUETA SUPERIOR: CATEGORÍA */}
        <div className="packageTag">
          {pkg.category}
        </div>

        {/* CUERPO DE LA TARJETA */}
        <div className="packageBody">
          <div className="packageContent">
            
            {/* Título del paquete */}
            <h3 className="packageTitle">
              {pkg.title}
            </h3>

            {/* Pastilla de Duración */}
            <div className="packageDate">
              {pkg.days} días • {pkg.nights} noches
            </div>

            {/* Iconos de Servicios Incluidos */}
            <div className="packageIcons">
              {isPlane ? <FaPlane /> : <FaBus />}
              <FaHotel />
              <FaSuitcaseRolling />
            </div>

            {/* Descripción del Transporte */}
            <div className="packageTransport">
              {isPlane ? 'Avión' : 'Bus'} • {pkg.transport?.category || 'Sin especificar'}
            </div>

          </div>

          {/* PIE DE LA TARJETA: PRECIO BASE */}
          <div className="packageFooter">
            <span>Desde</span>
            <h5>
              {currencySymbol}{firstCircuit?.price?.toLocaleString('es-AR') || 0}
            </h5>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default PackageCard;