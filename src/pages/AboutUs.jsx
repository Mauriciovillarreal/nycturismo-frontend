import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const AboutUs = () => {
    return (
        <Container >
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <h1 className="mb-4" style={{ color: '#44423f', fontWeight: 'bold' }}>Quiénes Somos</h1>
                    <p >
                        Nyc  travel es una empresa con un trayectoria desde 1991 en turismo, lo cual nos capacita para brindar la mejor atención a todos los viajeros que soliciten nuestros servicios.

                        Contamos con tres sucursales en las localidades de Morón, Merlo y San justo. Tres puntos importantes del conurbano bonaerense para poder estar cerca de todos nuestros clientes.

                        Brindamos una amplia gama de servicios: boletos en bus a todo el país, Bolivia, Brasil, Chile, Paraguay, Perú y Uruguay, y en avión a todo el mundo; encomiendas a todo el país (solo en Merlo y San Justo); paquetes turísticos y excursiones.
                    </p>
                    <hr className="my-4" />
                     <p >
                       Estamos focalizados en la satisfacción total del cliente, buscando siempre brindar la mejor atención posible de acuerdo a las necesidades e inquietudes nuevas y de siempre de los pasajeros que nos visitan o nos consultan vía telefónica u online. También nos interesa su opinión y sus experiencias con la empresa, por lo cual estamos siempre dispuestos a mantener una comunicación fluida con ellos para escuchar en forma directa y sin interferencias todo lo que nos quieran hacer llegar.
                    </p>
                </Col>
            </Row>
        </Container>
    )
}

export default AboutUs