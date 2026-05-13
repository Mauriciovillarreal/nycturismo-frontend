import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/Home';
import Packages from '../pages/Packages';
import PackageDetail from '../pages/PackageDetail';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import AdminPackages from '../pages/AdminPackages';
import AdminCreatePackage from '../pages/AdminCreatePackage';
import AdminEditPackage from '../pages/AdminEditPackage';
import AdminBookings from '../pages/AdminBookings';
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
