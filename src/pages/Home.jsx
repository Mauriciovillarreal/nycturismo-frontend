import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import api from '../services/api' // Traemos tu configuración de Axios

import Hero from '../components/Hero'
import PackageGrid from '../components/PackageGrid'
import CategoryGrid from '../components/CategoriGrid'
import SuperFeaturedPackage from '../components/SuperFeaturedPackage'

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