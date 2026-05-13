import React from 'react'
import { Link } from 'react-router-dom'


import {
  FaPlane,
  FaHotel,
  FaBus,
  FaSuitcaseRolling
} from 'react-icons/fa'

import '../styles/packageCard.css'
import { Container } from 'react-bootstrap'

const PackageCard = ({ pkg }) => {

  return (

    <Container>

      <Link
      to={`/packages/${pkg.slug}`}
      className="packageCardLink"
    >

      <div className="packageCard">

        <img
          src={pkg.images[0]}
          alt={pkg.title}
          className="packageCardImage"
        />

        <div className="packageOverlay"></div>

        <div className="packageTag">
          paquete
        </div>

        <div className="packageBody">

          <div className="packageContent">

            <h3 className="packageTitle">
              {pkg.title}
            </h3>

            <div className="packageDate">
              {pkg.duration} noches | salidas disponibles
            </div>

            <div className="packageIcons">
              <FaPlane />
              <FaBus />
              <FaHotel />
              <FaSuitcaseRolling />
            </div>

          </div>

          <div className="packageFooter">

            <h5>
              $ {pkg.price}
            </h5>

          </div>

        </div>

      </div>

    </Link>
    </Container>
  )
}

export default PackageCard