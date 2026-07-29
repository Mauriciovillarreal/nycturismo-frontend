import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './layouts/Layout'
import AdminLayout from './layouts/AdminLayout'
import Home from './components/Home/Home.jsx'
import Packages from './components/Packages/Packages.jsx'
import PackageDetail from './components/PackageDetail/PackageDetail.jsx'
import Contact from './components/Contact/Contact.jsx'
import Login from './components/Login/Login.jsx'
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx'
import AdminPackages from './components/AdminPackages/AdminPackages.jsx'
import AdminCreatePackage from './components/AdminCreatePackage/AdminCreatePackage.jsx'
import AdminEditPackage from './components/AdminEditPackage/AdminEditPackage.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import AboutUs from './components/AboutUs/AboutUs.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="packages" element={<Packages />} />
            <Route path="packages/:slug" element={<PackageDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="/quienes-somos" element={<AboutUs />} />
          </Route>
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="packages/create" element={<AdminCreatePackage />} />
            <Route path="packages/edit/:id" element={<AdminEditPackage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App