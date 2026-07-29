import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import api from '../../services/api.js' // Traemos tu configuración de Axios

import Hero from '../Hero/Hero.jsx'
import PackageGrid from '../PackageGrid/PackageGrid.jsx'
import CategoryGrid from '../CategoriGrid/CategoriGrid.jsx'
import SuperFeaturedPackage from '../SuperFeaturedPackage/SuperFeaturedPackage.jsx'

const Home = () => {
  // 1. Creamos el estado para guardar los paquetes de la base de datos
  const [packages, setPackages] = useState([])

  // 2. Traemos los paquetes cuando se monta la página principal
  useEffect(() => {
    const fetchHomePackages = async () => {
      try {
        const res = await api.get('/packages')
        setPackages(res.data)
      } catch (error) {
        console.error("Error cargando paquetes en la Home:", error)
      }
    }

    fetchHomePackages()
  }, [])

  // 3. Buscamos el paquete de Japón de forma segura una vez que carguen los datos
  const japonPkg = packages.find(p => p.slug === 'japon-clasico' || p.title?.includes('Japón'))

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