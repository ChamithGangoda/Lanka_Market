import axiosInstance from '../utils/axiosInstance'

// Seller service for managing sellers
export const sellerService = {
  // Create a new seller with full seller object
  createSeller: async (sellerData) => {
    try {
      const response = await axiosInstance.post('/api/sellers', sellerData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create seller')
    }
  },

  // Create seller with individual parameters
  createSellerWithParams: async (name, businessRegNumber, email, addressDescription, password, imageUrl = null) => {
    try {
      const params = new URLSearchParams({
        name,
        businessRegNumber,
        email,
        addressDescription,
        password
      })
      if (imageUrl) {
        params.append('imageUrl', imageUrl)
      }
      
      const response = await axiosInstance.post('/api/sellers/create', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create seller')
    }
  },

  // Login seller
  loginSeller: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/sellers/login', {
        email,
        password
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to login seller')
    }
  },

  // Get seller by ID
  getSellerById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/sellers/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get seller by ID')
    }
  },

  // Get seller by business registration number
  getSellerByBusinessRegNumber: async (businessRegNumber) => {
    try {
      const response = await axiosInstance.get(`/api/sellers/business-reg/${encodeURIComponent(businessRegNumber)}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get seller by business registration number')
    }
  },

  // Get seller by name
  getSellerByName: async (name) => {
    try {
      const response = await axiosInstance.get(`/api/sellers/name/${encodeURIComponent(name)}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get seller by name')
    }
  },

  // Get all active sellers
  getAllActiveSellers: async () => {
    try {
      const response = await axiosInstance.get('/api/sellers')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get active sellers')
    }
  },

  // Get all deleted sellers
  getAllDeletedSellers: async () => {
    try {
      const response = await axiosInstance.get('/api/sellers/deleted')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get deleted sellers')
    }
  },

  // Get sellers ordered by name
  getSellersOrderedByName: async () => {
    try {
      const response = await axiosInstance.get('/api/sellers/ordered/name')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get sellers ordered by name')
    }
  },

  // Get sellers ordered by business registration number
  getSellersOrderedByBusinessRegNumber: async () => {
    try {
      const response = await axiosInstance.get('/api/sellers/ordered/business-reg')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get sellers ordered by business registration number')
    }
  },

  // Get sellers ordered by creation date
  getSellersOrderedByCreatedDate: async () => {
    try {
      const response = await axiosInstance.get('/api/sellers/ordered/created')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get sellers ordered by created date')
    }
  },

  // Get sellers ordered by update date
  getSellersOrderedByUpdatedDate: async () => {
    try {
      const response = await axiosInstance.get('/api/sellers/ordered/updated')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get sellers ordered by updated date')
    }
  },

  // Update seller
  updateSeller: async (id, sellerData) => {
    try {
      const response = await axiosInstance.put(`/api/sellers/${id}`, sellerData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update seller')
    }
  },

  // Soft delete seller
  deleteSeller: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/sellers/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete seller')
    }
  },

  // Permanent delete seller
  permanentDeleteSeller: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/sellers/${id}/permanent`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to permanently delete seller')
    }
  },

  // Restore deleted seller
  restoreSeller: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/sellers/${id}/restore`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore seller')
    }
  },

  // Search sellers by name
  searchSellersByName: async (name) => {
    try {
      const response = await axiosInstance.get('/api/sellers/search/name', {
        params: { name }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search sellers by name')
    }
  },

  // Search sellers by business registration number
  searchSellersByBusinessRegNumber: async (businessRegNumber) => {
    try {
      const response = await axiosInstance.get('/api/sellers/search/business-reg', {
        params: { businessRegNumber }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search sellers by business registration number')
    }
  },

  // Search sellers by address description
  searchSellersByAddress: async (addressDescription) => {
    try {
      const response = await axiosInstance.get('/api/sellers/search/address', {
        params: { addressDescription }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search sellers by address')
    }
  },

  // Search sellers by multiple criteria
  searchSellersByMultipleCriteria: async (searchTerm) => {
    try {
      const response = await axiosInstance.get('/api/sellers/search', {
        params: { searchTerm }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search sellers')
    }
  },

  // Get sellers with images
  getSellersWithImages: async () => {
    try {
      const response = await axiosInstance.get('/api/sellers/with-images')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get sellers with images')
    }
  },

  // Get sellers without images
  getSellersWithoutImages: async () => {
    try {
      const response = await axiosInstance.get('/api/sellers/without-images')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get sellers without images')
    }
  },

  // Get seller statistics
  getSellerStats: async () => {
    try {
      const response = await axiosInstance.get('/api/sellers/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get seller statistics')
    }
  },

  // Check if seller exists by business registration number
  checkSellerExistsByBusinessRegNumber: async (businessRegNumber) => {
    try {
      const response = await axiosInstance.get('/api/sellers/exists/business-reg', {
        params: { businessRegNumber }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check seller existence by business registration number')
    }
  },

  // Check if seller exists by name
  checkSellerExistsByName: async (name) => {
    try {
      const response = await axiosInstance.get('/api/sellers/exists/name', {
        params: { name }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check seller existence by name')
    }
  }
}

export default sellerService
