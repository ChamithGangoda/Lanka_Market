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
  Spin,
  Empty,
  InputNumber,
  Popconfirm,
  Divider,
  Statistic
} from 'antd'
import { 
  HeartOutlined, 
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  EyeOutlined
} from '@ant-design/icons'
import Navbar from '../components/Navbar'
import wishlistService from '../services/wishlistService'
import './MyWhishlist.css'

const { Title, Text, Paragraph } = Typography

const MyWhishlist = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [wishlist, setWishlist] = useState(null)
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [removing, setRemoving] = useState(false)

  const userId = localStorage.getItem('userId')
  const isAuthenticated = !!userId

  // Load wishlist data
  const loadWishlist = async () => {
    if (!isAuthenticated) {
      messageApi.error('Please login to view your wishlist')
      return
    }

    setLoading(true)
    try {
      const wishlistData = await wishlistService.getWishlistByUserId(userId)
      
      if (wishlistData) {
        setWishlist(wishlistData)
        // Load wishlist items
        const items =wishlistData.products;  // await wishlistService.getWishlistProducts(wishlistData.id)
        setWishlistItems(items || [])
      } else {
        // Create wishlist if doesn't exist
        const newWishlist = await wishlistService.getAllActiveWishlists()
        setWishlist(newWishlist)
        setWishlistItems([])
      }
    } catch (error) {
      messageApi.error('Failed to load wishlist: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Update item quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (!wishlist || newQuantity < 1) return

    setUpdating(true)
    try {
      await wishlistService.updateItemQuantity(wishlist.id, productId, newQuantity)
      
      // Update local state
      setWishlistItems(prevItems => 
        prevItems.map(item => 
          item.id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
      
      messageApi.success('Quantity updated successfully!')
    } catch (error) {
      messageApi.error('Failed to update quantity: ' + error.message)
    } finally {
      setUpdating(false)
    }
  }

  // Remove item from wishlist
  const handleRemoveItem = async (productId) => {
    if (!wishlist) return

    setRemoving(true)
    try {
      await wishlistService.removeProductFromWishlist(wishlist.id, productId)
      
      // Update local state
      setWishlistItems(prevItems => 
        prevItems.filter(item => item.id !== productId)
      )
      
      messageApi.success('Item removed from wishlist!')
    } catch (error) {
      messageApi.error('Failed to remove item: ' + error.message)
    } finally {
      setRemoving(false)
    }
  }

  // Clear entire wishlist
  const handleClearWishlist = async () => {
    if (!wishlist) return

    setRemoving(true)
    try {
      await wishlistService.clearWishlist(wishlist.id)
      setWishlistItems([])
      messageApi.success('Wishlist cleared successfully!')
    } catch (error) {
      messageApi.error('Failed to clear wishlist: ' + error.message)
    } finally {
      setRemoving(false)
    }
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    return wishlistItems?.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }

  // Calculate total items
  const calculateTotalItems = () => {
    return wishlistItems?.reduce((total, item) => total + item.quantity, 0)
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="wishlist-container">
          <div className="wishlist-empty">
            <Empty
              description="Please login to view your wishlist"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="wishlist-container">
          <div className="wishlist-loading">
            <Spin size="large" />
            <Text>Loading your wishlist...</Text>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <Navbar />
      <div className="wishlist-container">
        <div className="wishlist-header">
          <Title level={1} className="wishlist-title">
            <HeartOutlined className="title-icon" />
            My Wishlist
          </Title>
          <Text type="secondary" className="wishlist-subtitle">
            Your favorite products
          </Text>
        </div>

        {/* Wishlist Statistics */}
        {wishlistItems.length > 0 && (
          <Row gutter={16} className="wishlist-stats">
            <Col xs={24} sm={8}>
              <Card className="stat-card">
                <Statistic
                  title="Total Items"
                  value={wishlistItems.length}
                  prefix={<HeartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="stat-card">
                <Statistic
                  title="Total Quantity"
                  value={calculateTotalItems()}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="stat-card">
                <Statistic
                  title="Total Price"
                  value={calculateTotalPrice()}
                  prefix="$"
                  precision={2}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Wishlist Items */}
        <div className="wishlist-content">
          {wishlistItems.length === 0 ? (
            <Card className="wishlist-empty-card">
              <Empty
                description="Your wishlist is empty"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => window.location.href = '/'}>
                  Start Shopping
                </Button>
              </Empty>
            </Card>
          ) : (
            <>
              {/* Clear Wishlist Button */}
              <div className="wishlist-actions">
                <Popconfirm
                  title="Clear Wishlist"
                  description="Are you sure you want to clear your entire wishlist?"
                  onConfirm={handleClearWishlist}
                  okText="Yes, Clear"
                  cancelText="Cancel"
                  okType="danger"
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    loading={removing}
                  >
                    Clear Wishlist
                  </Button>
                </Popconfirm>
              </div>

              {/* Items Grid */}
              <Row gutter={[16, 16]}>
                {wishlistItems.map(item => (
                  <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                    <Card
                      className="wishlist-item-card"
                      hoverable
                      cover={
                        <div className="item-image-container">
                          <Image
                            src={item.imageUrl || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="item-image"
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                          />
                          <div className="item-overlay">
                            <Button
                              type="primary"
                              icon={<EyeOutlined />}
                              onClick={() => window.location.href = '/'}
                              className="view-button"
                            >
                              View Product
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <Card.Meta
                        title={
                          <div className="item-title">
                            <Text strong ellipsis={{ tooltip: item.name }}>
                              {item.name}
                            </Text>
                          </div>
                        }
                        description={
                          <div className="item-description">
                            <Paragraph ellipsis={{ rows: 2 }}>
                              {item.description}
                            </Paragraph>
                            <div className="item-meta">
                              <Space direction="vertical" size="small">
                                <Text strong className="item-price">
                                  ${item.price}
                                </Text>
                                <Space>
                                  <Tag color="blue">{item.category?.name}</Tag>
                                  <Tag color={item.inStockAmount > 0 ? 'green' : 'red'}>
                                    {item.inStockAmount > 0 ? 'In Stock' : 'Out of Stock'}
                                  </Tag>
                                </Space>
                                <Text type="secondary" className="seller-info">
                                  Sold by: {item.sellerName}
                                </Text>
                              </Space>
                            </div>
                          </div>
                        }
                      />

                      <Divider />

                      {/* Quantity Management */}
                      <div className="quantity-section">
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text strong>Quantity:</Text>
                          <Space>
                            <Button
                              icon={<MinusOutlined />}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updating}
                              size="small"
                            />
                            <InputNumber
                              min={1}
                              max={item.inStockAmount}
                              value={item.quantity}
                              onChange={(value) => handleUpdateQuantity(item.id, value)}
                              disabled={updating}
                              size="small"
                              style={{ width: 60 }}
                            />
                            <Button
                              icon={<PlusOutlined />}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.inStockAmount || updating}
                              size="small"
                            />
                          </Space>
                          <Text type="secondary" className="subtotal">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Space>
                      </div>

                      <Divider />

                      {/* Actions */}
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Popconfirm
                          title="Remove Item"
                          description="Are you sure you want to remove this item from your wishlist?"
                          onConfirm={() => handleRemoveItem(item.id)}
                          okText="Yes, Remove"
                          cancelText="Cancel"
                          okType="danger"
                        >
                          <Button 
                            danger 
                            icon={<DeleteOutlined />}
                            loading={removing}
                            size="small"
                            type='primary'
                          >
                            Remove
                          </Button>
                        </Popconfirm>
                      
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default MyWhishlist