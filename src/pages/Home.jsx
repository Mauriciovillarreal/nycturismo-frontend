import React from 'react'

import { Container } from 'react-bootstrap'

import Hero from '../components/Hero'
import PackageGrid from '../components/PackageGrid'
import CategoryGrid from '../components/CategoriGrid'

const Home = () => {

  return (

    <>

      <Hero />
      <CategoryGrid />
      <Container className="py-5">


        <PackageGrid featured />

      </Container>

    </>

  )
}

export default Home