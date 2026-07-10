import axiosInstance from '../utils/axiosInstance'

// Order service for managing orders
export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/api/orders', orderData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order')
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/orders/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get order by ID')
    }
  },

  // Get orders by user
  getOrdersByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/orders/user/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get orders by user')
    }
  },

  // Get all active orders
  getAllActiveOrders: async () => {
    try {
      const response = await axiosInstance.get('/api/orders')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get active orders')
    }
  },

  // Get orders by status
  getOrdersByStatus: async (status) => {
    try {
      const response = await axiosInstance.get(`/api/orders/status/${status}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get orders by status')
    }
  },

  // Update order
  updateOrder: async (id, orderData) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${id}`, orderData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order')
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order status')
    }
  },

  // Add product to order
  addProductToOrder: async (orderId, productId) => {
    try {
      const response = await axiosInstance.post(`/api/orders/${orderId}/products`, null, {
        params: { productId }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add product to order')
    }
  },

  // Remove product from order
  removeProductFromOrder: async (orderId, productId) => {
    try {
      const response = await axiosInstance.delete(`/api/orders/${orderId}/products/${productId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove product from order')
    }
  },

  // Cancel order
  cancelOrder: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${id}/cancel`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel order')
    }
  },

  // Soft delete order
  deleteOrder: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/orders/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete order')
    }
  },

  // Restore order
  restoreOrder: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${id}/restore`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore order')
    }
  },

  // Get recent orders
  getRecentOrders: async (days = 30) => {
    try {
      const response = await axiosInstance.get('/api/orders/recent', {
        params: { days }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get recent orders')
    }
  },

  // Get orders with more than N products
  getOrdersWithMoreThanNProducts: async (minCount) => {
    try {
      const response = await axiosInstance.get('/api/orders/with-more-than', {
        params: { minCount }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get orders with more than N products')
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      const response = await axiosInstance.get('/api/orders/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get order statistics')
    }
  },

  // Get revenue statistics
  getRevenueStats: async () => {
    try {
      const response = await axiosInstance.get('/api/orders/stats/revenue')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get revenue statistics')
    }
  }
}

export default orderService
