import React from 'react'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import '../CategoriGrid/CategoriGrid.css'

const CategoryGrid = () => {
    const navigate = useNavigate()

    const handleNavigate = (category) => {
        navigate(`/packages?category=${category}`)
    }

    return (
        <Container>
            <section className="categorySection">
                <div className="categoryContainer">
                    {/* Grilla principal de 4 columnas */}
                    <div className="categoryGridColumns">

                        {/* COLUMNA 1: Paquetes en bus (Vertical alta) + Finde largo (Abajo) */}
                        <div className="categoryCol">
                            <div className="categoryCard categoryCard-tall" onClick={() => handleNavigate('Paquetes en bus')}>
                                <img src="https://i.ibb.co/xt7wyKvd/Chat-GPT-Image-24-jun-2026-04-23-42-p-m.png" alt="Paquetes en bus" />
                                <div className="categoryOverlay"></div>
                                <h2>Paquetes en bus</h2>
                            </div>
                            <div className="categoryCard" onClick={() => handleNavigate('Finde largo')}>
                                <img src="https://offloadmedia.feverup.com/bairessecreta.com/wp-content/uploads/2023/03/28071221/escapada-fin-de-semana-largo-Areco.png" alt="Finde largo" />
                                <div className="categoryOverlay"></div>
                                <h2>Finde largo</h2>
                            </div>
                        </div>

                        {/* COLUMNA 2: Brasil/Aereo (Arriba chico) + Europa (Vertical grande abajo) */}
                        <div className="categoryCol">
                            <div className="categoryCard" onClick={() => handleNavigate('Paquetes en aereo')}>
                                <img src="https://imagenes.elpais.com/resizer/v2/PMOV75WIT5NQPIGZTM35XRQMX4.jpg?auth=224a2578470b17237737ab9d9db274037ecc4cef2295cb520d9326a8210b1590&width=1200" alt="Paquetes en aereo" />
                                <div className="categoryOverlay"></div>
                                <h2>Paquetes en aereo</h2>
                            </div>
                            <div className="categoryCard categoryCard-tall" onClick={() => handleNavigate('Vacaciones de verano')}>
                                <img src="https://cdn.pixabay.com/photo/2017/06/17/18/35/beach-2413081_1280.jpg" alt="Vacaciones de verano" />
                                <div className="categoryOverlay"></div>
                                <h2>Vacaciones de verano</h2>
                            </div>
                        </div>

                        {/* COLUMNA 3: Turquía (Arriba grande) + Caribe (Abajo chico) */}
                        <div className="categoryCol">
                              <div className="categoryCard categoryCard-tall" onClick={() => handleNavigate('Internacional')}>
                                <img src="https://img.static-kl.com/transform/bb1c45ef-bc48-407b-a559-c8b7ca39d7a3/" alt="Internacional" />
                                <div className="categoryOverlay"></div>
                                <h2>Internacional</h2>
                            </div>
                            <div className="categoryCard" onClick={() => handleNavigate('Miniturismo')}>
                                <img src="https://iili.io/CrApDRp.png" alt="Miniturismo" />
                                <div className="categoryOverlay"></div>
                                <h2>Miniturismo</h2>
                            </div>
                          
                        </div>

                        {/* COLUMNA 4: Argentina (Arriba chico) + NaranjaX/Banner (Abajo grande) */}
                        <div className="categoryCol">
                            <div className="categoryCard" onClick={() => handleNavigate('Navidad')}>
                                <img src="https://cdn.pixabay.com/photo/2026/09/15/23/29/23-29-47-598_1280.jpg" alt="Navidad" />
                                <div className="categoryOverlay"></div>
                                <h2>Navidad</h2>
                            </div>
                            <div className="categoryCard categoryCard-tall" onClick={() => handleNavigate('Año Nuevo')}>
                                <img src="https://cdn.pixabay.com/photo/2017/01/04/21/00/new-years-eve-1953253_1280.jpg" alt="Año Nuevo" />
                                <div className="categoryOverlay"></div>
                                <h2>Año Nuevo</h2>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </Container>
    )
}

export default CategoryGrid