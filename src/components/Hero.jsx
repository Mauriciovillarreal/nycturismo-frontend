import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaCalendarAlt,
  FaSearch,
  FaPlane,
  FaHotel,
  FaBus,
  FaSuitcaseRolling
} from 'react-icons/fa';
import '../styles/hero.css';

const Hero = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [packages, setPackages] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const [origins, setOrigins] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [dates, setDates] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // --- EFFECT: CARGA INICIAL DE PAQUETES ---
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages');
      setPackages(res.data);

      const uniqueOrigins = [...new Set(res.data.map(pkg => pkg.origin))];
      const uniqueDestinations = [...new Set(res.data.map(pkg => pkg.destination))];

      setOrigins(uniqueOrigins);
      setDestinations(uniqueDestinations);
    } catch (error) {
      console.error(error);
    }
  };

  // --- EFFECT: FILTRADO DE FECHAS SEGÚN ORIGEN Y DESTINO ---
  useEffect(() => {
    if (origin && destination) {
      const filteredPackages = packages.filter(pkg =>
        pkg.origin === origin && pkg.destination === destination
      );

      let availableDates = [];
      filteredPackages.forEach(pkg => {
        availableDates.push(...pkg.availableDates);
      });

      const uniqueDates = [...new Set(availableDates)];
      setDates(uniqueDates);
    } else {
      setDates([]);
    }
  }, [origin, destination, packages]);

  // --- ACCIÓN: BUSCAR ---
  const handleSearch = () => {
    if (!origin || !destination) return;
    navigate(`/packages?origin=${origin}&destination=${destination}&date=${date}`);
  };

  return (
    <div className='heroWrapper'>

      {/* ==========================================
         SECCIÓN: BUSCADOR GENERAL (CONTAINER)
         ========================================== */}
      <div className='heroSearchContainer'>

        {/* BOTÓN HAMBURGUESA (Solo Móvil) */}
        <div
          className='mobileMenuButton d-lg-none'
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className={showFilters ? 'line open1' : 'line'}></span>
          <span className={showFilters ? 'line open2' : 'line'}></span>
          <span className={showFilters ? 'line open3' : 'line'}></span>
        </div>

        {/* BUSCADOR ESCRITORIO (Oculto en móvil) */}
        <Container className='d-none d-lg-block'>
          <Form className='searchBar'>
            <Row className='g-3 align-items-center'>

              {/* Selector: Origen */}
              <Col lg={3}>
                <div className='selectWrapper'>
                  <FaPlaneDeparture className='selectIcon' />
                  <Form.Select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className='customSelect'
                  >
                    <option value=''>Origen</option>
                    {origins.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </Form.Select>
                </div>
              </Col>

              {/* Selector: Destino */}
              <Col lg={3}>
                <div className='selectWrapper'>
                  <FaMapMarkerAlt className='selectIcon' />
                  <Form.Select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className='customSelect'
                  >
                    <option value=''>Destino</option>
                    {destinations.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </Form.Select>
                </div>
              </Col>

              {/* Selector: Fecha */}
              <Col lg={3}>
                <div className='selectWrapper'>
                  <FaCalendarAlt className='selectIcon' />
                  <Form.Select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className='customSelect'
                  >
                    <option value=''>Fechas disponibles</option>
                    {dates.map((item, index) => (
                      <option key={index} value={item}>
                        {new Date(item).toLocaleDateString('es-AR')}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>

              {/* Botón de envío */}
              <Col lg={3}>
                <Button
                  className='searchButton'
                  onClick={handleSearch}
                  disabled={!origin || !destination}
                >
                  <FaSearch /> Buscar
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>

        {/* BUSCADOR DESPLEGABLE MÓVIL (Oculto en Escritorio) */}
        <Collapse in={showFilters}>
          <div className='d-lg-none mobileSearchMenu'>
            <Form className='searchBarMobile'>

              {/* Móvil Origen */}
              <div className='selectWrapper mb-2'>
                <FaPlaneDeparture className='selectIcon' />
                <Form.Select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className='customSelect'
                >
                  <option value=''>Origen</option>
                  {origins.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </div>

              {/* Móvil Destino */}
              <div className='selectWrapper mb-2'>
                <FaMapMarkerAlt className='selectIcon' />
                <Form.Select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className='customSelect'
                >
                  <option value=''>Destino</option>
                  {destinations.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </div>

              {/* Móvil Fecha */}
              <div className='selectWrapper mb-3'>
                <FaCalendarAlt className='selectIcon' />
                <Form.Select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className='customSelect'
                >
                  <option value=''>Fecha</option>
                  {dates.map((item, index) => (
                    <option key={index} value={item}>
                      {new Date(item).toLocaleDateString('es-AR')}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Móvil Botón */}
              <Button
                className='searchButton'
                onClick={handleSearch}
                disabled={!origin || !destination}
              >
                <FaSearch /> Buscar
              </Button>
            </Form>
          </div>
        </Collapse>

      </div>

      {/* ==========================================
         SECCIÓN: BANNER PRINCIPAL DE FONDO
         ========================================== */}
      <Container fluid className='bannerMobile'>
        <div className='overlayContent'>
          <Container fluid>
            <h1>
              PAQUETES <span>TURÍSTICOS</span>
            </h1>

            {/* Beneficios con los íconos de la biblioteca pintados de blanco */}
            <div className='beneficios'>
              <div className='beneficioItem'>
                <FaPlane className='beneficioIcon' /> <span>Vuelos</span>
              </div>

              <div className='beneficioItem'>
                <FaHotel className='beneficioIcon' /> <span>Hoteles</span>
              </div>

              <div className='beneficioItem'>
                <FaBus className='beneficioIcon' /> <span>Traslados</span>
              </div>

              <div className='beneficioItem'>
                <FaSuitcaseRolling className='beneficioIcon' /> <span>Asistencia</span>
              </div>
            </div>
          </Container>
        </div>
      </Container>

    </div>
  );
};

export default Hero;