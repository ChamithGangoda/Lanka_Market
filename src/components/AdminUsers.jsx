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
  UserOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
  HeartOutlined
} from '@ant-design/icons'
import userService from '../services/userService'
import './AdminUsers.css'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const AdminUsers = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')

  // Load users
  const loadUsers = async () => {
    setLoading(true)
    try {
      const usersData = await userService.getAllActiveUsers()
      setUsers(usersData || [])
      setFilteredUsers(usersData || [])
    } catch (error) {
      messageApi.error('Failed to load users: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter users
  const filterUsers = () => {
    let filtered = [...users]

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(user => user.isDeleted === (statusFilter === 'DELETED'))
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phoneNumber?.includes(searchText)
      )
    }

    setFilteredUsers(filtered)
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

  // Show user details
  const showUserDetails = (user) => {
    setSelectedUser(user)
    setViewModalVisible(true)
  }

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId)
      messageApi.success('User deleted successfully')
      loadUsers()
    } catch (error) {
      messageApi.error('Failed to delete user: ' + error.message)
    }
  }

  // Restore user
  const handleRestoreUser = async (userId) => {
    try {
      await userService.restoreUser(userId)
      messageApi.success('User restored successfully')
      loadUsers()
    } catch (error) {
      messageApi.error('Failed to restore user: ' + error.message)
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
      title: 'User',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar 
            size="large" 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#52c41a' }}
          />
          <div>
            <Text strong className="user-name">
              {record.firstName} {record.lastName}
            </Text>
            <br />
            <Text type="secondary" className="user-email">
              {record.email}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 150,
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
              onClick={() => showUserDetails(record)}
              size="small"
            />
          </Tooltip>
          {record.isDeleted ? (
            <Popconfirm
              title="Restore User"
              description="Are you sure you want to restore this user?"
              onConfirm={() => handleRestoreUser(record.id)}
              okText="Yes"
              cancelText="No"
              okType="primary"
            >
              <Tooltip title="Restore User">
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
              title="Delete User"
              description="Are you sure you want to delete this user? This action cannot be undone."
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Tooltip title="Delete User">
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
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [statusFilter, searchText, users])

  if (loading) {
    return (
      <>
        {contextHolder}
        <div className="admin-users-loading">
          <Spin size="large" />
          <Text>Loading users...</Text>
        </div>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <div className="admin-users-container">
        <div className="admin-users-header">
          <Title level={1} className="admin-users-title">
            <UserOutlined className="title-icon" />
            User Management
          </Title>
          <Text type="secondary" className="admin-users-subtitle">
            Manage and monitor all users on LankaMarket
          </Text>
        </div>

        {/* User Statistics */}
        {users.length > 0 && (
          <Row gutter={16} className="admin-users-stats">
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Users"
                  value={users.length}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Active Users"
                  value={users.filter(user => !user.isDeleted).length}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Deleted Users"
                  value={users.filter(user => user.isDeleted).length}
                  prefix={<CloseCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="New This Month"
                  value={users.filter(user => {
                    const userDate = new Date(user.createdAt)
                    const monthAgo = new Date()
                    monthAgo.setMonth(monthAgo.getMonth() - 1)
                    return userDate > monthAgo
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
                  <Option value="ALL">All Users</Option>
                  <Option value="ACTIVE">Active</Option>
                  <Option value="DELETED">Deleted</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Input
                placeholder="Search by name, email, or phone"
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
                  onClick={loadUsers}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Text type="secondary">
                  Showing {filteredUsers.length} of {users.length} users
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Users Table */}
        <div className="admin-users-content">
          {filteredUsers.length === 0 ? (
            <Card className="admin-users-empty-card">
              <Empty
                description={users.length === 0 ? "No users found" : "No users match your filters"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                {users.length === 0 ? (
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
            <Card className="users-table-card">
              <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} users`
                }}
                scroll={{ x: 1000 }}
                className="users-table"
              />
            </Card>
          )}
        </div>

        {/* User Details Modal */}
        <Modal
          title={
            <div className="user-detail-header">
              <UserOutlined className="modal-icon" />
              <span>User Details</span>
            </div>
          }
          open={viewModalVisible}
          onCancel={() => {
            setViewModalVisible(false)
            setSelectedUser(null)
          }}
          footer={null}
          width={700}
          className="user-detail-modal"
        >
          {selectedUser && (
            <div className="user-detail-content">
              <Card className="user-info-card">
                <div className="user-header">
                  <Avatar 
                    size={80} 
                    icon={<UserOutlined />} 
                    style={{ backgroundColor: '#52c41a' }}
                  />
                  <div className="user-info">
                    <Title level={3} className="user-name">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </Title>
                    <Text type="secondary" className="user-email">
                      {selectedUser.email}
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <Tag color={getStatusColor(selectedUser.isDeleted)} icon={getStatusIcon(selectedUser.isDeleted)}>
                        {getStatusText(selectedUser.isDeleted)}
                      </Tag>
                    </div>
                  </div>
                </div>
                
                <Divider />
                
                <Descriptions title="Contact Information" bordered column={2}>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined />
                      <Text>{selectedUser.email}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <Space>
                      <PhoneOutlined />
                      <Text>{selectedUser.phoneNumber || 'N/A'}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>
                    <Space>
                      <EnvironmentOutlined />
                      <Text>{selectedUser.address || 'N/A'}</Text>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Descriptions title="Account Information" bordered column={2}>
                  <Descriptions.Item label="User ID">
                    <Text strong>#{selectedUser.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(selectedUser.isDeleted)} icon={getStatusIcon(selectedUser.isDeleted)}>
                      {getStatusText(selectedUser.isDeleted)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Joined Date">
                    <Space>
                      <CalendarOutlined />
                      <Text>{new Date(selectedUser.createdAt).toLocaleString()}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    <Space>
                      <CalendarOutlined />
                      <Text>{new Date(selectedUser.updatedAt).toLocaleString()}</Text>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div className="user-activity">
                  <Title level={4}>User Activity</Title>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card size="small" className="activity-card">
                        <Statistic
                          title="Orders"
                          value={0}
                          prefix={<ShoppingCartOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small" className="activity-card">
                        <Statistic
                          title="Reviews"
                          value={0}
                          prefix={<HeartOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small" className="activity-card">
                        <Statistic
                          title="Wishlist Items"
                          value={0}
                          prefix={<HeartOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </>
  )
}

export default AdminUsers