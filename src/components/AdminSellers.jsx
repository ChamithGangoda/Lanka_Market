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
  Spin,
  Empty,
  Table,
  Popconfirm,
  Tooltip,
  Statistic,
  Input,
  Select,
  Avatar,
  Badge,
  Divider,
  Descriptions,
  Modal
} from 'antd'
import { 
  ShopOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined
} from '@ant-design/icons'
import sellerService from '../services/sellerService'
import './AdminSellers.css'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const AdminSellers = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [sellers, setSellers] = useState([])
  const [filteredSellers, setFilteredSellers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')

  // Load sellers
  const loadSellers = async () => {
    setLoading(true)
    try {
      const sellersData = await sellerService.getAllActiveSellers()
      setSellers(sellersData || [])
      setFilteredSellers(sellersData || [])
    } catch (error) {
      messageApi.error('Failed to load sellers: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter sellers
  const filterSellers = () => {
    let filtered = [...sellers]

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(seller => seller.isDeleted === (statusFilter === 'DELETED'))
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(seller => 
        seller.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
        seller.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
        seller.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        seller.phoneNumber?.includes(searchText) ||
        seller.businessName?.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    setFilteredSellers(filtered)
  }

  // Get status color
  const getStatusColor = (isDeleted) => {
    return isDeleted ? 'red' : 'green'
  }

  // Get status text
  const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active'
  }

  // Get status icon
  const getStatusIcon = (isDeleted) => {
    return isDeleted ? <CloseCircleOutlined /> : <CheckCircleOutlined />
  }

  // Show seller details
  const showSellerDetails = (seller) => {
    setSelectedSeller(seller)
    setViewModalVisible(true)
  }

  // Delete seller
  const handleDeleteSeller = async (sellerId) => {
    try {
      await sellerService.deleteSeller(sellerId)
      messageApi.success('Seller deleted successfully')
      loadSellers()
    } catch (error) {
      messageApi.error('Failed to delete seller: ' + error.message)
    }
  }

  // Restore seller
  const handleRestoreSeller = async (sellerId) => {
    try {
      await sellerService.restoreSeller(sellerId)
      messageApi.success('Seller restored successfully')
      loadSellers()
    } catch (error) {
      messageApi.error('Failed to restore seller: ' + error.message)
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
      title: 'Seller',
      key: 'seller',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar 
            size="large" 
            icon={<ShopOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <Text strong className="seller-name">
              {record.firstName} {record.lastName}
            </Text>
            <br />
            <Text type="secondary" className="business-name">
              {record.businessName || 'No Business Name'}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <MailOutlined />
            <Text>{record.email}</Text>
          </Space>
          <Space>
            <PhoneOutlined />
            <Text>{record.phoneNumber || 'N/A'}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: 'Location',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      render: (address) => (
        <Space>
          <EnvironmentOutlined />
          <Text>{address || 'N/A'}</Text>
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 100,
      render: (isDeleted) => (
        <Tag color={getStatusColor(isDeleted)} icon={getStatusIcon(isDeleted)}>
          {getStatusText(isDeleted)}
        </Tag>
      )
    },
    {
      title: 'Joined Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <Text>{new Date(date).toLocaleDateString()}</Text>
        </Space>
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
              onClick={() => showSellerDetails(record)}
              size="small"
            />
          </Tooltip>
          {record.isDeleted ? (
            <Popconfirm
              title="Restore Seller"
              description="Are you sure you want to restore this seller?"
              onConfirm={() => handleRestoreSeller(record.id)}
              okText="Yes"
              cancelText="No"
              okType="primary"
            >
              <Tooltip title="Restore Seller">
                <Button
                  type="default"
                  icon={<CheckCircleOutlined />}
                  size="small"
                >
                  Restore
                </Button>
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Delete Seller"
              description="Are you sure you want to delete this seller? This action cannot be undone."
              onConfirm={() => handleDeleteSeller(record.id)}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Tooltip title="Delete Seller">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  useEffect(() => {
    loadSellers()
  }, [])

  useEffect(() => {
    filterSellers()
  }, [statusFilter, searchText, sellers])

  if (loading) {
    return (
      <>
        {contextHolder}
        <div className="admin-sellers-loading">
          <Spin size="large" />
          <Text>Loading sellers...</Text>
        </div>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <div className="admin-sellers-container">
        <div className="admin-sellers-header">
          <Title level={1} className="admin-sellers-title">
            <ShopOutlined className="title-icon" />
            Seller Management
          </Title>
          <Text type="secondary" className="admin-sellers-subtitle">
            Manage and monitor all sellers on LankaMarket
          </Text>
        </div>

        {/* Seller Statistics */}
        {sellers.length > 0 && (
          <Row gutter={16} className="admin-sellers-stats">
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Sellers"
                  value={sellers.length}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Active Sellers"
                  value={sellers.filter(seller => !seller.isDeleted).length}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Deleted Sellers"
                  value={sellers.filter(seller => seller.isDeleted).length}
                  prefix={<CloseCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="New This Month"
                  value={sellers.filter(seller => {
                    const sellerDate = new Date(seller.createdAt)
                    const monthAgo = new Date()
                    monthAgo.setMonth(monthAgo.getMonth() - 1)
                    return sellerDate > monthAgo
                  }).length}
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
                  <Option value="ALL">All Sellers</Option>
                  <Option value="ACTIVE">Active</Option>
                  <Option value="DELETED">Deleted</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Input
                placeholder="Search by name, email, phone, or business name"
                value={searchText}
                onChange={handleSearchChange}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} sm={8}>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadSellers}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Text type="secondary">
                  Showing {filteredSellers.length} of {sellers.length} sellers
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Sellers Table */}
        <div className="admin-sellers-content">
          {filteredSellers.length === 0 ? (
            <Card className="admin-sellers-empty-card">
              <Empty
                description={sellers.length === 0 ? "No sellers found" : "No sellers match your filters"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                {sellers.length === 0 ? (
                  <Button type="primary" onClick={() => window.location.href = '/admin-dashboard'}>
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
            <Card className="sellers-table-card">
              <Table
                columns={columns}
                dataSource={filteredSellers}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} sellers`
                }}
                scroll={{ x: 1000 }}
                className="sellers-table"
              />
            </Card>
          )}
        </div>

        {/* Seller Details Modal */}
        <Modal
          title={
            <div className="seller-detail-header">
              <ShopOutlined className="modal-icon" />
              <span>Seller Details</span>
            </div>
          }
          open={viewModalVisible}
          onCancel={() => {
            setViewModalVisible(false)
            setSelectedSeller(null)
          }}
          footer={null}
          width={700}
          className="seller-detail-modal"
        >
          {selectedSeller && (
            <div className="seller-detail-content">
              <Card className="seller-info-card">
                <div className="seller-header">
                  <Avatar 
                    size={80} 
                    icon={<ShopOutlined />} 
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <div className="seller-info">
                    <Title level={3} className="seller-name">
                      {selectedSeller.firstName} {selectedSeller.lastName}
                    </Title>
                    <Text type="secondary" className="business-name">
                      {selectedSeller.businessName || 'No Business Name'}
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <Tag color={getStatusColor(selectedSeller.isDeleted)} icon={getStatusIcon(selectedSeller.isDeleted)}>
                        {getStatusText(selectedSeller.isDeleted)}
                      </Tag>
                    </div>
                  </div>
                </div>
                
                <Divider />
                
                <Descriptions title="Contact Information" bordered column={2}>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined />
                      <Text>{selectedSeller.email}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <Space>
                      <PhoneOutlined />
                      <Text>{selectedSeller.phoneNumber || 'N/A'}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>
                    <Space>
                      <EnvironmentOutlined />
                      <Text>{selectedSeller.address || 'N/A'}</Text>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Descriptions title="Account Information" bordered column={2}>
                  <Descriptions.Item label="Seller ID">
                    <Text strong>#{selectedSeller.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(selectedSeller.isDeleted)} icon={getStatusIcon(selectedSeller.isDeleted)}>
                      {getStatusText(selectedSeller.isDeleted)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Joined Date">
                    <Space>
                      <CalendarOutlined />
                      <Text>{new Date(selectedSeller.createdAt).toLocaleString()}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    <Space>
                      <CalendarOutlined />
                      <Text>{new Date(selectedSeller.updatedAt).toLocaleString()}</Text>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>

                {selectedSeller.businessDescription && (
                  <>
                    <Divider />
                    <div className="business-description">
                      <Title level={4}>Business Description</Title>
                      <Paragraph className="description-text">
                        {selectedSeller.businessDescription}
                      </Paragraph>
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </>
  )
}

export default AdminSellers