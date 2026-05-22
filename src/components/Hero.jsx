import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SearchBar from './SearchBar'; 
import { FaPlane, FaHotel, FaSuitcaseRolling } from 'react-icons/fa';
import '../styles/hero.css';

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
        // Nos aseguramos de que res.data sea un array, si no ponemos array vacío
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

  // --- FILTRADO EN TIEMPO REAL (CON DEFENSAS EXTREMAS) ---
  useEffect(() => {
    if (origin && destination) {
      const filteredPackages = packages.filter(pkg =>
        pkg?.origin === origin && pkg?.destination === destination
      );

      let availableDates = [];
      filteredPackages.forEach(pkg => {
        // Validamos con Optional Chaining que exista el array
        if (pkg?.availableDates && Array.isArray(pkg.availableDates)) {
          // Filtramos primero los items válidos que tengan la propiedad .date antes de mapear
          const datesOnly = pkg.availableDates
            .filter(item => item && item.date) 
            .map(item => item.date);
            
          availableDates.push(...datesOnly);
        }
      });

      // Eliminamos duplicados de las fechas planas
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

      {/* SECCIÓN: BANNER PRINCIPAL DE FONDO */}
      <Container fluid className='bannerMobile'>
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
      </Container>

    </div>
  );
};

export default Hero;