import axiosInstance from '../utils/axiosInstance'

// Cart service for managing carts
export const cartService = {
  // Create a new cart
  createCart: async (userId, name, description) => {
    try {
      const response = await axiosInstance.post('/api/carts', { name, description }, {
        params: { userId }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create cart')
    }
  },

  // Get cart by user ID
  getCartByUserId: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/carts/user/${userId}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get cart by user ID')
    }
  },

  // Get cart by ID
  getCartById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/carts/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get cart by ID')
    }
  },

  // Update cart
  updateCart: async (id, name, description) => {
    try {
      const response = await axiosInstance.put(`/api/carts/${id}`, { name, description })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update cart')
    }
  },

  // Add item to cart
  addItemToCart: async (userId, productId, quantity = 1) => {
    try {
      const response = await axiosInstance.post(`/api/carts/user/${userId}/items`, {
        productId,
        quantity
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart')
    }
  },

  // Update cart item quantity
  updateCartItemQuantity: async (userId, productId, quantity) => {
    try {
      const response = await axiosInstance.put(`/api/carts/user/${userId}/items/${productId}`, {
        quantity
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item quantity')
    }
  },

  // Remove item from cart
  removeItemFromCart: async (userId, productId) => {
    try {
      const response = await axiosInstance.delete(`/api/carts/user/${userId}/items/${productId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart')
    }
  },

  // Clear cart
  clearCart: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/api/carts/user/${userId}/items`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart')
    }
  },

  // Get cart items
  getCartItems: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/carts/user/${userId}/items`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get cart items')
    }
  },

  // Get cart items ordered by created date
  getCartItemsOrderedByCreatedDate: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/carts/user/${userId}/items/ordered`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get cart items ordered by date')
    }
  },

  // Soft delete cart
  deleteCart: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/carts/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete cart')
    }
  },

  // Restore cart
  restoreCart: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/carts/${id}/restore`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore cart')
    }
  },

  // Get all active carts
  getAllActiveCarts: async () => {
    try {
      const response = await axiosInstance.get('/api/carts')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get active carts')
    }
  },

  // Get recent carts
  getRecentCarts: async (days = 30) => {
    try {
      const response = await axiosInstance.get('/api/carts/recent', {
        params: { days }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get recent carts')
    }
  },

  // Get carts with more than N items
  getCartsWithMoreThanNItems: async (minItems) => {
    try {
      const response = await axiosInstance.get('/api/carts/with-more-than', {
        params: { minItems }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get carts with more than N items')
    }
  },

  // Get cart statistics
  getCartStats: async () => {
    try {
      const response = await axiosInstance.get('/api/carts/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get cart statistics')
    }
  }
}

export default cartService
