import React, { useState, useEffect } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const AdminEditPackage = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    origin: '',
    destination: '',
    category: '',
    description: '',
    price: '',
    availableSeats: '',
    duration: '',
    includes: '',
    notIncludes: '',
    images: '',
    featured: false,
    availableDates: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchPackage()
  }, [id])

  const fetchPackage = async () => {
    const res = await api.get(`/packages/id/${id}`)
    const pkg = res.data
    setFormData({
      title: pkg.title || '',
      origin: pkg.origin || '',
      destination: pkg.destination || '',
      category: pkg.category || '',
      description: pkg.description || '',
      price: pkg.price || '',
      availableSeats: pkg.availableSeats || '',
      duration: pkg.duration || '',
      includes: pkg.includes?.join(',') || '',
      notIncludes: pkg.notIncludes?.join(',') || '',
      images: pkg.images?.join(',') || '',
      featured: pkg.featured || false,
      availableDates: pkg.availableDates?.map(date => new Date(date).toISOString().split('T')[0]).join(',') || '',
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      price: Number(formData.price),
      availableSeats: Number(formData.availableSeats),
      includes: formData.includes ? formData.includes.split(',').map(item => item.trim()) : [],
      notIncludes: formData.notIncludes ? formData.notIncludes.split(',').map(item => item.trim()) : [],
      images: formData.images ? formData.images.split(',').map(item => item.trim()) : [],
      availableDates: formData.availableDates ? formData.availableDates.split(',').map(item => item.trim()) : [],
    }
    await api.put(`/packages/${id}`, data)
    navigate('/admin/packages')
  }

  return (
    <Container>
      <h1>Editar Paquete</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control name="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Origen</Form.Label>
          <Form.Control name="origin" value={formData.origin} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Destino</Form.Label>
          <Form.Control name="destination" value={formData.destination} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Control name="category" value={formData.category} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Disponible asientos</Form.Label>
          <Form.Control type="number" name="availableSeats" value={formData.availableSeats} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Duración (días)</Form.Label>
          <Form.Control type="number" name="duration" value={formData.duration} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Incluye (separado por comas)</Form.Label>
          <Form.Control name="includes" value={formData.includes} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>No incluye (separado por comas)</Form.Label>
          <Form.Control name="notIncludes" value={formData.notIncludes} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Imágenes (URLs separadas por comas)</Form.Label>
          <Form.Control name="images" value={formData.images} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fechas disponibles (YYYY-MM-DD separadas por comas)</Form.Label>
          <Form.Control name="availableDates" value={formData.availableDates} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3 form-check">
          <Form.Check type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} label="Destacado" />
        </Form.Group>
        <Button type="submit" variant="primary">Actualizar Paquete</Button>
      </Form>
    </Container>
  )
}

export default AdminEditPackage
