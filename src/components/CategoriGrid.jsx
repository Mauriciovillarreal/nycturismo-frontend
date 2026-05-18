import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CategoryGrid.css'

const categories = [

    {
        title: 'Internacional',
        image: 'https://assets.voxcity.com/uploads/blog_images/What-is-the-first-place-to-visit-when-you-travel-to-Rome_original.jpg',
        category: 'Internacional'
    },

    {
        title: 'Turquia',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=1200&auto=format&fit=crop',
        category: 'Turquia'
    },

    {
        title: 'Europa',
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200&auto=format&fit=crop',
        category: 'Europa'
    },

    {
        title: 'Caribe',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYnXxGt9ZCa2QK_Nr1MtZ6lqxNA1DgrLMtg&s',
        category: 'Caribe'
    },

    {
        title: 'Nacionales',
        image: 'https://cdn-imgix.headout.com/media/images/b8da531f-7c2a-4cbb-b677-18716d86366a-1747818847273-276449.jpg?auto=compress%2Cformat&w=900&h=562.5&q=90&ar=16%3A10&crop=faces%2Ccenter&fit=crop',
        category: 'Nacionales'
    },

    {
        title: 'Minitursmo',
        image: 'https://www.codigobaires.com.ar/adjuntos/800/codigoba/2025/04/imagepng.jpg',
        category: 'Miniturismo'
    }

]

const CategoryGrid = () => {

    const navigate = useNavigate()

    return (
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
    )
}

export default CategoryGrid