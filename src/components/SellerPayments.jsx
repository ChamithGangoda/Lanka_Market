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
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  InputNumber,
  DatePicker,
  Tooltip,
  Badge
} from 'antd'
import { 
  CreditCardOutlined, 
  EditOutlined, 
  DeleteOutlined, 
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
  UndoOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import orderService from '../services/orderService'
import './SellerPayments.css'

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input

const SellerPayments = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderModalVisible, setOrderModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')

  const sellerId = localStorage.getItem('sellerId')
  const isAuthenticated = !!sellerId

  // Load seller orders
  const loadOrders = async () => {
    if (!isAuthenticated) {
      messageApi.error('Please login as seller to view orders')
      return
    }

    setLoading(true)
    try {
      const ordersData = await orderService.getAllActiveOrders(sellerId)
      setOrders(ordersData || [])
      setFilteredOrders(ordersData || [])
    } catch (error) {
      messageApi.error('Failed to load orders: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter orders by status and search
  const filterOrders = () => {
    let filtered = orders

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(searchText) ||
        order.deliveryAddress?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.contactNumber?.includes(searchText) ||
        order.paymentMethod?.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
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

  // Show update modal
  const showUpdateModal = (order) => {
    setSelectedOrder(order)
    form.setFieldsValue({
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      contactNumber: order.contactNumber,
      notes: order.notes,
      totalAmount: order.totalAmount
    })
    setUpdateModalVisible(true)
  }

  // Update order
  const handleUpdateOrder = async (values) => {
    try {
      await orderService.updateOrder(selectedOrder.id, values)
      messageApi.success('Order updated successfully')
      setUpdateModalVisible(false)
      setSelectedOrder(null)
      form.resetFields()
      loadOrders()
    } catch (error) {
      messageApi.error('Failed to update order: ' + error.message)
    }
  }

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      await orderService.deleteOrder(orderId)
      messageApi.success('Order deleted successfully')
      loadOrders()
    } catch (error) {
      messageApi.error('Failed to delete order: ' + error.message)
    }
  }

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
  }

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
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
      title: 'Customer',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
      render: (userId) => (
        <Text>User #{userId}</Text>
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
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => showOrderDetails(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Update Order">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => showUpdateModal(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Order"
            description="Are you sure you want to delete this order? This action cannot be undone."
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Tooltip title="Delete Order">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [statusFilter, searchText, orders])

  if (loading) {
    return (
      <>
        {contextHolder}
        <div className="seller-payments-loading">
          <Spin size="large" />
          <Text>Loading your orders...</Text>
        </div>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <div className="seller-payments-container">
        <div className="seller-payments-header">
          <Title level={1} className="seller-payments-title">
            <CreditCardOutlined className="title-icon" />
            Order Management
          </Title>
          <Text type="secondary" className="seller-payments-subtitle">
            Manage and track your customer orders
          </Text>
        </div>

        {/* Order Statistics */}
        {orders.length > 0 && (
          <Row gutter={16} className="seller-payments-stats">
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
                  title="Total Revenue"
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

        {/* Filters */}
        <Card className="filters-card">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8}>
              <Space>
                <FilterOutlined />
                <Text strong>Status Filter:</Text>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  style={{ width: 150 }}
                  placeholder="Filter by status"
                >
                  <Option value="ALL">All Orders</Option>
                  <Option value="PENDING">Pending</Option>
                  <Option value="CONFIRMED">Confirmed</Option>
                  <Option value="PROCESSING">Processing</Option>
                  <Option value="SHIPPED">Shipped</Option>
                  <Option value="DELIVERED">Delivered</Option>
                  <Option value="CANCELLED">Cancelled</Option>
                  <Option value="REFUNDED">Refunded</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Input
                placeholder="Search by ID, address, phone, or payment method"
                value={searchText}
                onChange={handleSearchChange}
                allowClear
              />
            </Col>
            <Col xs={24} sm={8}>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadOrders}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Text type="secondary">
                  Showing {filteredOrders.length} of {orders.length} orders
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Orders Table */}
        <div className="seller-payments-content">
          {filteredOrders.length === 0 ? (
            <Card className="seller-payments-empty-card">
              <Empty
                description={orders.length === 0 ? "No orders found" : "No orders match your filters"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                {orders.length === 0 ? (
                  <Button type="primary" onClick={() => window.location.href = '/seller-dashboard'}>
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button onClick={() => {
                    setStatusFilter('ALL')
                    setSearchText('')
                  }}>
                    Clear Filters
                  </Button>
                )}
              </Empty>
            </Card>
          ) : (
            <Card className="orders-table-card">
              <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} orders`
                }}
                scroll={{ x: 1000 }}
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
              {/* Order Information */}
              <Card title="Order Information" className="info-card">
                <Row gutter={16}>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text strong>Order ID: #{selectedOrder.id}</Text>
                      <Text>Status: <Tag color={getStatusColor(selectedOrder.status)} icon={getStatusIcon(selectedOrder.status)}>{selectedOrder.status}</Tag></Text>
                      <Text>Customer: User #{selectedOrder.userId}</Text>
                      <Text>Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text strong>Total Amount: ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}</Text>
                      <Text>Payment Method: <Tag color="blue">{selectedOrder.paymentMethod || 'N/A'}</Tag></Text>
                      <Text>Last Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</Text>
                    </Space>
                  </Col>
                </Row>
              </Card>

              {/* Delivery Information */}
              <Card title="Delivery Information" className="delivery-card">
                <Space direction="vertical" size="small">
                  <Space>
                    <EnvironmentOutlined />
                    <Text strong>Address: </Text>
                    <Text>{selectedOrder.deliveryAddress}</Text>
                  </Space>
                  <Space>
                    <PhoneOutlined />
                    <Text strong>Contact: </Text>
                    <Text>{selectedOrder.contactNumber}</Text>
                  </Space>
                  {selectedOrder.notes && (
                    <Space>
                      <Text strong>Notes: </Text>
                      <Text>{selectedOrder.notes}</Text>
                    </Space>
                  )}
                </Space>
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

        {/* Update Order Modal */}
        <Modal
          title={
            <div className="order-detail-header">
              <EditOutlined className="modal-icon" />
              <span>Update Order #{selectedOrder?.id}</span>
            </div>
          }
          open={updateModalVisible}
          onCancel={() => {
            setUpdateModalVisible(false)
            setSelectedOrder(null)
            form.resetFields()
          }}
          footer={null}
          width={600}
          className="order-detail-modal"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateOrder}
            className="update-order-form"
          >
            <Form.Item
              name="status"
              label="Order Status"
              rules={[{ required: true, message: 'Please select order status' }]}
            >
              <Select placeholder="Select status">
                <Option value="PENDING">Pending</Option>
                <Option value="CONFIRMED">Confirmed</Option>
                <Option value="PROCESSING">Processing</Option>
                <Option value="SHIPPED">Shipped</Option>
                <Option value="DELIVERED">Delivered</Option>
                <Option value="CANCELLED">Cancelled</Option>
                <Option value="REFUNDED">Refunded</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="deliveryAddress"
              label="Delivery Address"
              rules={[
                { required: true, message: 'Please enter delivery address' },
                { max: 500, message: 'Address must be less than 500 characters' }
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Enter delivery address"
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="contactNumber"
              label="Contact Number"
              rules={[
                { required: true, message: 'Please enter contact number' },
                { pattern: /^[\d\s\-\+\(\)]+$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input placeholder="Enter contact number" />
            </Form.Item>

            <Form.Item
              name="totalAmount"
              label="Total Amount"
              rules={[
                { required: true, message: 'Please enter total amount' },
                { type: 'number', min: 0, message: 'Amount must be positive' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter total amount"
                min={0}
                precision={2}
                prefix="$"
              />
            </Form.Item>

            <Form.Item
              name="notes"
              label="Additional Notes"
              rules={[{ max: 1000, message: 'Notes must be less than 1000 characters' }]}
            >
              <TextArea
                rows={3}
                placeholder="Enter any additional notes"
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Order
                </Button>
                <Button onClick={() => {
                  setUpdateModalVisible(false)
                  setSelectedOrder(null)
                  form.resetFields()
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default SellerPayments