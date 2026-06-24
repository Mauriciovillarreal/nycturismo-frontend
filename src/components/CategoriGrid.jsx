import React from 'react'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import '../styles/CategoryGrid.css'

const categories = [

    {
        title: 'Paquetes en bus',
        image: 'https://i.ibb.co/xt7wyKvd/Chat-GPT-Image-24-jun-2026-04-23-42-p-m.png',
        category: 'Paquetes en bus'
    },

    {
        title: 'Paquetes en aereo',
        image: 'https://imagenes.elpais.com/resizer/v2/PMOV75WIT5NQPIGZTM35XRQMX4.jpg?auth=224a2578470b17237737ab9d9db274037ecc4cef2295cb520d9326a8210b1590&width=1200',
        category: 'Paquetes en aereo'
    },

    {
        title: 'Minitursmo',
        image: 'https://www.codigobaires.com.ar/adjuntos/800/codigoba/2025/04/imagepng.jpg',
        category: 'Minitursmo'
    },

    {
        title: 'Internacional',
        image: 'https://img.static-kl.com/transform/bb1c45ef-bc48-407b-a559-c8b7ca39d7a3/',
        category: 'Internacional'
    },

    {
        title: 'Finde largo',
        image: 'https://offloadmedia.feverup.com/bairessecreta.com/wp-content/uploads/2023/03/28071221/escapada-fin-de-semana-largo-Areco.png',
        category: 'Finde largo'
    },

    {
        title: 'Vacaciones de invierno',
        image: 'https://www.memo.com.ar/files/image/36/36924/62967713518c9.jpg',
        category: 'Vacaciones de invierno'
    }

]

const CategoryGrid = () => {

    const navigate = useNavigate()

    return (
        <Container>

        <section className="categorySection">
            <div className="categoryContainer">
                <div className="categoryGrid">
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="categoryCard"
                            onClick={() =>
                                navigate(`/packages?category=${item.category}`)
                            }
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                            />
                            <div className="categoryOverlay"></div>
                            <h2>
                                {item.title}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>
        </section>
         </Container>
    )
}

export default CategoryGrid