import axiosInstance from '../utils/axiosInstance'

// Category service for managing categories
export const categoryService = {
  // Create a new category with full category object
  createCategory: async (categoryData) => {
    try {
      const response = await axiosInstance.post('/api/categories', categoryData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create category')
    }
  },

  // Create category by name only
  createCategoryByName: async (name) => {
    try {
      const response = await axiosInstance.post('/api/categories/create', null, {
        params: { name }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create category by name')
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/categories/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get category by ID')
    }
  },

  // Get category by name
  getCategoryByName: async (name) => {
    try {
      const response = await axiosInstance.get(`/api/categories/name/${encodeURIComponent(name)}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get category by name')
    }
  },

  // Get all active categories
  getAllActiveCategories: async () => {
    try {
      const response = await axiosInstance.get('/api/categories')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get active categories')
    }
  },

  // Get all deleted categories
  getAllDeletedCategories: async () => {
    try {
      const response = await axiosInstance.get('/api/categories/deleted')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get deleted categories')
    }
  },

  // Get categories ordered by name
  getCategoriesOrderedByName: async () => {
    try {
      const response = await axiosInstance.get('/api/categories/ordered/name')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get categories ordered by name')
    }
  },

  // Get categories ordered by creation date
  getCategoriesOrderedByCreatedDate: async () => {
    try {
      const response = await axiosInstance.get('/api/categories/ordered/created')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get categories ordered by created date')
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axiosInstance.put(`/api/categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update category')
    }
  },

  // Soft delete category
  deleteCategory: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/categories/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category')
    }
  },

  // Permanent delete category
  permanentDeleteCategory: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/categories/${id}/permanent`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to permanently delete category')
    }
  },

  // Restore deleted category
  restoreCategory: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/categories/${id}/restore`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore category')
    }
  },

  // Search categories by name
  searchCategoriesByName: async (name) => {
    try {
      const response = await axiosInstance.get('/api/categories/search', {
        params: { name }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search categories')
    }
  },

  // Get category statistics
  getCategoryStats: async () => {
    try {
      const response = await axiosInstance.get('/api/categories/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get category statistics')
    }
  },

  // Check if category exists by name
  checkCategoryExists: async (name) => {
    try {
      const response = await axiosInstance.get('/api/categories/exists', {
        params: { name }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check category existence')
    }
  }
}

export default categoryService
