import React from 'react'

import { Link } from 'react-router-dom'

import {
  FaPlane,
  FaHotel,
  FaBus,
  FaSuitcaseRolling
} from 'react-icons/fa'

import '../styles/packageCard.css'

const PackageCard = ({ pkg }) => {

  const firstCircuit = pkg.circuits?.[0]

  const currencySymbol =
    firstCircuit?.currency === 'USD'
      ? 'US$'
      : '$'

  // Centralizamos la lógica de transporte (revisando mode, type y normalizando el texto)
  const currentTransportMode = pkg.transport?.mode || pkg.transport?.type || 'bus'
  
  const isPlane = 
    typeof currentTransportMode === 'string' && 
    ['plane', 'avion', 'avión'].includes(currentTransportMode.toLowerCase())

  return (

    <Link
      to={`/packages/${pkg.slug}`}
      className="packageCardLink"
    >

      <div className="packageCard">

        {/* IMAGE */}

        <img
          src={pkg.images?.[0]}
          alt={pkg.title}
          className="packageCardImage"
        />

        <div className="packageOverlay"></div>

        {/* CATEGORY */}

        <div className="packageTag">
          {pkg.category}
        </div>

        {/* BODY */}

        <div className="packageBody">

          <div className="packageContent">

            <h3 className="packageTitle">
              {pkg.title}
            </h3>

            {/* DURACION */}

            <div className="packageDate">

              {pkg.days} días
              {' • '}
              {pkg.nights} noches

            </div>

            {/* ICONOS */}

            <div className="packageIcons">

              {
                isPlane 
                  ? <FaPlane />
                  : <FaBus />
              }

              <FaHotel />

              <FaSuitcaseRolling />

            </div>

            {/* TRANSPORTE */}

            <div className="packageTransport">

              {
                isPlane 
                  ? 'Avión'
                  : 'Bus'
              }

              {' • '}

              {pkg.transport?.category || 'Sin especificar'}

            </div>

          </div>

          {/* FOOTER */}

          <div className="packageFooter">

            <span>
              Desde
            </span>

            <h5>
              
              {currencySymbol}
              {' '}
              {firstCircuit?.price?.toLocaleString('es-AR') || 0}
            </h5>

          </div>

        </div>

      </div>

    </Link>

  )
}

export default PackageCard