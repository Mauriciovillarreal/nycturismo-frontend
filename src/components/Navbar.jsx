import React, { useEffect, useState } from 'react'
import {
  Navbar,
  Container,
  Form,
  Button,
  Row,
  Col,
  Collapse
} from 'react-bootstrap'

import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { FaHeadset } from 'react-icons/fa'
import '../styles/navbar.css'

const NavbarComponent = () => {

  const navigate = useNavigate()

  const [packages, setPackages] = useState([])

  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')

  const [origins, setOrigins] = useState([])
  const [destinations, setDestinations] = useState([])
  const [dates, setDates] = useState([])

  const [openSearch, setOpenSearch] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {

    try {

      const res = await api.get('/packages')

      setPackages(res.data)

      const uniqueOrigins = [
        ...new Set(res.data.map(pkg => pkg.origin))
      ]

      const uniqueDestinations = [
        ...new Set(res.data.map(pkg => pkg.destination))
      ]

      setOrigins(uniqueOrigins)
      setDestinations(uniqueDestinations)

    } catch (error) {
      console.error(error)
    }
  }


  return (

    <Navbar>

      <Container className="d-flex flex-column">

        <div className="navbarTop">

          <LinkContainer to="/">
            <Navbar.Brand className='imgLogoNav'>
              <img src="../img/logonyc.png" alt="NYC Turismo" />
            </Navbar.Brand>
          </LinkContainer>
          
          <h5> <FaHeadset className='phoneIcon' />Para ventas 11 4050 0111</h5>
        </div>
      


      </Container>
      

    </Navbar>
  )
}

export default NavbarComponent