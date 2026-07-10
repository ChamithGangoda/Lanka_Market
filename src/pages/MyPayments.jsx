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
  Table,
  Divider,
  Statistic,
  Timeline,
  Descriptions,
  Modal,
  Badge,
  Tooltip
} from 'antd'
import { 
  CreditCardOutlined, 
  EyeOutlined, 
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  TruckOutlined,
  UndoOutlined
} from '@ant-design/icons'
import Navbar from '../components/Navbar'
import orderService from '../services/orderService'
import './MyPayments.css'

const { Title, Text, Paragraph } = Typography

const MyPayments = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderModalVisible, setOrderModalVisible] = useState(false)

  const userId = localStorage.getItem('userId')
  const isAuthenticated = !!userId

  // Load user orders
  const loadOrders = async () => {
    if (!isAuthenticated) {
      messageApi.error('Please login to view your orders')
      return
    }

    setLoading(true)
    try {
      const ordersData = await orderService.getOrdersByUser(userId)
      setOrders(ordersData || [])
    } catch (error) {
      messageApi.error('Failed to load orders: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'orange'
      case 'CONFIRMED':
        return 'blue'
      case 'PROCESSING':
        return 'purple'
      case 'SHIPPED':
        return 'cyan'
      case 'DELIVERED':
        return 'green'
      case 'CANCELLED':
        return 'red'
      case 'REFUNDED':
        return 'volcano'
      default:
        return 'default'
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <ClockCircleOutlined />
      case 'CONFIRMED':
        return <CheckCircleOutlined />
      case 'PROCESSING':
        return <SyncOutlined spin />
      case 'SHIPPED':
        return <TruckOutlined />
      case 'DELIVERED':
        return <CheckCircleOutlined />
      case 'CANCELLED':
        return <CloseCircleOutlined />
      case 'REFUNDED':
        return <UndoOutlined />
      default:
        return <ClockCircleOutlined />
    }
  }

  // Show order details
  const showOrderDetails = (order) => {
    setSelectedOrder(order)
    setOrderModalVisible(true)
  }

  // Table columns
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <Text strong>#{id}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      width: 100,
      render: (products) => (
        <Text>{products?.length || 0} items</Text>
      )
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${amount?.toFixed(2) || '0.00'}
        </Text>
      )
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <Text>{new Date(date).toLocaleDateString()}</Text>
        </Space>
      )
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 120,
      render: (method) => (
        <Tag color="blue">{method || 'N/A'}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showOrderDetails(record)}
          size="small"
        >
          View
        </Button>
      )
    }
  ]

  useEffect(() => {
    loadOrders()
  }, [])

  if (loading) {
    return (
      <>
        {contextHolder}
        <Navbar />
        <div className="payments-loading">
          <Spin size="large" />
          <Text>Loading your orders...</Text>
        </div>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <Navbar />
      <div className="payments-container">
        <div className="payments-header">
          <Title level={1} className="payments-title">
            <CreditCardOutlined className="title-icon" />
            My Orders
          </Title>
          <Text type="secondary" className="payments-subtitle">
            Track your order history and status
          </Text>
        </div>

        {/* Order Statistics */}
        {orders.length > 0 && (
          <Row gutter={16} className="payments-stats">
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Orders"
                  value={orders.length}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Spent"
                  value={orders.reduce((total, order) => total + (order.totalAmount || 0), 0)}
                  prefix={<DollarOutlined />}
                  precision={2}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Delivered"
                  value={orders.filter(order => order.status === 'DELIVERED').length}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Pending"
                  value={orders.filter(order => order.status === 'PENDING').length}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Orders Table */}
        <div className="payments-content">
          {orders.length === 0 ? (
            <Card className="payments-empty-card">
              <Empty
                description="No orders found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => window.location.href = '/'}>
                  Start Shopping
                </Button>
              </Empty>
            </Card>
          ) : (
            <Card className="orders-table-card">
              <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} orders`
                }}
                scroll={{ x: 800 }}
                className="orders-table"
              />
            </Card>
          )}
        </div>

        {/* Order Details Modal */}
        <Modal
          title={
            <div className="order-detail-header">
              <CreditCardOutlined className="modal-icon" />
              <span>Order Details #{selectedOrder?.id}</span>
            </div>
          }
          open={orderModalVisible}
          onCancel={() => {
            setOrderModalVisible(false)
            setSelectedOrder(null)
          }}
          footer={null}
          width={800}
          className="order-detail-modal"
        >
          {selectedOrder && (
            <div className="order-detail-content">
              {/* Order Status Timeline */}
              <Card title="Order Status" className="status-card">
                <Timeline>
                  <Timeline.Item
                    color={selectedOrder.status === 'PENDING' ? 'blue' : 'gray'}
                    dot={getStatusIcon('PENDING')}
                  >
                    <Text strong>Order Placed</Text>
                    <br />
                    <Text type="secondary">{new Date(selectedOrder.createdAt).toLocaleString()}</Text>
                  </Timeline.Item>
                  <Timeline.Item
                    color={['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(selectedOrder.status) ? 'blue' : 'gray'}
                    dot={getStatusIcon('CONFIRMED')}
                  >
                    <Text strong>Order Confirmed</Text>
                  </Timeline.Item>
                  <Timeline.Item
                    color={['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(selectedOrder.status) ? 'blue' : 'gray'}
                    dot={getStatusIcon('PROCESSING')}
                  >
                    <Text strong>Processing</Text>
                  </Timeline.Item>
                  <Timeline.Item
                    color={['SHIPPED', 'DELIVERED'].includes(selectedOrder.status) ? 'blue' : 'gray'}
                    dot={getStatusIcon('SHIPPED')}
                  >
                    <Text strong>Shipped</Text>
                  </Timeline.Item>
                  <Timeline.Item
                    color={selectedOrder.status === 'DELIVERED' ? 'green' : 'gray'}
                    dot={getStatusIcon('DELIVERED')}
                  >
                    <Text strong>Delivered</Text>
                  </Timeline.Item>
                </Timeline>
              </Card>

              {/* Order Information */}
              <Card title="Order Information" className="info-card">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Order ID">
                    <Text strong>#{selectedOrder.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(selectedOrder.status)} icon={getStatusIcon(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Order Date">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Amount">
                    <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                      ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Method">
                    <Tag color="blue">{selectedOrder.paymentMethod || 'N/A'}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Delivery Information */}
              <Card title="Delivery Information" className="delivery-card">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Delivery Address">
                    <Space>
                      <EnvironmentOutlined />
                      <Text>{selectedOrder.deliveryAddress}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Contact Number">
                    <Space>
                      <PhoneOutlined />
                      <Text>{selectedOrder.contactNumber}</Text>
                    </Space>
                  </Descriptions.Item>
                  {selectedOrder.notes && (
                    <Descriptions.Item label="Notes">
                      <Text>{selectedOrder.notes}</Text>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>

              {/* Products */}
              <Card title="Products" className="products-card">
                <Row gutter={[16, 16]}>
                  {selectedOrder.products?.map((product, index) => (
                    <Col xs={24} sm={12} key={index}>
                      <Card className="product-card" size="small">
                        <Row gutter={16}>
                          <Col span={6}>
                            <Image
                              src={product.imageUrl || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="product-image"
                              preview={false}
                            />
                          </Col>
                          <Col span={18}>
                            <div className="product-info">
                              <Text strong className="product-name">
                                {product.name}
                              </Text>
                              <br />
                              <Text type="secondary" className="product-description">
                                {product.description}
                              </Text>
                              <br />
                              <Space>
                                <Text strong style={{ color: '#52c41a' }}>
                                  ${product.price?.toFixed(2) || '0.00'}
                                </Text>
                                <Tag color="blue">{product.category?.name}</Tag>
                              </Space>
                              <br />
                              <Text type="secondary" className="seller-info">
                                Sold by: {product.sellerName}
                              </Text>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </>
  )
}

export default MyPayments