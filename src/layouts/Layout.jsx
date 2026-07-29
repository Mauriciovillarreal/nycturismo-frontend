import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/NavBar/NavBar.jsx'
import Footer from '../components/Footer/Footer.jsx'

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout