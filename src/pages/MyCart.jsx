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
  Statistic,
  Modal,
  Form,
  Input,
  Select
} from 'antd'
import { 
  ShoppingCartOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  EyeOutlined
} from '@ant-design/icons'
import Navbar from '../components/Navbar'
import cartService from '../services/cartService'
import orderService from '../services/orderService'
import './MyCart.css'

const { Title, Text, Paragraph } = Typography

const MyCart = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [cart, setCart] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [orderModalVisible, setOrderModalVisible] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderForm] = Form.useForm()

  const userId = localStorage.getItem('userId')
  const isAuthenticated = !!userId

  // Load cart data
  const loadCart = async () => {
    if (!isAuthenticated) {
      messageApi.error('Please login to view your cart')
      return
    }

    setLoading(true)
    try {
      const cartData = await cartService.getCartByUserId(userId)
      if (cartData) {
        setCart(cartData)
        setCartItems(cartData.cartItems || [])
      } else {
        setCart(null)
        setCartItems([])
      }
    } catch (error) {
      messageApi.error('Failed to load cart: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Update cart item quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (!cart) return

    setUpdating(true)
    try {
      await cartService.updateCartItemQuantity(userId, productId, newQuantity)
      
      // Update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.product.id === productId 
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

  // Remove item from cart
  const handleRemoveItem = async (productId) => {
    if (!cart) return

    setRemoving(true)
    try {
      await cartService.removeItemFromCart(userId, productId)
      
      // Update local state
      setCartItems(prevItems => 
        prevItems.filter(item => item.product.id !== productId)
      )
      
      messageApi.success('Item removed from cart!')
    } catch (error) {
      messageApi.error('Failed to remove item: ' + error.message)
    } finally {
      setRemoving(false)
    }
  }

  // Clear entire cart
  const handleClearCart = async () => {
    if (!cart) return

    setRemoving(true)
    try {
      await cartService.clearCart(userId)
      setCartItems([])
      messageApi.success('Cart cleared successfully!')
    } catch (error) {
      messageApi.error('Failed to clear cart: ' + error.message)
    } finally {
      setRemoving(false)
    }
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    return cartItems?.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0) || 0
  }

  // Calculate total items
  const calculateTotalItems = () => {
    return cartItems?.reduce((total, item) => total + item.quantity, 0) || 0
  }

  // Handle order creation
  const handleCreateOrder = async (values) => {
    if (!cart || !cartItems || cartItems.length === 0) {
      messageApi.error('No items in cart to create order')
      return
    }

    // Validate that all items have quantity > 0
    const invalidItems = cartItems.filter(item => !item.quantity || item.quantity <= 0)
    if (invalidItems.length > 0) {
      messageApi.error('All items must have quantity greater than 0')
      return
    }

    setOrderLoading(true)
    try {
      const totalAmount = calculateTotalPrice()
      
      const orderData = {
        userId: parseInt(userId),
        deliveryAddress: values.deliveryAddress,
        contactNumber: values.contactNumber,
        productIds: cartItems.map(item => item.product.id),
        paymentMethod: values.paymentMethod,
        notes: values.notes
      }

      const createdOrder = await orderService.createOrder(orderData)
      
      messageApi.success('Order created successfully!')
      setOrderModalVisible(false)
      orderForm.resetFields()
      
      // Clear cart after successful order
      await handleClearCart()


      
    } catch (error) {
      messageApi.error('Failed to create order: ' + error.message)
    } finally {
      setOrderLoading(false)
    }
  }

  // Open order modal
  const handleOpenOrderModal = () => {
    if (!cartItems || cartItems.length === 0) {
      messageApi.warning('No items in cart to create order')
      return
    }

    // Validate that all items have quantity > 0
    const invalidItems = cartItems.filter(item => !item.quantity || item.quantity <= 0)
    if (invalidItems.length > 0) {
      messageApi.error('All items must have quantity greater than 0 before creating order')
      return
    }

    setOrderModalVisible(true)
  }

  useEffect(() => {
    loadCart()
  }, [])

  if (loading) {
    return (
      <>
        {contextHolder}
        <Navbar />
        <div className="cart-loading">
          <Spin size="large" />
          <Text>Loading your cart...</Text>
        </div>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <Navbar />
      <div className="cart-container">
        <div className="cart-header">
          <Title level={1} className="cart-title">
            <ShoppingCartOutlined className="title-icon" />
            My Cart
          </Title>
          <Text type="secondary" className="cart-subtitle">
            Review your items before checkout
          </Text>
        </div>

        {/* Cart Statistics */}
        {cartItems.length > 0 && (
          <Row gutter={16} className="cart-stats">
            <Col xs={24} sm={8}>
              <Card className="stat-card">
                <Statistic
                  title="Total Items"
                  value={cartItems.length}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="stat-card">
                <Statistic
                  title="Total Quantity"
                  value={calculateTotalItems()}
                  prefix={<ShoppingOutlined />}
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

        {/* Cart Items */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <Card className="cart-empty-card">
              <Empty
                description="Your cart is empty"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => window.location.href = '/'}>
                  Start Shopping
                </Button>
              </Empty>
            </Card>
          ) : (
            <>
              {/* Action Buttons */}
              <div className="cart-actions">
                <Space>
                  <Button 
                    type="primary" 
                    icon={<CreditCardOutlined />}
                    onClick={handleOpenOrderModal}
                    size="large"
                  >
                    Create Order
                  </Button>
                  <Popconfirm
                    title="Clear Cart"
                    description="Are you sure you want to clear your entire cart?"
                    onConfirm={handleClearCart}
                    okText="Yes, Clear"
                    cancelText="Cancel"
                    okType="danger"
                  >
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      loading={removing}
                    >
                      Clear Cart
                    </Button>
                  </Popconfirm>
                </Space>
              </div>

              {/* Items Grid */}
              <Row gutter={[16, 16]}>
                {cartItems.map(item => (
                  <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                    <Card
                      className="cart-item-card"
                      hoverable
                      cover={
                        <div className="item-image-container">
                          <Image
                            src={item.product.imageUrl || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="item-image"
                            preview={false}
                          />
                          <div className="item-overlay">
                            <Button 
                              type="primary" 
                              icon={<EyeOutlined />}
                              onClick={() => {/* View product details */}}
                              className="view-button"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <Card.Meta
                        title={
                          <div className="item-title">
                            <Text strong ellipsis={{ tooltip: item.product.name }}>
                              {item.product.name}
                            </Text>
                          </div>
                        }
                        description={
                          <div className="item-description">
                            <Paragraph ellipsis={{ rows: 2 }}>
                              {item.product.description}
                            </Paragraph>
                            <div className="item-meta">
                              <Space direction="vertical" size="small">
                                <Text strong className="item-price">
                                  ${item.product.price}
                                </Text>
                                <Space>
                                  <Tag color="blue">{item.product.category?.name}</Tag>
                                  <Tag color={item.product.inStockAmount > 0 ? 'green' : 'red'}>
                                    {item.product.inStockAmount > 0 ? 'In Stock' : 'Out of Stock'}
                                  </Tag>
                                </Space>
                                <Text type="secondary" className="seller-info">
                                  Sold by: {item.product.sellerName}
                                </Text>
                              </Space>
                            </div>
                          </div>
                        }
                      />

                      {/* Quantity Section */}
                      <div className="quantity-section">
                        <Space direction="vertical" size="small">
                          <Text strong>Quantity</Text>
                          <Space>
                            <Button 
                              icon={<MinusOutlined />}
                              onClick={() => {
                                if (item.quantity > 1) {
                                  handleUpdateQuantity(item.product.id, item.quantity - 1)
                                }
                              }}
                              disabled={item.quantity <= 1 || updating}
                              size="small"
                            />
                            <InputNumber
                              min={1}
                              max={item.product.inStockAmount}
                              value={item.quantity}
                              onChange={(value) => {
                                if (value && value > 0) {
                                  handleUpdateQuantity(item.product.id, value)
                                }
                              }}
                              disabled={updating}
                              size="small"
                            />
                            <Button 
                              icon={<PlusOutlined />}
                              onClick={() => {
                                if (item.quantity < item.product.inStockAmount) {
                                  handleUpdateQuantity(item.product.id, item.quantity + 1)
                                }
                              }}
                              disabled={item.quantity >= item.product.inStockAmount || updating}
                              size="small"
                            />
                          </Space>
                          <Text className="subtotal">
                            Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                          </Text>
                        </Space>
                      </div>

                      <Card.Meta
                        className="item-actions"
                        description={
                          <Space>
                            <Popconfirm
                              title="Remove Item"
                              description="Are you sure you want to remove this item from your cart?"
                              onConfirm={() => handleRemoveItem(item.product.id)}
                              okText="Yes, Remove"
                              cancelText="Cancel"
                              okType="danger"
                            >
                              <Button 
                                danger 
                                icon={<DeleteOutlined />}
                                loading={removing}
                                size="small"
                              >
                                Remove
                              </Button>
                            </Popconfirm>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>

        {/* Order Creation Modal */}
        <Modal
          title={
            <div className="order-modal-header">
              <CreditCardOutlined className="modal-icon" />
              <span>Create Order</span>
            </div>
          }
          open={orderModalVisible}
          onCancel={() => {
            setOrderModalVisible(false)
            orderForm.resetFields()
          }}
          footer={null}
          width={600}
          className="order-modal"
        >
          <div className="order-summary">
            <Title level={4}>Order Summary</Title>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Items" value={cartItems.length} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Quantity" value={calculateTotalItems()} />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Total Amount" 
                  value={calculateTotalPrice()} 
                  prefix="$" 
                  precision={2}
                />
              </Col>
            </Row>
          </div>

          <Divider />

          <Form
            form={orderForm}
            layout="vertical"
            onFinish={handleCreateOrder}
            className="order-form"
          >
            <Form.Item
              name="deliveryAddress"
              label="Delivery Address"
              rules={[
                { required: true, message: 'Please enter delivery address!' },
                { max: 500, message: 'Address must not exceed 500 characters!' }
              ]}
            >
              <Input.TextArea
                prefix={<EnvironmentOutlined />}
                placeholder="Enter your complete delivery address"
                rows={3}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              name="contactNumber"
              label="Contact Number"
              rules={[
                { required: true, message: 'Please enter contact number!' },
                { 
                  pattern: /^[0-9+\-\s()]{10,15}$/, 
                  message: 'Please enter a valid phone number (10-15 characters)' 
                }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Enter your contact number"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="paymentMethod"
              label="Payment Method"
              rules={[{ required: true, message: 'Please select payment method!' }]}
            >
              <Select
                placeholder="Select payment method"
                size="large"
                options={[
                  { value: 'credit_card', label: 'Credit Card' },
                  { value: 'debit_card', label: 'Debit Card' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
                  { value: 'digital_wallet', label: 'Digital Wallet' }
                ]}
              />
            </Form.Item>

            <Form.Item
              name="notes"
              label="Additional Notes (Optional)"
              rules={[
                { max: 1000, message: 'Notes must not exceed 1000 characters!' }
              ]}
            >
              <Input.TextArea
                placeholder="Any special instructions or notes for your order"
                rows={3}
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={() => {
                    setOrderModalVisible(false)
                    orderForm.resetFields()
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={orderLoading}
                  icon={<CreditCardOutlined />}
                  size="large"
                >
                  Create Order
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default MyCart