import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import PackageCard from '../PackageCard/PackageCard.jsx'
import Loader from '../Loader/Loader.jsx'
import api from '../../services/api.js'

import '../PackageGrid/PackageGrid.css'

const PackageGrid = ({ featured = false }) => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackages()
  }, [featured])

  const fetchPackages = async () => {
    try {
      const res = await api.get(
        `/packages${featured ? '?featured=true' : ''}`
      )
      setPackages(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // SEPARACIÓN DE PAQUETES POR CATEGORÍA / TIPO
  // =========================================================

  // 1. Paquetes Miniturismo / Salidas en el día
  const miniturismoPackages = packages.filter(pkg => 
    pkg.category?.toLowerCase() === 'miniturismo' ||
    pkg.nights === 0 ||
    pkg.nights === '0'
  )

  // 2. Paquetes Tradicionales (Con noche / viajes largos)
  const regularPackages = packages.filter(pkg => 
    pkg.category?.toLowerCase() !== 'miniturismo' &&
    pkg.nights !== 0 &&
    pkg.nights !== '0'
  )

  if (loading) return <Loader />

  return (
    <Container fluid className='packageGridContainer py-4'>
      
      {/* =========================================================
          SECCIÓN 1: PAQUETES DESTACADOS (4 POR FILA)
         ========================================================= */}
      {regularPackages.length > 0 && (
        <section className="mb-5">
          <h2 className="text-center mb-1">Paquetes destacados</h2>
          <p className="text-center text-muted mb-4">¡Tu viaje ya organizado! ¿Qué estás esperando?</p>
          
          <Row className="g-4 justify-content-center">
            {regularPackages.map(pkg => (
              <Col
                key={pkg._id}
                xxl={3} /* 4 por fila en pantallas grandes */
                xl={3}
                lg={4}
                md={6}
                sm={12}
                xs={12}
              >
                <PackageCard pkg={pkg} />
              </Col>
            ))}
          </Row>
        </section>
      )}


      {/* =========================================================
          SECCIÓN 2: MINITURISMO (3 POR FILA / CARDS ANCHAS)
         ========================================================= */}
      {miniturismoPackages.length > 0 && (
        <section className="mb-4">
          <h2 className="text-center mb-1">Escapadas</h2>
          <p className="text-center text-muted mb-4">Excursiones y salidas en el día ideales para un fin de semana</p>
          
          <Row className="g-4 justify-content-center">
            {miniturismoPackages.map(pkg => (
              <Col
                key={pkg._id}
                xxl={4} /* 3 por fila en pantallas grandes */
                xl={4}
                lg={6}
                md={6}
                sm={12}
                xs={12}
              >
                <PackageCard pkg={pkg} />
              </Col>
            ))}
          </Row>
        </section>
      )}

      {/* MENSAJE SI NO HAY PAQUETES EN NINGUNA CATEGORÍA */}
      {packages.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted fs-5">No hay paquetes disponibles en este momento.</p>
        </div>
      )}

    </Container>
  )
}

export default PackageGrid