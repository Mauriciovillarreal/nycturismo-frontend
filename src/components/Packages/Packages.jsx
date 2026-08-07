import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'

import PackageCard from '../PackageCard/PackageCard.jsx'
import Loader from '../Loader/Loader.jsx'
import api from '../../services/api.js'
import { categoryBanners } from '../../data/categoryBanners.js' // Importar banners

import '../Packages/Packages.css'

const Packages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchParams] = useSearchParams()

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

  // Filtrado de paquetes...
  const filteredPackages = packages.filter(pkg => {
    if (origin && pkg?.origin !== origin) return false
    if (destination && pkg?.destination !== destination) return false
    if (category && pkg?.category !== category) return false
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
    if (category) return category
    if (destination) return `Viajes a ${destination}`
    return 'Nuestros Paquetes Turísticos'
  }

  // Obtener la información del banner si existe la categoría
  const activeBanner = category ? categoryBanners[category] : null

  if (loading) return <Loader />

  return (
    <>
      {/* BANNER DINÁMICO POR CATEGORÍA */}
      {activeBanner ? (
        <Container
          className="categoryBanner"
          style={{ backgroundImage: `url(${activeBanner.image})` }}
        >
          <div className="bannerOverlay">
            <Container className="h-100 d-flex flex-column justify-content-center align-items-center text-center text-white">
              <h1 className="bannerTitle">{getPageTitle()}</h1>
              {activeBanner.subtitle && (
                <p className="bannerSubtitle">{activeBanner.subtitle}</p>
              )}
            </Container>
          </div>
        </Container>
      ) : (
        /* HEADER POR DEFECTO (Si no hay banner o no es filtro por categoría) */
        <Container className="pt-5">
          <div className="mb-4 text-center text-md-start titlePackagesFiltered">
            <h1 className="text-center titlePackagesFiltered">
              {getPageTitle()}
            </h1>
          </div>
        </Container>
      )}

      {/* GRID DE RESULTADOS */}
      <Container className="py-5">
        <Row>
          <Col xs={12}>
            {filteredPackages.length > 0 ? (
              <Row className="g-4 justify-content-center">
                {filteredPackages.map(pkg => {
                  const isDayTrip =
                    pkg.category?.toLowerCase() === 'miniturismo' ||
                    pkg.nights === 0 ||
                    pkg.nights === '0'

                  return (
                    <Col
                      key={pkg._id}
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
    </>
  )
}

export default Packages