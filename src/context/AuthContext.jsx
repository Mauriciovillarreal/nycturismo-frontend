import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('authUser')

        if (token && storedUser && storedUser !== 'undefined') {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)
    }, [])
    
    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password })

        console.log(res.data)

        const { token, user: loggedUser } = res.data

        localStorage.setItem('token', token)

        localStorage.setItem('authUser', JSON.stringify(loggedUser))

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        setUser(loggedUser)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('authUser')

        delete api.defaults.headers.common['Authorization']

        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext