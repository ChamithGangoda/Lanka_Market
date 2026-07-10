import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status)
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

export default axiosInstance
