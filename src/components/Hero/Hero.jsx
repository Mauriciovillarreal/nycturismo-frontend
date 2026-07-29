import React, { useEffect, useState } from 'react';
import { Container, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import SearchBar from '../SearchBar/SearchBar.jsx'; 
import { FaPlane, FaHotel, FaSuitcaseRolling } from 'react-icons/fa';
import '../Hero/Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  // --- ESTADOS DE SELECCIÓN ---
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  // --- ESTADOS DE DATOS ---
  const [packages, setPackages] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [dates, setDates] = useState([]);

  // --- CARGA INICIAL DE PAQUETES ---
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/packages');
        const data = Array.isArray(res.data) ? res.data : [];
        setPackages(data);

        const uniqueOrigins = [...new Set(data.map(pkg => pkg?.origin).filter(Boolean))];
        const uniqueDestinations = [...new Set(data.map(pkg => pkg?.destination).filter(Boolean))];

        setOrigins(uniqueOrigins);
        setDestinations(uniqueDestinations);
      } catch (error) {
        console.error('Error al cargar paquetes:', error);
      }
    };
    
    fetchPackages();
  }, []);

  // --- FILTRADO EN TIEMPO REAL ---
  useEffect(() => {
    if (origin && destination) {
      const filteredPackages = packages.filter(pkg =>
        pkg?.origin === origin && pkg?.destination === destination
      );

      let availableDates = [];
      filteredPackages.forEach(pkg => {
        if (pkg?.availableDates && Array.isArray(pkg.availableDates)) {
          const datesOnly = pkg.availableDates
            .filter(item => item && item.date) 
            .map(item => item.date);
            
          availableDates.push(...datesOnly);
        }
      });

      setDates([...new Set(availableDates)]);
    } else {
      setDates([]);
    }
  }, [origin, destination, packages]);

  // --- ACCIÓN: REDIRECCIÓN AL BUSCAR ---
  const handleSearch = () => {
    if (!origin || !destination) return;
    navigate(`/packages?origin=${origin}&destination=${destination}&date=${date}`);
  };

  return (
    <div className='heroWrapper'>
      
      {/* Componente de búsqueda modularizado */}
      <SearchBar 
        origin={origin} setOrigin={setOrigin}
        destination={destination} setDestination={setDestination}
        date={date} setDate={setDate}
        origins={origins} destinations={destinations} dates={dates}
        onSearch={handleSearch}
      />

      {/* SECCIÓN: BANNER PRINCIPAL CON CARRUSEL */}
      <Container fluid className='bannerContainer p-0'>
        
        <Carousel fade controls={false} indicators={false} interval={1200} className="heroCarousel">
          
          {/* SLIDE 1 */}
          <Carousel.Item>
            <div 
              className="carouselSlide" 
              style={{ backgroundImage: "url('/img/banner1.png')" }}
            >
              {/* Gradiente y contenido exclusivo para la diapositiva 1 */}
              <div className="bannerOverlayGradient"></div>
              
              <div className='overlayContent'>
                <Container>
                  <h1>
                    PAQUETES <span>TURÍSTICOS</span>
                  </h1>

                  <Container className='beneficios'>
                    <div className='beneficioItem'>
                      <FaPlane className='beneficioIcon' /> <span>Vuelos</span>
                    </div>
                    <div className='beneficioItem'>
                      <FaHotel className='beneficioIcon' /> <span>Hoteles</span>
                    </div>
                    <div className='beneficioItem'>
                      <FaSuitcaseRolling className='beneficioIcon' /> <span>Asistencia</span>
                    </div>
                  </Container>
                </Container>
              </div>
            </div>
          </Carousel.Item>

          {/* SLIDE 2 */}
          <Carousel.Item>
            <div 
              className="carouselSlide" 
              style={{ backgroundImage: "url('/img/banner2.jpg')" }}
            >
              {/* Gradiente opcional para slide 2 */}
              <div className="bannerOverlayGradient"></div>

              {/* Aquí puedes poner otro título o texto personalizado para el Banner 2 si lo deseas */}
              <div className='overlayContent'>
                <Container>
                  <h1>
                    VERANO 2027<span>ANTICIPATE</span>
                  </h1>
                </Container>
              </div>
            </div>
          </Carousel.Item>

        </Carousel>

      </Container>

    </div>
  );
};

export default Hero;