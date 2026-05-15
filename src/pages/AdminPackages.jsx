import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Table
} from 'react-bootstrap'

import { Link } from 'react-router-dom'

import api from '../services/api'

const AdminPackages = () => {

  const [packages, setPackages] = useState([])

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {

    try {

      const res = await api.get('/packages')

      setPackages(res.data)

    } catch (error) {

      console.log(error)

    }

  }

  const deletePackage = async (id) => {

    const confirmDelete = window.confirm(
      '¿Estás seguro de eliminar este paquete?'
    )

    if (!confirmDelete) return

    try {

      await api.delete(`/packages/${id}`)

      fetchPackages()

    } catch (error) {

      console.log(error)

    }

  }

  return (

    <Container className="py-4">

      <Row className="mb-4 align-items-center">

        <Col>
          <h1 className="fw-bold">
            Gestión de Paquetes
          </h1>
        </Col>

        <Col className="text-end">

          <Button
            as={Link}
            to="/admin/packages/create"
            variant="primary"
          >
            Crear Nuevo Paquete
          </Button>

        </Col>

      </Row>

      <Table
        striped
        bordered
        hover
        responsive
      >

        <thead>

          <tr>

            <th>Título</th>

            <th>Destino</th>

            <th>Categoría</th>

            <th>Duración</th>

            <th>Precio</th>

            <th>Transporte</th>

            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {packages.length > 0 ? (

            packages.map(pkg => {

              const firstCircuit = pkg.circuits?.[0]

              const currency =
                firstCircuit?.currency === 'USD'
                  ? 'US$'
                  : '$'

              return (

                <tr key={pkg._id}>

                  <td>
                    {pkg.title}
                  </td>

                  <td>
                    {pkg.destination}
                  </td>

                  <td>
                    {pkg.category}
                  </td>

                  <td>
                    {pkg.days}D / {pkg.nights}N
                  </td>

                  <td>

                    {currency}

                    {' '}

                    {firstCircuit?.price?.toLocaleString('es-AR') || 0}

                  </td>

                  <td>

                    {
                      pkg.transport?.type === 'plane'
                        ? 'Avión'
                        : 'Bus'
                    }

                    {' - '}

                    {pkg.transport?.category}

                  </td>

                  <td>

                    <div className="d-flex gap-2">

                      <Button
                        as={Link}
                        to={`/admin/packages/edit/${pkg._id}`}
                        variant="warning"
                        size="sm"
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deletePackage(pkg._id)}
                      >
                        Eliminar
                      </Button>

                    </div>

                  </td>

                </tr>

              )

            })

          ) : (

            <tr>

              <td
                colSpan="7"
                className="text-center py-4"
              >
                No hay paquetes cargados
              </td>

            </tr>

          )}

        </tbody>

      </Table>

    </Container>

  )

}

export default AdminPackages