import axiosInstance from '../utils/axiosInstance'

// Wishlist service for managing wishlists with the updated backend structure
export const wishlistService = {
  // Create a new wishlist for user
  createWishlist: async (userId) => {
    try {
      const response = await axiosInstance.post('/api/wishlists', null, {
        params: { userId,name:"My Wishlist" }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create wishlist')
    }
  },

  // Get wishlist by ID
  getWishlistById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/wishlists/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get wishlist by ID')
    }
  },

  // Get wishlist by user ID
  getWishlistByUserId: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/wishlists/user/${userId}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get wishlist by user ID')
    }
  },

  // Get all active wishlists
  getAllActiveWishlists: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get active wishlists')
    }
  },

  // Get all deleted wishlists
  getAllDeletedWishlists: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists/deleted')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get deleted wishlists')
    }
  },

  // Get wishlists ordered by creation date descending
  getWishlistsOrderedByCreatedDateDesc: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists/ordered/created-desc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlists ordered by creation date')
    }
  },

  // Get wishlists ordered by creation date ascending
  getWishlistsOrderedByCreatedDateAsc: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists/ordered/created-asc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlists ordered by creation date')
    }
  },

  // Get wishlists ordered by product count descending
  getWishlistsOrderedByProductCountDesc: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists/ordered/product-count-desc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlists ordered by product count')
    }
  },

  // Get wishlists ordered by product count ascending
  getWishlistsOrderedByProductCountAsc: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists/ordered/product-count-asc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlists ordered by product count')
    }
  },

  // Soft delete wishlist
  deleteWishlist: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/wishlists/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete wishlist')
    }
  },

  // Permanent delete wishlist
  permanentDeleteWishlist: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/wishlists/${id}/permanent`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to permanently delete wishlist')
    }
  },

  // Restore deleted wishlist
  restoreWishlist: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/wishlists/${id}/restore`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore wishlist')
    }
  },

  // Add product to wishlist (no quantity parameter in new API)
  addProductToWishlist: async (wishlistId, productId) => {
    try {
      const response = await axiosInstance.post(`/api/wishlists/${wishlistId}/products`, null, {
        params: { productId }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add product to wishlist')
    }
  },

  // Update item quantity in wishlist
  updateItemQuantity: async (wishlistId, productId, quantity) => {
    try {
      const response = await axiosInstance.put(`/api/wishlists/${wishlistId}/items/${productId}`, null, {
        params: { quantity }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update item quantity')
    }
  },

  // Remove product from wishlist
  removeProductFromWishlist: async (wishlistId, productId) => {
    try {
      const response = await axiosInstance.delete(`/api/wishlists/${wishlistId}/products/${productId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove product from wishlist')
    }
  },

  // Clear all products from wishlist
  clearWishlist: async (wishlistId) => {
    try {
      const response = await axiosInstance.delete(`/api/wishlists/${wishlistId}/products`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear wishlist')
    }
  },

  // Check if product is in wishlist
  isProductInWishlist: async (wishlistId, productId) => {
    try {
      const response = await axiosInstance.get(`/api/wishlists/${wishlistId}/items/${productId}/exists`)
      return response.data.exists
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check if product is in wishlist')
    }
  },

  // Get wishlist products (new endpoint)
  getWishlistProducts: async (wishlistId) => {
    try {
      const response = await axiosInstance.get(`/api/wishlists/${wishlistId}/products`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlist products')
    }
  },

  // Get wishlist products ordered by created date
  getWishlistProductsOrderedByCreatedDate: async (wishlistId) => {
    try {
      const response = await axiosInstance.get(`/api/wishlists/${wishlistId}/products/ordered`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlist products ordered by date')
    }
  },

  // Get wishlists containing a specific product
  getWishlistsContainingProduct: async (productId) => {
    try {
      const response = await axiosInstance.get(`/api/wishlists/containing-product/${productId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlists containing product')
    }
  },

  // Get empty wishlists
  getEmptyWishlists: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists/empty')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get empty wishlists')
    }
  },

  // Get wishlists with more than N products
  getWishlistsWithMoreThanNProducts: async (minCount) => {
    try {
      const response = await axiosInstance.get('/api/wishlists/with-more-than', {
        params: { minCount }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlists with more than N products')
    }
  },

  // Get recent wishlists
  getRecentWishlists: async (days = 30) => {
    try {
      const response = await axiosInstance.get('/api/wishlists/recent', {
        params: { days }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get recent wishlists')
    }
  },

  // Get most popular products across all wishlists
  getMostPopularProductsInWishlists: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists/most-popular-products')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get most popular products')
    }
  },

  // Get wishlist statistics
  getWishlistStats: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlist statistics')
    }
  },

  // Get wishlist count by user
  getWishlistCountByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/wishlists/stats/user/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlist count by user')
    }
  },

  // Get wishlist statistics by user
  getWishlistStatisticsByUser: async () => {
    try {
      const response = await axiosInstance.get('/api/wishlists/stats/by-user')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlist statistics by user')
    }
  },

  // Check if user has a wishlist
  userHasWishlist: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/wishlists/user/${userId}/exists`)
      return response.data.hasWishlist
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check if user has wishlist')
    }
  }
}

export default wishlistService
