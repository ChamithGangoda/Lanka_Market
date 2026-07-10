import axiosInstance from '../utils/axiosInstance'

// Product service for managing products
export const productService = {
  // Create a new product with full product object
  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('/api/products', productData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product')
    }
  },

  // Create product with individual parameters
  createProductWithParams: async (name, price, description, imageUrl, inStockAmount, categoryId, sellerId) => {
    try {
      const params = new URLSearchParams({
        name,
        price: price.toString(),
        description,
        inStockAmount: inStockAmount.toString(),
        categoryId: categoryId.toString(),
        sellerId: sellerId.toString()
      })
      if (imageUrl) {
        params.append('imageUrl', imageUrl)
      }
      
      const response = await axiosInstance.post('/api/products/create', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product')
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/products/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || 'Failed to get product by ID')
    }
  },

  // Get all active products
  getAllActiveProducts: async () => {
    try {
      const response = await axiosInstance.get('/api/products')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get active products')
    }
  },

  // Get all deleted products
  getAllDeletedProducts: async () => {
    try {
      const response = await axiosInstance.get('/api/products/deleted')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get deleted products')
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await axiosInstance.get(`/api/products/category/${categoryId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products by category')
    }
  },

  // Get products by seller
  getProductsBySeller: async (sellerId) => {
    try {
      const response = await axiosInstance.get(`/api/products/seller/${sellerId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products by seller')
    }
  },

  // Get products ordered by name
  getProductsOrderedByName: async () => {
    try {
      const response = await axiosInstance.get('/api/products/ordered/name')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products ordered by name')
    }
  },

  // Get products ordered by price ascending
  getProductsOrderedByPriceAsc: async () => {
    try {
      const response = await axiosInstance.get('/api/products/ordered/price-asc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products ordered by price ascending')
    }
  },

  // Get products ordered by price descending
  getProductsOrderedByPriceDesc: async () => {
    try {
      const response = await axiosInstance.get('/api/products/ordered/price-desc')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products ordered by price descending')
    }
  },

  // Get products ordered by creation date
  getProductsOrderedByCreatedDate: async () => {
    try {
      const response = await axiosInstance.get('/api/products/ordered/created')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products ordered by created date')
    }
  },

  // Get products ordered by stock amount
  getProductsOrderedByStockAmount: async () => {
    try {
      const response = await axiosInstance.get('/api/products/ordered/stock')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products ordered by stock amount')
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`/api/products/${id}`, productData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product')
    }
  },

  // Update product stock
  updateProductStock: async (id, stockAmount) => {
    try {
      const response = await axiosInstance.put(`/api/products/${id}/stock`, null, {
        params: { stockAmount }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product stock')
    }
  },

  // Soft delete product
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/products/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product')
    }
  },

  // Permanent delete product
  permanentDeleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/products/${id}/permanent`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to permanently delete product')
    }
  },

  // Restore deleted product
  restoreProduct: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/products/${id}/restore`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore product')
    }
  },

  // Search products by name
  searchProductsByName: async (name) => {
    try {
      const response = await axiosInstance.get('/api/products/search/name', {
        params: { name }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search products by name')
    }
  },

  // Search products by description
  searchProductsByDescription: async (description) => {
    try {
      const response = await axiosInstance.get('/api/products/search/description', {
        params: { description }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search products by description')
    }
  },

  // Search products by multiple criteria
  searchProductsByMultipleCriteria: async (searchTerm) => {
    try {
      const response = await axiosInstance.get('/api/products/search', {
        params: { searchTerm }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search products')
    }
  },

  // Get products by price range
  getProductsByPriceRange: async (minPrice, maxPrice) => {
    try {
      const response = await axiosInstance.get('/api/products/price-range', {
        params: { minPrice, maxPrice }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products by price range')
    }
  },

  // Get products in stock
  getProductsInStock: async () => {
    try {
      const response = await axiosInstance.get('/api/products/in-stock')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products in stock')
    }
  },

  // Get products out of stock
  getProductsOutOfStock: async () => {
    try {
      const response = await axiosInstance.get('/api/products/out-of-stock')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products out of stock')
    }
  },

  // Get products with low stock
  getProductsWithLowStock: async (threshold = 5) => {
    try {
      const response = await axiosInstance.get('/api/products/low-stock', {
        params: { threshold }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products with low stock')
    }
  },

  // Get products with images
  getProductsWithImages: async () => {
    try {
      const response = await axiosInstance.get('/api/products/with-images')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products with images')
    }
  },

  // Get products without images
  getProductsWithoutImages: async () => {
    try {
      const response = await axiosInstance.get('/api/products/without-images')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get products without images')
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      const response = await axiosInstance.get('/api/products/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get product statistics')
    }
  },

  // Get product count by category
  getProductCountByCategory: async (categoryId) => {
    try {
      const response = await axiosInstance.get(`/api/products/stats/category/${categoryId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get product count by category')
    }
  },

  // Get product count by seller
  getProductCountBySeller: async (sellerId) => {
    try {
      const response = await axiosInstance.get(`/api/products/stats/seller/${sellerId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get product count by seller')
    }
  }
}

export default productService
