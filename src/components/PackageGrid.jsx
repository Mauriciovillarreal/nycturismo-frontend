import React, { useState, useEffect } from 'react'

import {
  Row,
  Col,
  Container
} from 'react-bootstrap'

import PackageCard from './PackageCard'
import Loader from './Loader'
import api from '../services/api'

import '../styles/packageGrid.css'

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

  if (loading) return <Loader />

  return (

    <Container fluid className='packageGridContainer'>
      <h2>Paquetes destacados</h2>
      <p>¡Tu viaje ya organizado! ¿Que estás esperando?</p>
      <Row className="g-4 justify-content-center">

        {packages.map(pkg => (

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

    </Container>
  )
}

export default PackageGrid