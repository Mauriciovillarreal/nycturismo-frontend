import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'

const AdminLayout = () => {
  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <AdminNavbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout