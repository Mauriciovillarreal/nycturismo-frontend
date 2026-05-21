import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './layouts/Layout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Packages from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import Contact from './pages/Contact'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminPackages from './pages/AdminPackages'
import AdminCreatePackage from './pages/AdminCreatePackage'
import AdminEditPackage from './pages/AdminEditPackage'
import ProtectedRoute from './components/ProtectedRoute'
import AboutUs from './pages/AboutUs'

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