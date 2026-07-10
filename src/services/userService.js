import axiosInstance from '../utils/axiosInstance'

// User service for managing users
export const userService = {
  // Create a new user with full user object
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/users', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user')
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/users/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get user by ID')
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    try {
      const response = await axiosInstance.get(`/api/users/email/${encodeURIComponent(email)}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get user by email')
    }
  },

  // Get all active users
  getAllActiveUsers: async () => {
    try {
      const response = await axiosInstance.get('/api/users')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get active users')
    }
  },

  // Get all deleted users
  getAllDeletedUsers: async () => {
    try {
      const response = await axiosInstance.get('/api/users/deleted')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get deleted users')
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/api/users/${id}`, userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user')
    }
  },

  // Soft delete user
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/users/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user')
    }
  },

  // Permanent delete user
  permanentDeleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/users/${id}/permanent`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to permanently delete user')
    }
  },

  // Restore deleted user
  restoreUser: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/users/${id}/restore`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore user')
    }
  },

  // Search users by name
  searchUsersByName: async (name) => {
    try {
      const response = await axiosInstance.get('/api/users/search', {
        params: { name }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search users by name')
    }
  },

  // Search users by first name
  searchUsersByFirstName: async (firstName) => {
    try {
      const response = await axiosInstance.get('/api/users/search/firstname', {
        params: { firstName }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search users by first name')
    }
  },

  // Search users by last name
  searchUsersByLastName: async (lastName) => {
    try {
      const response = await axiosInstance.get('/api/users/search/lastname', {
        params: { lastName }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search users by last name')
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await axiosInstance.get('/api/users/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user statistics')
    }
  },

  // Check if user exists by email
  checkUserExists: async (email) => {
    try {
      const response = await axiosInstance.get('/api/users/exists', {
        params: { email }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check user existence')
    }
  },

  // Validate user credentials
  validateCredentials: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/users/validate', {
        email,
        password
      })
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to validate credentials')
    }
  },

  // Login user
  loginUser: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/users/login', {
        email,
        password
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to login user')
    }
  }
}

export default userService
