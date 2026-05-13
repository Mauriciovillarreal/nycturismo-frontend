import React, { useState, useEffect } from 'react'
import { Container, Table } from 'react-bootstrap'
import api from '../services/api'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const res = await api.get('/bookings')
    setBookings(res.data)
  }

  return (
    <Container>
      <h1>Gestión de Reservas</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Paquete</th>
            <th>Pasajeros</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id}>
              <td>{booking.user.name}</td>
              <td>{booking.package.title}</td>
              <td>{booking.passengers}</td>
              <td>${booking.totalPrice}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default AdminBookings