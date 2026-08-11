import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaSuitcaseRolling,
  FaCoffee,
  FaRoute,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';
import '../PackageCard/PackageCard.css';

const PackageCard = ({ pkg, calculatedPrice, currencySymbol: propSymbol }) => {
  // ===========================
  // EVALUAR SI ES MINITURISMO
  // ===========================
  const isDayTrip =
    pkg.category?.toLowerCase() === 'miniturismo' ||
    pkg.nights === 0 ||
    pkg.nights === '0';

  // ===========================
  // MONEDA Y SÍMBOLO
  // ===========================
  const isUsdOnly =
    Array.isArray(pkg.acceptedCurrencies) &&
    pkg.acceptedCurrencies.includes('USD') &&
    !pkg.acceptedCurrencies.includes('ARS');

  const getCurrencySymbol = () => {
    if (propSymbol) return propSymbol;
    if (isUsdOnly || pkg.currency === 'USD') return 'US$ ';
    return '$ ';
  };

  const currencySymbol = getCurrencySymbol();

  // ===========================
  // PRECIO MÁS BAJO (EXTRACCIÓN ROBUSTA)
  // ===========================
  const getLowestPrice = () => {
    // 1. Si viene precalculado desde el componente padre
    if (typeof calculatedPrice === 'number' && calculatedPrice > 0) {
      return calculatedPrice;
    }

    const prices = [];

    pkg.circuits?.forEach((circuit) => {
      circuit.hotels?.forEach((hotel) => {
        hotel.departures?.forEach((departure) => {
          departure.prices?.forEach((price) => {
            // A) Estructura moderna 'amounts'
            if (price.amounts) {
              const usdVal = Number(price.amounts.usd);
              const arsVal = Number(price.amounts.ars);

              if (isUsdOnly) {
                if (!isNaN(usdVal) && usdVal > 0) prices.push(usdVal);
              } else {
                if (!isNaN(arsVal) && arsVal > 0) prices.push(arsVal);
                else if (!isNaN(usdVal) && usdVal > 0) prices.push(usdVal);
              }
            }
            // B) Estrategia de compatibilidad / fallback
            else {
              const usdFlat = Number(price.amountUsd);
              const mainAmount = Number(price.amount);

              if (isUsdOnly && !isNaN(usdFlat) && usdFlat > 0) {
                prices.push(usdFlat);
              } else if (!isNaN(mainAmount) && mainAmount > 1) {
                prices.push(mainAmount);
              }
            }
          });
        });
      });
    });

    if (prices.length > 0) {
      return Math.min(...prices);
    }

    // Fallback a nivel raíz si existiera
    if (typeof pkg.price === 'number' && pkg.price > 1) {
      return pkg.price;
    }

    return null;
  };

  const lowestPrice = getLowestPrice();

  // ===========================
  // TRANSPORTE
  // ===========================
  const currentTransportMode =
    pkg.transport?.mode || pkg.transport?.type || 'bus';

  const isPlane =
    typeof currentTransportMode === 'string' &&
    ['plane', 'avion', 'avión'].includes(currentTransportMode.toLowerCase());

  // Extracción de ítems incluidos para Miniturismo
  const firstCircuitIncludes = pkg.circuits?.[0]?.includes || [];

  // =========================================================
  // RENDER: TARJETA DE MINITURISMO
  // =========================================================
  if (isDayTrip) {
    return (
      <Link to={`/packages/${pkg.slug}`} className="packageCardLink">
        <div className="miniCard">
          {/* Header con Imagen y Badge Flotante */}
          <div className="miniCardImageWrapper">
            <img
              src={pkg.images?.[0]}
              alt={pkg.title}
              className="miniCardImage"
            />
            <div className="miniCardBadge">
              <FaCalendarAlt className="me-1" /> Excursión en el día | Salidas
              programadas
            </div>
          </div>

          {/* Cuerpo del Miniturismo */}
          <div className="miniCardBody">
            <h3 className="miniCardTitle">{pkg.title}</h3>

            {/* Iconos con Etiqueta */}
            <div className="miniCardIconsRow">
              <div className="miniCardIconItem">
                <FaBus />
                <span>Traslado</span>
              </div>
              <div className="miniCardIconItem">
                <FaRoute />
                <span>Excursión</span>
              </div>
              <div className="miniCardIconItem">
                <FaCoffee />
                <span>Refrigerio</span>
              </div>
              <div className="miniCardIconItem">
                <FaSuitcaseRolling />
                <span>Coordinador</span>
              </div>
            </div>

            {/* Puntos destacados y Precio */}
            <div className="miniCardFooterRow">
              <ul className="miniCardIncludes">
                {firstCircuitIncludes.length > 0 ? (
                  firstCircuitIncludes.slice(0, 2).map((item, idx) => (
                    <li key={idx}>
                      <FaCheckCircle className="miniCheckIcon" /> {item}
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <FaCheckCircle className="miniCheckIcon" /> Viaje en el
                      día con guía
                    </li>
                    <li>
                      <FaCheckCircle className="miniCheckIcon" /> Salida desde{' '}
                      {pkg.origin || 'punto acordado'}
                    </li>
                  </>
                )}
              </ul>

              <div className="miniCardPriceCol">
                <span className="miniCardPriceLabel">Precio por persona</span>
                <h4 className="miniCardPriceValue">
                  {lowestPrice !== null
                    ? `${currencySymbol}${lowestPrice.toLocaleString('es-AR')}`
                    : 'Consultar'}
                </h4>
                <span className="miniCardTaxLabel">Lugar sujeto a disp.</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // =========================================================
  // RENDER: TARJETA TRADICIONAL
  // =========================================================
  return (
    <Link to={`/packages/${pkg.slug}`} className="packageCardLink">
      <div className="packageCard">
        <img
          src={pkg.images?.[0]}
          alt={pkg.title}
          className="packageCardImage"
        />

        <div className="packageOverlay"></div>

        <div className="packageTag">{pkg.category}</div>

        <div className="packageBody">
          <div className="packageContent">
            <h3 className="packageTitle">{pkg.title}</h3>

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