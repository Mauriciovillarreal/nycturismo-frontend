import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Collapse } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPlaneDeparture, FaCalendarAlt, FaSearch } from 'react-icons/fa';

import '../styles/searchBar.css'

const SearchBar = ({ 
  origin, setOrigin, 
  destination, setDestination, 
  date, setDate, 
  origins, destinations, dates, 
  onSearch 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
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
                  {dates.map((item, index) => {
                    const validDate = new Date(item);
                    return (
                      <option key={index} value={item}>
                        {!isNaN(validDate) ? validDate.toLocaleDateString('es-AR') : 'Fecha inválida'}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
            </Col>

            {/* Botón de envío */}
            <Col lg={3}>
              <Button
                className='searchButton'
                onClick={onSearch}
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
                {dates.map((item, index) => {
                  const validDate = new Date(item);
                  return (
                    <option key={index} value={item}>
                      {!isNaN(validDate) ? validDate.toLocaleDateString('es-AR') : 'Fecha inválida'}
                    </option>
                  );
                })}
              </Form.Select>
            </div>

            {/* Móvil Botón */}
            <Button
              className='searchButton'
              onClick={onSearch}
              disabled={!origin || !destination}
            >
              <FaSearch /> Buscar
            </Button>
          </Form>
        </div>
      </Collapse>
    </div>
  );
};

export default SearchBar;