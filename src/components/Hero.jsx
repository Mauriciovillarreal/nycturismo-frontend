import React, { useEffect, useState } from 'react'
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Collapse
} from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'
import api from '../services/api'

import {
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaCalendarAlt,
  FaSearch
} from 'react-icons/fa'

import '../styles/hero.css'

const Hero = () => {

  const navigate = useNavigate()

  const [packages, setPackages] = useState([])

  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')

  const [origins, setOrigins] = useState([])
  const [destinations, setDestinations] = useState([])
  const [dates, setDates] = useState([])

  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {

    try {

      const res = await api.get('/packages')
      console.log(res.data)
      setPackages(res.data)

      const uniqueOrigins = [
        ...new Set(res.data.map(pkg => pkg.origin))
      ]

      const uniqueDestinations = [
        ...new Set(res.data.map(pkg => pkg.destination))
      ]

      setOrigins(uniqueOrigins)
      setDestinations(uniqueDestinations)

    } catch (error) {

      console.error(error)

    }
  }

  useEffect(() => {

    if (origin && destination) {

      const filteredPackages = packages.filter(pkg =>
        pkg.origin === origin &&
        pkg.destination === destination
      )

      let availableDates = []

      filteredPackages.forEach(pkg => {
        availableDates.push(...pkg.availableDates)
      })

      const uniqueDates = [...new Set(availableDates)]

      setDates(uniqueDates)

    } else {

      setDates([])

    }

  }, [origin, destination, packages])

  const handleSearch = () => {

    if (!origin || !destination) return

    navigate(
      `/packages?origin=${origin}&destination=${destination}&date=${date}`
    )
  }

  return (

    <div className='heroWrapper'>

      {/* BUSCADOR */}
      <div className="heroSearchContainer">

        <div>

          {/* MOBILE BUTTON */}
          <div
            className="mobileMenuButton d-lg-none"
            onClick={() => setShowFilters(!showFilters)}
          >

            <span className={showFilters ? 'line open1' : 'line'}></span>
            <span className={showFilters ? 'line open2' : 'line'}></span>
            <span className={showFilters ? 'line open3' : 'line'}></span>

          </div>
          {/* DESKTOP */}
          <Container className="d-none d-lg-block w-100">

            <Form className="searchBar">

              <Row className="g-3 align-items-center">

                {/* ORIGEN */}
                <Col lg={3}>

                  <div className="selectWrapper">

                    <FaPlaneDeparture className="selectIcon" />

                    <Form.Select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="customSelect"
                    >

                      <option value="">Origen</option>

                      {origins.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}

                    </Form.Select>

                  </div>

                </Col>

                {/* DESTINO */}
                <Col lg={3}>

                  <div className="selectWrapper">

                    <FaMapMarkerAlt className="selectIcon" />

                    <Form.Select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="customSelect"
                    >

                      <option value="">Destino</option>

                      {destinations.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}

                    </Form.Select>

                  </div>

                </Col>

                {/* FECHA */}
                <Col lg={3}>

                  <div className="selectWrapper">

                    <FaCalendarAlt className="selectIcon" />

                    <Form.Select
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="customSelect"
                    >

                      <option value="">Fechas disponibles</option>

                      {dates.map((item, index) => (
                        <option key={index} value={item}>
                          {new Date(item).toLocaleDateString('es-AR')}
                        </option>
                      ))}

                    </Form.Select>

                  </div>

                </Col>

                {/* BOTON */}
                <Col lg={3}>

                  <Button
                    className="searchButton"
                    onClick={handleSearch}
                    disabled={!origin || !destination}
                  >

                    <FaSearch />

                    Buscar

                  </Button>

                </Col>

              </Row>

            </Form>

          </Container>

          {/* MOBILE */}
          <Collapse in={showFilters}>

            <div className="d-lg-none mobileSearchMenu">

              <Form className="searchBarMobile">

                {/* ORIGEN */}
                <div className="selectWrapper mb-2">

                  <FaPlaneDeparture className="selectIcon" />

                  <Form.Select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="customSelect"
                  >

                    <option value="">Origen</option>

                    {origins.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}

                  </Form.Select>

                </div>

                {/* DESTINO */}
                <div className="selectWrapper mb-2">

                  <FaMapMarkerAlt className="selectIcon" />

                  <Form.Select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="customSelect"
                  >

                    <option value="">Destino</option>

                    {destinations.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}

                  </Form.Select>

                </div>

                {/* FECHA */}
                <div className="selectWrapper mb-3">

                  <FaCalendarAlt className="selectIcon" />

                  <Form.Select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="customSelect"
                  >

                    <option value="">Fecha</option>

                    {dates.map((item, index) => (
                      <option key={index} value={item}>
                        {new Date(item).toLocaleDateString()}
                      </option>
                    ))}

                  </Form.Select>

                </div>

                {/* BOTON */}
                <Button
                  className="searchButton"
                  onClick={handleSearch}
                  disabled={!origin || !destination}
                >

                  <FaSearch />

                  Buscar

                </Button>

              </Form>

            </div>

          </Collapse>

        </div>

      </div>

      {/* BANNER */}
      <Container fluid className='banner bannerMovile'>

        <div >
          <Container className="bannerContent">

            <h1>Descubre tu próximo destino</h1>
            <p>los mejores destinos turísticos con nuestros paquetes especiales.</p>
            <p>Leg. 7865 D.N.T 276/92</p>
          </Container>
        </div>

      </Container>

    </div>
  )
}

export default Hero