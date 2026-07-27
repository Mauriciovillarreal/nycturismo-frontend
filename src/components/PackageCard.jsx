import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaHotel, FaBus, FaSuitcaseRolling } from 'react-icons/fa';
import '../styles/packageCard.css';

const PackageCard = ({ pkg }) => {

  // ===========================
  // MONEDA
  // ===========================

  const currencySymbol = pkg.currency === 'USD' ? 'US$' : '$';

  // ===========================
  // PRECIO MÁS BAJO
  // ===========================

  const getLowestPrice = () => {
    const prices = [];

    pkg.circuits?.forEach(circuit => {
      circuit.hotels?.forEach(hotel => {
        hotel.departures?.forEach(departure => {
          departure.prices?.forEach(price => {
            if (typeof price.amount === 'number') {
              prices.push(price.amount);
            }
          });
        });
      });
    });

    return prices.length ? Math.min(...prices) : null;
  };

  const lowestPrice = getLowestPrice();

  // ===========================
  // TRANSPORTE
  // ===========================

  const currentTransportMode =
    pkg.transport?.mode ||
    pkg.transport?.type ||
    'bus';

  const isPlane =
    typeof currentTransportMode === 'string' &&
    ['plane', 'avion', 'avión'].includes(
      currentTransportMode.toLowerCase()
    );

  return (
    <Link
      to={`/packages/${pkg.slug}`}
      className="packageCardLink"
    >
      <div className="packageCard">

        {/* Imagen */}
        <img
          src={pkg.images?.[0]}
          alt={pkg.title}
          className="packageCardImage"
        />

        <div className="packageOverlay"></div>

        {/* Categoría */}
        <div className="packageTag">
          {pkg.category}
        </div>

        {/* Contenido */}
        <div className="packageBody">

          <div className="packageContent">

            <h3 className="packageTitle">
              {pkg.title}
            </h3>

            <div className="packageDate">
              {pkg.days} días • {pkg.nights} noches
            </div>

            <div className="packageIcons">
              {isPlane ? <FaPlane /> : <FaBus />}
              <FaHotel />
              <FaSuitcaseRolling />
            </div>

            <div className="packageTransport">
              {isPlane ? 'Avión' : 'Bus'} •{' '}
              {pkg.transport?.category || 'Sin especificar'}
            </div>

          </div>

          {/* Precio */}
          <div className="packageFooter">
            <span>Desde</span>

            <h5>
              {lowestPrice !== null
                ? `${currencySymbol}${lowestPrice.toLocaleString('es-AR')}`
                : 'Consultar'}
            </h5>
          </div>

        </div>

      </div>
    </Link>
  );
};

export default PackageCard;