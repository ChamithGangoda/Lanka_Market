import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  message, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Avatar, 
  Divider,
  Modal,
  Popconfirm
} from 'antd'
import { 
  UserOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import userService from '../services/userService'
import './Profile.css'
import Navbar from '../components/Navbar'

const { Title, Text } = Typography

const Profile = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Load user data
  const loadUserData = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        messageApi.error('User ID not found. Please login again.')
        window.location.href = '/login'
        return
      }

      const userData = await userService.getUserById(userId)
      if (userData) {
        setUser(userData)
        form.setFieldsValue({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          address: userData.address
        })
      } else {
        messageApi.error('Failed to load user data')
      }
    } catch (error) {
      messageApi.error('Failed to load user data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  const handleUpdate = async (values) => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        messageApi.error('User ID not found. Please login again.')
        return
      }

      const updateData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        address: values.address
      }

      const updatedUser = await userService.updateUser(userId, updateData)
      
      // Update localStorage with new data
      localStorage.setItem('userFirstName', updatedUser.firstName)
      localStorage.setItem('userLastName', updatedUser.lastName)
      localStorage.setItem('userEmail', updatedUser.email)
      localStorage.setItem('userFullName', updatedUser.firstName + ' ' + updatedUser.lastName)
      localStorage.setItem('userData', JSON.stringify(updatedUser))
      
      setUser(updatedUser)
      setIsEditMode(false)
      messageApi.success('Profile updated successfully!')
    } catch (error) {
      messageApi.error('Failed to update profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete user account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        messageApi.error('User ID not found. Please login again.')
        return
      }

      await userService.deleteUser(userId)
      
      // Clear localStorage
      localStorage.removeItem('userId')
      localStorage.removeItem('userFirstName')
      localStorage.removeItem('userLastName')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userFullName')
      localStorage.removeItem('userData')
      
      messageApi.success('Account deleted successfully!')
      window.location.href = '/login'
    } catch (error) {
      messageApi.error('Failed to delete account: ' + error.message)
    } finally {
      setDeleteLoading(false)
      setIsDeleteModalVisible(false)
    }
  }

  // Logout function
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userId')
    localStorage.removeItem('userFirstName')
    localStorage.removeItem('userLastName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userFullName')
    localStorage.removeItem('userData')
    
    messageApi.success('Logged out successfully!')
    window.location.href = '/login'
  }

  // Validation patterns
  const validationPatterns = {
    firstName: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: 'First name must be 2-50 characters, letters and spaces only'
    },
    lastName: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: 'Last name must be 2-50 characters, letters and spaces only'
    },
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Please enter a valid email address'
    }
  }

  // Custom validators
  const validateFirstName = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('First name is required'))
    }
    if (!validationPatterns.firstName.pattern.test(value)) {
      return Promise.reject(new Error(validationPatterns.firstName.message))
    }
    return Promise.resolve()
  }

  const validateLastName = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Last name is required'))
    }
    if (!validationPatterns.lastName.pattern.test(value)) {
      return Promise.reject(new Error(validationPatterns.lastName.message))
    }
    return Promise.resolve()
  }

  useEffect(() => {
    loadUserData()
  }, [])

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Text>Loading...</Text>
      </div>
    )
  }

  return (
    <>
      {contextHolder}
      <Navbar/>
      <div className="user-profile">
        <Row gutter={24}>
          {/* Profile Information Card */}
          <Col xs={24} lg={16}>
            <Card className="profile-card">
              <div className="profile-header">
                <div className="profile-info">
                  <Avatar 
                    size={80} 
                    icon={<UserOutlined />} 
                    className="profile-avatar"
                  />
                  <div className="profile-details">
                    <Title level={2} className="profile-name">
                      {user.firstName} {user.lastName}
                    </Title>
                    <Text type="secondary" className="profile-email">
                      {user.email}
                    </Text>
                    <Text type="secondary" className="profile-address">
                      {user.address}
                    </Text>
                  </div>
                </div>
                <div className="profile-actions">
                  <Space>
                    {!isEditMode ? (
                      <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => setIsEditMode(true)}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Space>
                        <Button 
                          type="primary" 
                          icon={<SaveOutlined />}
                          onClick={() => form.submit()}
                          loading={loading}
                        >
                          Save Changes
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsEditMode(false)
                            form.resetFields()
                            loadUserData()
                          }}
                        >
                          Cancel
                        </Button>
                      </Space>
                    )}
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => setIsDeleteModalVisible(true)}
                    >
                      Delete Account
                    </Button>
                    <Button 
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </Space>
                </div>
              </div>

              <Divider />

              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
                disabled={!isEditMode}
                scrollToFirstError
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ validator: validateFirstName }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter your first name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ validator: validateLastName }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter your last name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    { required: true, message: 'Please enter your address!' },
                    { max: 255, message: 'Address must not exceed 255 characters!' }
                  ]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Enter your complete address"
                    size="large"
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Account Statistics Card */}
          <Col xs={24} lg={8}>
            <Card className="stats-card" title="Account Information">
              <div className="stats-content">
                <div className="stat-item">
                  <Text strong>Account Created:</Text>
                  <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
                </div>
                <div className="stat-item">
                  <Text strong>Last Updated:</Text>
                  <Text>{new Date(user.updatedAt).toLocaleDateString()}</Text>
                </div>
                <div className="stat-item">
                  <Text strong>Account Status:</Text>
                  <Text type={user.isDeleted ? 'danger' : 'success'}>
                    {user.isDeleted ? 'Deleted' : 'Active'}
                  </Text>
                </div>
                <div className="stat-item">
                  <Text strong>Full Name:</Text>
                  <Text>{user.firstName} {user.lastName}</Text>
                </div>
              </div>
            </Card>

            <Card className="actions-card" title="Account Actions">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  block 
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <Button 
                  block 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => setIsDeleteModalVisible(true)}
                >
                  Delete Account
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Delete Account Confirmation Modal */}
        <Modal
          title="Delete Account"
          open={isDeleteModalVisible}
          onCancel={() => setIsDeleteModalVisible(false)}
          footer={null}
          width={500}
        >
          <div className="delete-modal-content">
            <div className="warning-icon">
              <DeleteOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
            </div>
            <Title level={4} className="warning-title">
              Are you sure you want to delete your account?
            </Title>
            <Text type="secondary" className="warning-description">
              This action cannot be undone. All your data will be permanently deleted.
            </Text>
            <div className="warning-details">
              <Text strong>This will delete:</Text>
              <ul>
                <li>Your user account</li>
                <li>All your reviews</li>
                <li>Your wishlist</li>
                <li>All associated data</li>
              </ul>
            </div>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsDeleteModalVisible(false)}>
                Cancel
              </Button>
              <Popconfirm
                title="Type 'DELETE' to confirm"
                description="This action cannot be undone!"
                onConfirm={handleDeleteAccount}
                okText="Delete"
                cancelText="Cancel"
                okType="danger"
              >
                <Button 
                  danger 
                  loading={deleteLoading}
                  icon={<DeleteOutlined />}
                >
                  Delete Account
                </Button>
              </Popconfirm>
            </Space>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default Profile