import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../components/Home/Home.jsx';
import Packages from '../components/Packages/Packages.jsx';
import PackageDetail from '../components/PackageDetail/PackageDetail.jsx';
import Contact from '../components/Contact/Contact.jsx';
import Login from '../components/Login/Login.jsx';
import AdminDashboard from '../components/AdminDashboard/AdminDashboard.jsx';
import AdminPackages from '../components/AdminPackages/AdminPackages.jsx';
import AdminCreatePackage from '../components/AdminCreatePackage/AdminCreatePackage.jsx';
import AdminEditPackage from '../components/AdminEditPackage/AdminEditPackage.jsx';
import AdminBookings from '../components/AdminBookings/AdminBookings';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/:slug" element={<PackageDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="packages/new" element={<AdminCreatePackage />} />
        <Route path="packages/edit/:id" element={<AdminEditPackage />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
