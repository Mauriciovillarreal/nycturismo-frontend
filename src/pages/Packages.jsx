import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Badge
} from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTags,
  FaTimes
} from 'react-icons/fa'

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

  const removeFilter = key => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete(key)
    setSearchParams(newParams)
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
      {filteredPackages.map(pkg => (
        <Col
          key={pkg._id}
          xxl={2.1}
          xl={3}
          lg={4}
          md={6}
          sm={12}
        >
          <PackageCard pkg={pkg} />
        </Col>
      ))}
    </Row>
  ) : (

      <h4>No se encontraron paquetes</h4>

  )}
</Col>
      </Row>
    </Container>
  )
}

export default Packages