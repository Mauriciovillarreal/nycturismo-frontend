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
  FaPlane
} from 'react-icons/fa'

import { useParams } from 'react-router-dom'

import Loader from '../components/Loader'
import api from '../services/api'

import '../styles/packageDetail.css'

const PackageDetail = () => {

  const { slug } = useParams()

  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedCircuit, setSelectedCircuit] = useState(null)

  useEffect(() => {
    fetchPackage()
  }, [slug])

  const fetchPackage = async () => {

    try {

      const res = await api.get(`/packages/${slug}`)

      setPkg(res.data)

      if (res.data.circuits?.length > 0) {
        setSelectedCircuit(res.data.circuits[0])
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

  const phone = '5491123456789'

  const whatsappText = encodeURIComponent(
    `Hola, quiero consultar por el paquete ${pkg.title} a ${pkg.destination}`
  )

  const whatsappUrl =
    `https://wa.me/${phone}?text=${whatsappText}`

  const currencySymbol =
    selectedCircuit?.currency === 'USD'
      ? 'US$'
      : '$'

  return (

    <section className='packageDetailPage'>

      {/* ===== TOP RESUME BAR ===== */}

      <Container className='packageResumeBar'>

        {/* ALOJAMIENTO */}

        <div className='resumeItem'>

          <span className='resumeLabel'>
            Alojamiento
          </span>

          <div className='resumeContent'>

            <img
              src={pkg.images?.[0]}
              alt={pkg.title}
              className='resumeThumb'
            />

            <div>

              <h4>
                {selectedCircuit?.title}
              </h4>

              <p>
                {pkg.nights} noches
              </p>

            </div>

          </div>

        </div>

        {/* TRANSPORTE */}

        <div className='resumeItem'>

          <span className='resumeLabel'>
            Transporte
          </span>

          <div className='resumeTransport'>

            {
              pkg.transport?.type === 'bus'
                ? <FaBus />
                : <FaPlane />
            }

            <div>

              <h4>

                {pkg.origin}

                {' → '}

                {pkg.destination}

              </h4>

              <p>
                {pkg.transport?.category}
              </p>

            </div>

          </div>

        </div>

        {/* FECHAS */}

        <div className='resumeItem'>

          <span className='resumeLabel'>
            Salidas
          </span>

          <div>

            <p className='dateTopDetail'>
              {pkg.availableDates?.length || 0} fechas
            </p>

            <p>
              Consultar disponibilidad
            </p>

          </div>

        </div>

        {/* PRECIO */}

        <div className='resumePriceBox'>

          <span>
            Precio final por persona
          </span>

          <h2>

            {currencySymbol}

            {' '}

            {selectedCircuit?.price?.toLocaleString('es-AR')}

          </h2>

    

          <Button
            href={whatsappUrl}
            target='_blank'
            className='resumeButton'
          >

            <FaWhatsapp />

            {' '}

            Consultar

          </Button>

        </div>

      </Container>

      {/* ===== GALERIA + CARD ===== */}

      <Container className='galleryWrapper'>

        <div className='galleryContent'>

          {/* LEFT GALLERY */}

          <div className='gallerySection'>

            <div className='mainImage'>

              <img
                src={pkg.images?.[0]}
                alt={pkg.title}
              />

            </div>

            <div className='sideImages'>

              {pkg.images?.slice(1, 5).map((img, index) => (

                <img
                  key={index}
                  src={img}
                  alt={pkg.title}
                />

              ))}

            </div>

          </div>

          {/* RIGHT PRICE CARD */}

          <div className='floatingCard'>

            <div className='floatingTop'>

              <span className='flightText'>
                {
                  pkg.transport?.type === 'plane'
                    ? 'Vuelo + Alojamiento'
                    : 'Bus + Alojamiento'
                }
              </span>

            </div>

            <h3 className='roomTitle'>
              {selectedCircuit?.title}
            </h3>

            <p className='roomDescription'>
              {selectedCircuit?.description || 'Paquete turístico completo'}
            </p>






            <div className="roomDescription">

              <span>Destino</span>

              <p>{pkg.destination}</p>

            </div>

            <div className="roomDescription">

              <span>Origen</span>

              <p>{pkg.origin}</p>

            </div>

            <div className="roomDescription">

              <span>Duración</span>

              <p>
                {pkg.days} días / {pkg.nights} noches
              </p>

            </div>

            <div className="roomDescription bottomSpace">

              <span>Transporte</span>

              <p>

                {
                  pkg.transport?.type === 'bus'
                    ? <FaBus />
                    : <FaPlane />
                }

                {' '}

                {pkg.transport?.type}

                {' - '}

                {pkg.transport?.category}

              </p>

            </div>







            <span className='priceLabel'>
              Valor por persona en base doble
            </span>






            <h2 className='mainPrice'>

              {currencySymbol}

              {' '}

              {selectedCircuit?.price?.toLocaleString('es-AR')}

            </h2>



            <Button
              href={whatsappUrl}
              target='_blank'
              className='roomsButton'
            >

              <FaWhatsapp />

              {' '}

              Consultar disponibilidad

            </Button>

          </div>

        </div>

      </Container>

      {/* ===== CONTENIDO ===== */}

      <Container className='packageDetailContent'>

        <Row>

          {/* LEFT */}

          <Col lg={8}>



            {/* DESCRIPCIÓN */}

            <div className="detailBox">

              <h1 className='packageTitleDetail'>
                {pkg.title}
              </h1>
              <p className='detailDescription'>
                {pkg.description}
              </p>

            </div>

            {/* CIRCUITOS */}

            {pkg.circuits?.length > 0 && (

              <div className="detailBox">
                <div className='circuitsContainer'>

                  {pkg.circuits.map((circuit, index) => (

                    <div
                      key={index}
                      className={`circuitCard ${selectedCircuit?.title === circuit.title
                        ? 'activeCircuit'
                        : ''
                        }`}
                      onClick={() => setSelectedCircuit(circuit)}
                    >

                      <h4>
                        {circuit.title}
                      </h4>

                      <p>
                        {circuit.description}
                      </p>

                      <strong>

                        {
                          circuit.currency === 'USD'
                            ? 'US$'
                            : '$'
                        }

                        {' '}

                        {circuit.price?.toLocaleString('es-AR')}

                      </strong>

                    </div>

                  ))}

                </div>

              </div>

            )}

            {/* TARIFAS */}

            <div className="detailBox">



              <table className='datesTable'>

                <thead>

                  <tr>

                    <th>Salida</th>

                    <th>Duración</th>

                    <th>Precio</th>

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
                        {pkg.days} días / {pkg.nights} noches
                      </td>

                      <td className='priceText'>

                        {currencySymbol}

                        {' '}

                        {selectedCircuit?.price?.toLocaleString('es-AR')}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* INCLUYE */}

            <div className="detailBox">

              {selectedCircuit?.includes?.length > 0 ? (

                <div className='includesGrid'>

                  {selectedCircuit.includes.map((item, index) => (

                    <div
                      key={index}
                      className='includeItem'
                    >

                      <div className='includeIcon'>
                        ✓
                      </div>

                      <p>
                        {item}
                      </p>

                    </div>

                  ))}

                </div>

              ) : (

                <p>No especificado</p>

              )}

            </div>

          </Col>

          {/* RIGHT */}




        </Row>

      </Container>

    </section>
  )
}

export default PackageDetail