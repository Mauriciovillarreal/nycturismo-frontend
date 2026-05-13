import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap'
import { FaWhatsapp } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import Loader from '../components/Loader'
import api from '../services/api'

import '../styles/packageDetail.css'

const PackageDetail = () => {

  const { slug } = useParams()

  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackage()
  }, [slug])

  const fetchPackage = async () => {

    try {

      const res = await api.get(`/packages/${slug}`)

      setPkg(res.data)

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

  const phone = '5491123456789'

  const whatsappText = encodeURIComponent(
    `Hola, quiero consultar por el paquete ${pkg.title} a ${pkg.destination}`
  )

  const whatsappUrl =
    `https://wa.me/${phone}?text=${whatsappText}`

  return (

    <Container className='packageDetail'>

      <Row>

        {/* LEFT */}
        <Col lg={8} className='packageContent'>
          <h2 className='packageTitle'>
            {pkg.title}
          </h2>
          <img
            src={pkg.images[0]}
            alt={pkg.title}
            className='detailImage'
          />

          {/* DESCRIPCION */}
          <div className="detailBox">

            <h3 className='detailBoxTitle'>
              Descripción
            </h3>

            <p className='detailDescription'>
              {pkg.description}
            </p>

          </div>

          {/* FECHAS */}
          <div className="detailBox">

            <h3 className='detailBoxTitle'>
              Tarifas
            </h3>

            <table className='datesTable'>

              <thead>

                <tr>
                  <th>Salidas disponibles</th>
                  <th>Duración</th>
                  <th>Precio Total</th>
                </tr>

              </thead>

              <tbody>

                {pkg.availableDates?.map((date, index) => (

                  <tr key={index}>

                    <td>
                      {
                        new Date(date).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      }
                    </td>

                    <td>
                      {pkg.duration} noches
                    </td>

                    <td className='priceText'>
                      $ {pkg.price}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* INCLUYE */}
          <div className="detailBox">

            <h3 className='detailBoxTitle'>
              Servicios incluidos
            </h3>

            {pkg.includes?.length > 0 ? (

              <ul className='includesList'>

                {pkg.includes.map((item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                ))}

              </ul>

            ) : (

              <p>No especificado</p>

            )}

          </div>

        </Col>

        {/* RIGHT */}
        <Col lg={4}>

          <div className="sidebarCard">

            <h2 className='sidebarTitle'>
              Detalle del paquete
            </h2>

            <div className="sidebarInfo">

              <span>Destino</span>

              <p>{pkg.destination}</p>

            </div>

            <div className="sidebarInfo">

              <span>Desde</span>

              <p>{pkg.origin}</p>

            </div>

            <div className="sidebarInfo">

              <span>Noches</span>

              <p>{pkg.duration}</p>

            </div>

          </div>

          <div className="sidebarCard">

            <div className="totalPrice">

              <span>Precio total por persona</span>

              <h3>
                $ {pkg.price}
              </h3>

            </div>

          </div>

          <div className="sidebarCard">

            <h3 className='detailBoxTitle'>
              Comunicate con nosotros
            </h3>

            <div className="contactButtons">

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className='circleButton whatsappCircle'
              >
                <FaWhatsapp />
              </a>

            </div>

          </div>

        </Col>

      </Row>

    </Container>
  )
}

export default PackageDetail