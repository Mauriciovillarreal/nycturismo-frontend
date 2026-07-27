import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col
} from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'

import PackageCard from '../components/PackageCard'
import Loader from '../components/Loader'
import api from '../services/api'

import '../styles/Packages.css'

const Packages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchParams, setSearchParams] = useSearchParams()

  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const date = searchParams.get('date')
  const category = searchParams.get('category')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages')
      setPackages(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = packages.filter(pkg => {
    // FILTRO DE ORIGEN
    if (origin && pkg?.origin !== origin) {
      return false
    }

    // FILTRO DE DESTINO
    if (destination && pkg?.destination !== destination) {
      return false
    }

    // FILTRO DE CATEGORÍA
    if (category && pkg?.category !== category) {
      return false
    }

    // FILTRO DE FECHA
    if (date) {
      const searchDate = new Date(date)

      if (isNaN(searchDate.getTime())) return false

      const searchDateISO = searchDate.toISOString().split('T')[0]

      const hasMatchingDate = pkg.availableDates?.some(item => {
        const pkgDateStr = item?.date ? item.date : item
        const pDate = new Date(pkgDateStr)

        if (isNaN(pDate.getTime())) return false

        return pDate.toISOString().split('T')[0] === searchDateISO
      })

      if (!hasMatchingDate) return false
    }

    return true
  })

  const getPageTitle = () => {
    if (category) return `${category}`
    if (destination) return `Viajes a ${destination}`
    return 'Nuestros Paquetes Turísticos'
  }

  if (loading) return <Loader />

  return (
    <Container className="py-5">
      {/* HEADER */}
      <div className="mb-5 text-center text-md-start titlePackagesFiltered">
        <h1 className="text-center titlePackagesFiltered">
          {getPageTitle()}
        </h1>
      </div>

      {/* GRID DE RESULTADOS */}
      <Row>
        <Col xs={12}>
          {filteredPackages.length > 0 ? (
            <Row className="g-4 justify-content-center">
              {filteredPackages.map(pkg => {
                // Evaluamos si el paquete es de Miniturismo
                const isDayTrip =
                  pkg.category?.toLowerCase() === 'miniturismo' ||
                  pkg.nights === 0 ||
                  pkg.nights === '0'

                return (
                  <Col
                    key={pkg._id}
                    // Si es Miniturismo -> 3 por fila (xxl/xl=4). Si es tradicional -> 4 por fila (xxl/xl=3).
                    xxl={isDayTrip ? 4 : 3}
                    xl={isDayTrip ? 4 : 3}
                    lg={isDayTrip ? 6 : 4}
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <PackageCard pkg={pkg} />
                  </Col>
                )
              })}
            </Row>
          ) : (
            <div className="text-center py-5">
              <h4>No se encontraron paquetes para la búsqueda seleccionada</h4>
            </div>
          )}
        </Col>
        
      </Row>
    </Container>
  )
}

export default Packages