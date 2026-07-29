import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const AboutUs = () => {
    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={10} className="text-center">

                    <h1
                        className="mb-4"
                        style={{
                            color: '#44423f',
                            fontWeight: 'bold'
                        }}
                    >
                        Quiénes Somos
                    </h1>

                    <p>
                        NYC Travel es una empresa con trayectoria desde 1991 en turismo,
                        lo que nos capacita para brindar la mejor atención a todos los viajeros
                        que soliciten nuestros servicios.
                    </p>

                    <p>
                        Contamos con tres sucursales en las localidades de Morón, Merlo y
                        San Justo, puntos estratégicos del conurbano bonaerense para estar
                        siempre cerca de nuestros clientes.
                    </p>

                    <p>
                        Brindamos una amplia gama de servicios: boletos en bus a todo el país,
                        Bolivia, Brasil, Chile, Paraguay, Perú y Uruguay; vuelos a todo el mundo;
                        encomiendas a todo el país (solo en Merlo y San Justo); paquetes turísticos
                        y excursiones.
                    </p>

                    <hr className="my-4" />

                    <p>
                        Estamos focalizados en la satisfacción total del cliente, buscando
                        siempre brindar la mejor atención posible de acuerdo con sus necesidades
                        e inquietudes.
                    </p>

                    <p>
                        También valoramos la opinión y experiencia de nuestros pasajeros,
                        manteniendo una comunicación fluida para escuchar todo lo que
                        quieran compartir con nosotros.
                    </p>

                    <hr className="my-5" />

                    <h2
                        className="mb-4"
                        style={{
                            color: '#44423f',
                            fontWeight: 'bold'
                        }}
                    >
                        Nuestra Ubicación
                    </h2>

                    <div
                        style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                        }}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1641.107153559601!2d-58.61655153538665!3d-34.64929032467668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc76158599a1f%3A0xb72e49f2a0b8bf6b!2sNyc%20Travel!5e0!3m2!1ses-419!2sar!4v1782255606601!5m2!1ses-419!2sar"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="Ubicación NYC Travel"
                        />
                    </div>

                    <div className="mt-4">
                        <Button
                            variant="warning"
                            size="lg"
                            href="https://maps.app.goo.gl/o8pbD2ATV29eQf3Y8"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Cómo llegar
                        </Button>
                    </div>

                </Col>
            </Row>
        </Container>
    );
};

export default AboutUs;