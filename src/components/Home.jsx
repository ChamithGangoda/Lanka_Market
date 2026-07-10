import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  message, 
  Typography, 
  Space, 
  Tag, 
  Image, 
  Modal,
  Spin,
  Empty,
  Input,
  Select,
  Divider
} from 'antd'
import { 
  HeartOutlined, 
  EyeOutlined, 
  SearchOutlined,
  FilterOutlined,
  StarOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons'
import Navbar from './Navbar'
import productService from '../services/productService'
import wishlistService from '../services/wishlistService'
import cartService from '../services/cartService'
import categoryService from '../services/categoryService'
import './Home.css'
import SiteReviews from './SiteReviews'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select

const Home = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [userWishlist, setUserWishlist] = useState(null)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [userCart, setUserCart] = useState(null)
  const [cartLoading, setCartLoading] = useState(false)

  const userId = localStorage.getItem('userId')
  const isAuthenticated = !!userId

  // Load products and categories
  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllActiveProducts(),
        categoryService.getAllActiveCategories()
      ])
      
      setProducts(productsData)
      setFilteredProducts(productsData)
      setCategories(categoriesData || [])
    } catch (error) {
      messageApi.error('Failed to load products: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load user wishlist if authenticated
  const loadUserWishlist = async () => {
    if (!isAuthenticated) return
    
    try {
      const wishlist = await wishlistService.getWishlistByUserId(userId)
      setUserWishlist(wishlist)
    } catch (error) {
      console.log('No wishlist found for user')
    }
  }

  // Load user cart if authenticated
  const loadUserCart = async () => {
    if (!isAuthenticated) return
    
    try {
      const cart = await cartService.getCartByUserId(userId)
      setUserCart(cart)
    } catch (error) {
      console.log('No cart found for user')
    }
  }

  // Create wishlist for user if doesn't exist
  const createUserWishlist = async () => {
    if (!isAuthenticated) return null
    
    try {
      const newWishlist = await wishlistService.createWishlist(userId)
      setUserWishlist(newWishlist)
      return newWishlist
    } catch (error) {
      messageApi.error('Failed to create wishlist: ' + error.message)
      return null
    }
  }

  // Add product to wishlist
  const handleAddToWishlist = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      messageApi.warning('Please login to add products to wishlist')
      return
    }

    setWishlistLoading(true)
    try {
      let wishlist = userWishlist
      
      // Create wishlist if doesn't exist
      if (!wishlist) {
        wishlist = await createUserWishlist()
        if (!wishlist) return
      }

      // Check if product is already in wishlist
      const isInWishlist = wishlist.items?.some(item => item.product.id === product.id)
      
      if (isInWishlist) {
        messageApi.info('Product is already in your wishlist')
        return
      }

      // Add product to wishlist with quantity
      await wishlistService.addProductToWishlist(wishlist.id, product.id, quantity)
      
      // Reload wishlist
      const updatedWishlist = await wishlistService.getWishlistByUserId(userId)
      setUserWishlist(updatedWishlist)
      
      messageApi.success('Product added to wishlist!')
    } catch (error) {
      messageApi.error('Failed to add to wishlist: ' + error.message)
    } finally {
      setWishlistLoading(false)
    }
  }

  // Create cart for user if doesn't exist
  const createUserCart = async () => {
    if (!isAuthenticated) return null
    
    try {
      const newCart = await cartService.createCart(userId, 'My Cart', 'Shopping cart')
      setUserCart(newCart)
      return newCart
    } catch (error) {
      messageApi.error('Failed to create cart: ' + error.message)
      return null
    }
  }

  // Add product to cart
  const handleAddToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      messageApi.warning('Please login to add products to cart')
      return
    }

    setCartLoading(true)
    try {
      let cart = userCart
      
      // Create cart if doesn't exist
      if (!cart) {
        cart = await createUserCart()
        if (!cart) return
      }

      // Add product to cart with default quantity of 1
      await cartService.addItemToCart(userId, product.id, quantity)
      
      // Reload cart
      const updatedCart = await cartService.getCartByUserId(userId)
      setUserCart(updatedCart)
      
      messageApi.success('Product added to cart!')
    } catch (error) {
      messageApi.error('Failed to add to cart: ' + error.message)
    } finally {
      setCartLoading(false)
    }
  }

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value)
    filterProducts(value, selectedCategory)
  }

  // Handle category filter
  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
    filterProducts(searchText, value)
  }

  // Filter products
  const filterProducts = (search, category) => {
    let filtered = products

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      filtered = filtered.filter(product =>
        product.category?.id === category
      )
    }

    setFilteredProducts(filtered)
  }

  // Show product details modal
  const showProductDetails = (product) => {
    setSelectedProduct(product)
    setIsModalVisible(true)
  }

  // Check if product is in wishlist
  const isProductInWishlist = (product) => {
    if (!userWishlist || !userWishlist.items) return false
    return userWishlist.items.some(item => item.product.id === product.id)
  }

  // Get product quantity in wishlist
  const getProductQuantityInWishlist = (product) => {
    if (!userWishlist || !userWishlist.items) return 0
    const item = userWishlist.items.find(item => item.product.id === product.id)
    return item ? item.quantity : 0
  }

  // Check if product is in cart
  const isProductInCart = (product) => {
    if (!userCart || !userCart.cartItems) return false
    return userCart.cartItems.some(item => item.product.id === product.id)
  }

  // Get product quantity in cart
  const getProductQuantityInCart = (product) => {
    if (!userCart || !userCart.cartItems) return 0
    const item = userCart.cartItems.find(item => item.product.id === product.id)
    return item ? item.quantity : 0
  }

  useEffect(() => {
    loadData()
    loadUserWishlist()
    loadUserCart()
  }, [])

  return (
    <>
      {contextHolder}
      <Navbar />
      <div className="home-container">
        <div className="home-header">
          <Title level={1} className="home-title">
            Welcome to LankaMarket
          </Title>
          <Text type="secondary" className="home-subtitle">
            Discover amazing products from local sellers
          </Text>
        </div>

        {/* Search and Filter Section */}
        <Card className="search-filter-card">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search products..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Filter by category"
                allowClear
                size="large"
                style={{ width: '100%' }}
                onChange={handleCategoryChange}
                suffixIcon={<FilterOutlined />}
              >
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Text type="secondary">
                Showing {filteredProducts.length} of {products.length} products
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Products Grid */}
        <div className="products-section">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text>Loading products...</Text>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Empty
              description="No products found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredProducts.map(product => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    className="product-card"
                    hoverable
                    cover={
                      <div className="product-image-container">
                        <Image
                          src={product.imageUrl || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="product-image"
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                        />
                        <div className="product-overlay">
                          <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => showProductDetails(product)}
                            className="view-button"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    }
                    actions={[
                      <Button
                        key="wishlist"
                        type={isProductInWishlist(product) ? "primary" : "default"}
                        icon={<HeartOutlined />}
                        loading={wishlistLoading}
                        onClick={() => handleAddToWishlist(product)}
                        disabled={!isAuthenticated}
                        className="wishlist-button"
                      >
                        {isProductInWishlist(product) ? `In Wishlist (${getProductQuantityInWishlist(product)})` : 'Add to Wishlist'}
                      </Button>,
                      <Button
                        key="cart"
                        type={isProductInCart(product) ? "primary" : "default"}
                        icon={<ShoppingCartOutlined />}
                        loading={cartLoading}
                        onClick={() => handleAddToCart(product)}
                        disabled={!isAuthenticated || product.inStockAmount <= 0}
                        className="cart-button"
                      >
                        {isProductInCart(product) ? `In Cart (${getProductQuantityInCart(product)})` : 'Add to Cart'}
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div className="product-title">
                          <Text strong ellipsis={{ tooltip: product.name }}>
                            {product.name}
                          </Text>
                        </div>
                      }
                      description={
                        <div className="product-description">
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {product.description}
                          </Paragraph>
                          <div className="product-meta">
                            <Space direction="vertical" size="small">
                              <Text strong className="product-price">
                                ${product.price}
                              </Text>
                              <Space>
                                <Tag color="blue">{product.category?.name}</Tag>
                                <Tag color={product.inStockAmount > 0 ? 'green' : 'red'}>
                                  {product.inStockAmount > 0 ? 'In Stock' : 'Out of Stock'}
                                </Tag>
                              </Space>
                              <Text type="secondary" className="seller-info">
                                Sold by: {product.sellerName}
                              </Text>
                            </Space>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Product Details Modal */}
        <Modal
          title={
            <div className="modal-title">
              <Title level={3}>{selectedProduct?.name}</Title>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          className="product-detail-modal"
        >
          {selectedProduct && (
            <div className="product-detail-content">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <div className="product-detail-image">
                    <Image
                      src={selectedProduct.imageUrl || '/placeholder-product.jpg'}
                      alt={selectedProduct.name}
                      className="detail-image"
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="product-detail-info">
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                      <div>
                        <Title level={2} className="detail-price">
                          ${selectedProduct.price}
                        </Title>
                        <Space>
                          <Tag color="blue" className="detail-category">
                            {selectedProduct.category?.name}
                          </Tag>
                          <Tag color={selectedProduct.inStockAmount > 0 ? 'green' : 'red'}>
                            {selectedProduct.inStockAmount > 0 ? 'In Stock' : 'Out of Stock'}
                          </Tag>
                        </Space>
                      </div>

                      <div>
                        <Title level={4}>Description</Title>
                        <Paragraph>{selectedProduct.description}</Paragraph>
                      </div>

                      <div>
                        <Title level={4}>Product Details</Title>
                        <Space direction="vertical" size="small">
                          <Text><strong>Stock Available:</strong> {selectedProduct.inStockAmount} units</Text>
                          <Text><strong>Seller:</strong> {selectedProduct.seller?.name}</Text>
                          <Text><strong>Business Registration:</strong> {selectedProduct.seller?.businessRegNumber}</Text>
                          <Text><strong>Created:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString()}</Text>
                        </Space>
                      </div>

                      <Divider />

                      <Space size="middle">
                        <Button
                          type="primary"
                          size="large"
                          icon={<HeartOutlined />}
                          loading={wishlistLoading}
                          onClick={() => handleAddToWishlist(selectedProduct)}
                          disabled={!isAuthenticated || isProductInWishlist(selectedProduct)}
                        >
                          {isProductInWishlist(selectedProduct) ? `In Wishlist (${getProductQuantityInWishlist(selectedProduct)})` : 'Add to Wishlist'}
                        </Button>
                        <Button
                          type="default"
                          size="large"
                          icon={<ShoppingCartOutlined />}
                          loading={cartLoading}
                          onClick={() => handleAddToCart(selectedProduct)}
                          disabled={!isAuthenticated || selectedProduct.inStockAmount <= 0 || isProductInCart(selectedProduct)}
                        >
                          {isProductInCart(selectedProduct) ? `In Cart (${getProductQuantityInCart(selectedProduct)})` : 'Add to Cart'}
                        </Button>
                      </Space>
                    </Space>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>

      </div>
      <SiteReviews />
    </>
  )
}

export default Home