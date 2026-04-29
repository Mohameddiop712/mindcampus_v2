import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Intercepteur global — redirige vers /login si token expiré (401)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide → déconnexion automatique
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
          setUser(null)
          // Redirige vers login sauf si on y est déjà
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, motDePasse) => {
    const res = await axios.post('/api/auth/login', { email, motDePasse })
    localStorage.setItem('token', res.data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    setUser(res.data.user)
    return res.data.user
  }

  const register = async (data) => {
    const res = await axios.post('/api/auth/register', data)
    localStorage.setItem('token', res.data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
