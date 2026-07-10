import axiosInstance from '../utils/axiosInstance'

const reviewService = {
  // Create a new review
  createReview: async (reviewData) => {
    try {
      const response = await axiosInstance.post('/api/reviews', reviewData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create review')
    }
  },

  // Create review with individual parameters
  createReviewWithParams: async (title, content, rating, userId) => {
    try {
      const response = await axiosInstance.post('/api/reviews/create', null, {
        params: { title, content, rating, userId }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create review')
    }
  },

  // Get review by ID
  getReviewById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/reviews/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get review')
    }
  },

  // Get all active reviews
  getAllActiveReviews: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get active reviews')
    }
  },

  // Get all deleted reviews
  getAllDeletedReviews: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/deleted')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get deleted reviews')
    }
  },

  // Get reviews by user
  getReviewsByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/reviews/user/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews by user')
    }
  },

  // Get reviews by rating
  getReviewsByRating: async (rating) => {
    try {
      const response = await axiosInstance.get(`/api/reviews/rating/${rating}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews by rating')
    }
  },

  // Get reviews by rating range
  getReviewsByRatingRange: async (minRating, maxRating) => {
    try {
      const response = await axiosInstance.get('/api/reviews/rating-range', {
        params: { minRating, maxRating }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews by rating range')
    }
  },

  // Get high-rated reviews (4-5 stars)
  getHighRatedReviews: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/high-rated')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get high-rated reviews')
    }
  },

  // Get low-rated reviews (1-2 stars)
  getLowRatedReviews: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/low-rated')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get low-rated reviews')
    }
  },

  // Get top-rated reviews (5 stars)
  getTopRatedReviews: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/top-rated')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get top-rated reviews')
    }
  },

  // Get reviews ordered by rating descending
  getReviewsOrderedByRatingDesc: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/ordered/rating-desc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews ordered by rating desc')
    }
  },

  // Get reviews ordered by rating ascending
  getReviewsOrderedByRatingAsc: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/ordered/rating-asc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews ordered by rating asc')
    }
  },

  // Get reviews ordered by creation date descending
  getReviewsOrderedByCreatedDateDesc: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/ordered/created-desc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews ordered by created date desc')
    }
  },

  // Get reviews ordered by creation date ascending
  getReviewsOrderedByCreatedDateAsc: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/ordered/created-asc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews ordered by created date asc')
    }
  },

  // Get reviews ordered by title
  getReviewsOrderedByTitle: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/ordered/title')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews ordered by title')
    }
  },

  // Update review
  updateReview: async (id, reviewData) => {
    try {
      const response = await axiosInstance.put(`/api/reviews/${id}`, reviewData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update review')
    }
  },

  // Soft delete review
  deleteReview: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/reviews/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete review')
    }
  },

  // Permanent delete review
  permanentDeleteReview: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/reviews/${id}/permanent`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to permanently delete review')
    }
  },

  // Restore deleted review
  restoreReview: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/reviews/${id}/restore`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore review')
    }
  },

  // Search reviews by title
  searchReviewsByTitle: async (title) => {
    try {
      const response = await axiosInstance.get('/api/reviews/search/title', {
        params: { title }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search reviews by title')
    }
  },

  // Search reviews by content
  searchReviewsByContent: async (content) => {
    try {
      const response = await axiosInstance.get('/api/reviews/search/content', {
        params: { content }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search reviews by content')
    }
  },

  // Search reviews by multiple criteria
  searchReviewsByMultipleCriteria: async (searchTerm) => {
    try {
      const response = await axiosInstance.get('/api/reviews/search', {
        params: { searchTerm }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search reviews')
    }
  },

  // Get recent reviews
  getRecentReviews: async (days = 30) => {
    try {
      const response = await axiosInstance.get('/api/reviews/recent', {
        params: { days }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get recent reviews')
    }
  },

  // Get reviews by user ordered by rating
  getReviewsByUserOrderedByRating: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/reviews/user/${userId}/ordered/rating`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews by user ordered by rating')
    }
  },

  // Get review statistics
  getReviewStats: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get review statistics')
    }
  },

  // Get review count by user
  getReviewCountByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/reviews/stats/user/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get review count by user')
    }
  },

  // Get review count by rating
  getReviewCountByRating: async (rating) => {
    try {
      const response = await axiosInstance.get(`/api/reviews/stats/rating/${rating}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get review count by rating')
    }
  },

  // Get average rating by user
  getAverageRatingByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/reviews/stats/user/${userId}/average-rating`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get average rating by user')
    }
  },

  // Get rating distribution
  getRatingDistribution: async () => {
    try {
      const response = await axiosInstance.get('/api/reviews/stats/rating-distribution')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get rating distribution')
    }
  },

  // Helper method to format rating stars
  formatRatingStars: (rating) => {
    if (!rating || rating < 1 || rating > 5) return ''
    let stars = ''
    for (let i = 0; i < rating; i++) {
      stars += '★'
    }
    for (let i = rating; i < 5; i++) {
      stars += '☆'
    }
    return stars
  },

  // Helper method to get rating description
  getRatingDescription: (rating) => {
    if (!rating) return 'No rating'
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Very Good'
      case 5: return 'Excellent'
      default: return 'Unknown'
    }
  },

  // Helper method to check if review is recent
  isRecentReview: (createdAt, days = 30) => {
    if (!createdAt) return false
    const reviewDate = new Date(createdAt)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return reviewDate > cutoffDate
  },

  // Helper method to get display title with rating
  getDisplayTitleWithRating: (title, rating) => {
    if (!title) return ''
    const stars = reviewService.formatRatingStars(rating)
    return `${title} (${stars})`
  },

  // Helper method to validate review data
  validateReviewData: (reviewData) => {
    const errors = []
    
    if (!reviewData.title || reviewData.title.trim().length < 2) {
      errors.push('Title must be at least 2 characters long')
    }
    
    if (reviewData.title && reviewData.title.length > 200) {
      errors.push('Title must not exceed 200 characters')
    }
    
    if (!reviewData.content || reviewData.content.trim().length === 0) {
      errors.push('Content is required')
    }
    
    if (reviewData.content && reviewData.content.length > 1000) {
      errors.push('Content must not exceed 1000 characters')
    }
    
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      errors.push('Rating must be between 1 and 5')
    }
    
    if (!reviewData.userId) {
      errors.push('User ID is required')
    }
    
    return errors
  },

  // Helper method to format review for display
  formatReviewForDisplay: (review) => {
    if (!review) return null
    
    return {
      ...review,
      ratingStars: reviewService.formatRatingStars(review.rating),
      ratingDescription: reviewService.getRatingDescription(review.rating),
      isRecent: reviewService.isRecentReview(review.createdAt),
      displayTitleWithRating: reviewService.getDisplayTitleWithRating(review.title, review.rating),
      formattedCreatedAt: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '',
      formattedUpdatedAt: review.updatedAt ? new Date(review.updatedAt).toLocaleDateString() : ''
    }
  },

  // Helper method to format multiple reviews for display
  formatReviewsForDisplay: (reviews) => {
    if (!Array.isArray(reviews)) return []
    return reviews.map(review => reviewService.formatReviewForDisplay(review))
  }
}

export default reviewService
