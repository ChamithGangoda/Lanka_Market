import axiosInstance from '../utils/axiosInstance'

// Payment service for managing payments
export const paymentService = {
  // Create a new payment
  createPayment: async (paymentData) => {
    try {
      const response = await axiosInstance.post('/api/payments', paymentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment')
    }
  },

  // Create payment with individual parameters
  createPaymentWithParams: async (status, deliveryAddress, contactNumber, totalAmount, paymentMethod, notes, userId) => {
    try {
      const response = await axiosInstance.post('/api/payments/create', null, {
        params: {
          status,
          deliveryAddress,
          contactNumber,
          totalAmount,
          paymentMethod,
          notes,
          userId
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment')
    }
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/payments/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get payment by ID')
    }
  },

  // Get all active payments
  getAllActivePayments: async () => {
    try {
      const response = await axiosInstance.get('/api/payments')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get active payments')
    }
  },

  // Get all deleted payments
  getAllDeletedPayments: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/deleted')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get deleted payments')
    }
  },

  // Get payments by user
  getPaymentsByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/payments/user/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments by user')
    }
  },

  // Get payments by status
  getPaymentsByStatus: async (status) => {
    try {
      const response = await axiosInstance.get(`/api/payments/status/${status}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments by status')
    }
  },

  // Get payments by payment method
  getPaymentsByPaymentMethod: async (paymentMethod) => {
    try {
      const response = await axiosInstance.get(`/api/payments/payment-method/${paymentMethod}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments by payment method')
    }
  },

  // Get payments by amount range
  getPaymentsByAmountRange: async (minAmount, maxAmount) => {
    try {
      const response = await axiosInstance.get('/api/payments/amount-range', {
        params: { minAmount, maxAmount }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments by amount range')
    }
  },

  // Get payments by contact number
  getPaymentsByContactNumber: async (contactNumber) => {
    try {
      const response = await axiosInstance.get(`/api/payments/contact/${contactNumber}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments by contact number')
    }
  },

  // Get payments ordered by amount descending
  getPaymentsOrderedByAmountDesc: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/ordered/amount-desc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments ordered by amount')
    }
  },

  // Get payments ordered by amount ascending
  getPaymentsOrderedByAmountAsc: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/ordered/amount-asc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments ordered by amount')
    }
  },

  // Get payments ordered by creation date descending
  getPaymentsOrderedByCreatedDateDesc: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/ordered/created-desc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments ordered by creation date')
    }
  },

  // Get payments ordered by payment date descending
  getPaymentsOrderedByPaymentDateDesc: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/ordered/payment-date-desc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments ordered by payment date')
    }
  },

  // Get payments ordered by product count descending
  getPaymentsOrderedByProductCountDesc: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/ordered/product-count-desc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments ordered by product count')
    }
  },

  // Update payment
  updatePayment: async (id, paymentData) => {
    try {
      const response = await axiosInstance.put(`/api/payments/${id}`, paymentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update payment')
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/api/payments/${id}/status`, null, {
        params: { status }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update payment status')
    }
  },

  // Soft delete payment
  deletePayment: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/payments/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete payment')
    }
  },

  // Permanent delete payment
  permanentDeletePayment: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/payments/${id}/permanent`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to permanently delete payment')
    }
  },

  // Restore deleted payment
  restorePayment: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/payments/${id}/restore`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore payment')
    }
  },

  // Add product to payment
  addProductToPayment: async (paymentId, productId) => {
    try {
      const response = await axiosInstance.post(`/api/payments/${paymentId}/products/${productId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add product to payment')
    }
  },

  // Remove product from payment
  removeProductFromPayment: async (paymentId, productId) => {
    try {
      const response = await axiosInstance.delete(`/api/payments/${paymentId}/products/${productId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove product from payment')
    }
  },

  // Clear all products from payment
  clearPayment: async (paymentId) => {
    try {
      const response = await axiosInstance.delete(`/api/payments/${paymentId}/products`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear payment')
    }
  },

  // Check if product is in payment
  isProductInPayment: async (paymentId, productId) => {
    try {
      const response = await axiosInstance.get(`/api/payments/${paymentId}/products/${productId}/exists`)
      return response.data.exists
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check if product is in payment')
    }
  },

  // Search payments by multiple criteria
  searchPaymentsByMultipleCriteria: async (searchTerm) => {
    try {
      const response = await axiosInstance.get('/api/payments/search', {
        params: { searchTerm }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search payments')
    }
  },

  // Get payments containing a specific product
  getPaymentsContainingProduct: async (productId) => {
    try {
      const response = await axiosInstance.get(`/api/payments/containing-product/${productId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payments containing product')
    }
  },

  // Get empty payments
  getEmptyPayments: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/empty')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get empty payments')
    }
  },

  // Get recent payments
  getRecentPayments: async (days = 30) => {
    try {
      const response = await axiosInstance.get('/api/payments/recent', {
        params: { days }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get recent payments')
    }
  },

  // Get pending payments
  getPendingPayments: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/pending')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get pending payments')
    }
  },

  // Get completed payments
  getCompletedPayments: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/completed')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get completed payments')
    }
  },

  // Get failed payments
  getFailedPayments: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/failed')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get failed payments')
    }
  },

  // Get cancelled payments
  getCancelledPayments: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/cancelled')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get cancelled payments')
    }
  },

  // Get refunded payments
  getRefundedPayments: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/refunded')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get refunded payments')
    }
  },

  // Get most popular products in payments
  getMostPopularProductsInPayments: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/most-popular-products')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get most popular products')
    }
  },

  // Get payment statistics
  getPaymentStats: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payment statistics')
    }
  },

  // Get payment count by user
  getPaymentCountByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/payments/stats/user/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payment count by user')
    }
  },

  // Get payment count by status
  getPaymentCountByStatus: async (status) => {
    try {
      const response = await axiosInstance.get(`/api/payments/stats/status/${status}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payment count by status')
    }
  },

  // Get total revenue by user
  getTotalRevenueByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/payments/stats/user/${userId}/revenue`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get total revenue by user')
    }
  },

  // Get total revenue by date range
  getTotalRevenueByDateRange: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get('/api/payments/stats/revenue-by-date', {
        params: { startDate, endDate }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get total revenue by date range')
    }
  },

  // Get payment statistics by user
  getPaymentStatisticsByUser: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/stats/by-user')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payment statistics by user')
    }
  },

  // Get payment statistics by status
  getPaymentStatisticsByStatus: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/stats/by-status')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payment statistics by status')
    }
  },

  // Get payment statistics by payment method
  getPaymentStatisticsByPaymentMethod: async () => {
    try {
      const response = await axiosInstance.get('/api/payments/stats/by-payment-method')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payment statistics by payment method')
    }
  }
}

export default paymentService
