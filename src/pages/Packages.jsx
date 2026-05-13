import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup
} from 'react-bootstrap'

import { useSearchParams } from 'react-router-dom'

import PackageCard from '../components/PackageCard'
import Loader from '../components/Loader'
import api from '../services/api'

const Packages = () => {

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

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

  const filteredPackages = packages.filter(pkg => {

    // BUSCADOR MANUAL
    const matchSearch =
      pkg.destination
        .toLowerCase()
        .includes(search.toLowerCase())

    // ORIGEN
    const matchOrigin =
      !origin || pkg.origin === origin

    // DESTINO
    const matchDestination =
      !destination || pkg.destination === destination

    // FECHA
    const matchDate =
      !date ||
      pkg.availableDates.some(
        item =>
          new Date(item).toISOString() === date

      )

    const matchCategory =
      !category || pkg.category === category

    return (
      matchSearch &&
      matchOrigin &&
      matchDestination &&
      matchDate &&
      matchCategory
    )
  })

  if (loading) return <Loader />

  return (
    <Container className="py-5">



      <Row>

        {filteredPackages.length > 0 ? (

          filteredPackages.map(pkg => (

            <Col
              md={4}
              key={pkg._id}
              className="mb-4"
            >
              <PackageCard pkg={pkg} />
            </Col>

          ))

        ) : (

          <h4 className="text-center">
            No se encontraron paquetes
          </h4>

        )}

      </Row>

    </Container>
  )
}

export default Packages