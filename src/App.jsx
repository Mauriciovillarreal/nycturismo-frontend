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
import AdminBookings from './pages/AdminBookings'
import ProtectedRoute from './components/ProtectedRoute'

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
          </Route>
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="packages/create" element={<AdminCreatePackage />} />
            <Route path="packages/edit/:id" element={<AdminEditPackage />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App