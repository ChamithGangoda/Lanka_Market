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
  Popconfirm,
  Upload,
  Image
} from 'antd'
import { 
  UserOutlined, 
  ShopOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  LockOutlined,
  PictureOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  LogoutOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import sellerService from '../services/sellerService'
import './SellerProfile.css'

const { Title, Text } = Typography
const { TextArea } = Input

const SellerProfile = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [seller, setSeller] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Load seller data
  const loadSellerData = async () => {
    setLoading(true)
    try {
      const sellerId = localStorage.getItem('sellerId')
      if (!sellerId) {
        messageApi.error('Seller ID not found. Please login again.')
        navigate('/seller-login')
        return
      }

      const sellerData = await sellerService.getSellerById(sellerId)
      if (sellerData) {
        setSeller(sellerData)
        form.setFieldsValue({
          name: sellerData.name,
          businessRegNumber: sellerData.businessRegNumber,
          email: sellerData.email,
          addressDescription: sellerData.addressDescription,
          imageUrl: sellerData.imageUrl
        })
      } else {
        messageApi.error('Failed to load seller data')
      }
    } catch (error) {
      messageApi.error('Failed to load seller data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Update seller profile
  const handleUpdate = async (values) => {
    setLoading(true)
    try {
      const sellerId = localStorage.getItem('sellerId')
      if (!sellerId) {
        messageApi.error('Seller ID not found. Please login again.')
        return
      }

      const updateData = {
        name: values.name,
        businessRegNumber: values.businessRegNumber.toUpperCase(),
        email: values.email,
        addressDescription: values.addressDescription,
        imageUrl: values.imageUrl || null
      }

      const updatedSeller = await sellerService.updateSeller(sellerId, updateData)
      
      // Update localStorage with new data
      localStorage.setItem('sellerName', updatedSeller.name)
      localStorage.setItem('sellerEmail', updatedSeller.email)
      localStorage.setItem('sellerBusinessReg', updatedSeller.businessRegNumber)
      localStorage.setItem('sellerData', JSON.stringify(updatedSeller))
      
      setSeller(updatedSeller)
      setIsEditMode(false)
      messageApi.success('Profile updated successfully!')
    } catch (error) {
      messageApi.error('Failed to update profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete seller account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      const sellerId = localStorage.getItem('sellerId')
      if (!sellerId) {
        messageApi.error('Seller ID not found. Please login again.')
        return
      }

      await sellerService.deleteSeller(sellerId)
      
      // Clear localStorage
      localStorage.removeItem('sellerId')
      localStorage.removeItem('sellerName')
      localStorage.removeItem('sellerEmail')
      localStorage.removeItem('sellerBusinessReg')
      localStorage.removeItem('sellerData')
      
      messageApi.success('Account deleted successfully!')
      navigate('/seller-auth')
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
    localStorage.removeItem('sellerId')
    localStorage.removeItem('sellerName')
    localStorage.removeItem('sellerEmail')
    localStorage.removeItem('sellerBusinessReg')
    localStorage.removeItem('sellerData')
    
    messageApi.success('Logged out successfully!')
    navigate('/seller-auth')
  }

  // Validation patterns
  const validationPatterns = {
    name: {
      pattern: /^[a-zA-Z\s]{2,100}$/,
      message: 'Name must be 2-100 characters, letters and spaces only'
    },
    businessRegNumber: {
      pattern: /^[A-Z0-9-]{5,20}$/,
      message: 'Business registration number must be 5-20 characters, uppercase letters, numbers, and hyphens only'
    },
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Please enter a valid email address'
    },
    imageUrl: {
      pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: 'Please enter a valid URL format'
    }
  }

  // Custom validators
  const validateBusinessRegNumber = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Business registration number is required'))
    }
    if (!validationPatterns.businessRegNumber.pattern.test(value)) {
      return Promise.reject(new Error(validationPatterns.businessRegNumber.message))
    }
    return Promise.resolve()
  }

  const validateImageUrl = (_, value) => {
    if (!value) {
      return Promise.resolve() // Optional field
    }
    if (!validationPatterns.imageUrl.pattern.test(value)) {
      return Promise.reject(new Error(validationPatterns.imageUrl.message))
    }
    return Promise.resolve()
  }

  useEffect(() => {
    loadSellerData()
  }, [])

  if (!seller) {
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
      <div className="seller-profile">
        <Row gutter={24}>
          {/* Profile Information Card */}
          <Col xs={24} lg={16}>
            <Card className="profile-card">
              <div className="profile-header">
                <div className="profile-info">
                  <Avatar 
                    size={80} 
                    icon={<UserOutlined />} 
                    src={seller.imageUrl}
                    className="profile-avatar"
                  />
                  <div className="profile-details">
                    <Title level={2} className="profile-name">{seller.name}</Title>
                    <Text type="secondary" className="profile-reg">
                      {seller.businessRegNumber}
                    </Text>
                    <Text type="secondary" className="profile-email">
                      {seller.email}
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
                            loadSellerData()
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
                      name="name"
                      label="Business Name"
                      rules={[
                        { required: true, message: 'Please enter business name!' },
                        { min: 2, message: 'Name must be at least 2 characters!' },
                        { max: 100, message: 'Name must not exceed 100 characters!' },
                        { pattern: /^[a-zA-Z\s]+$/, message: 'Name can only contain letters and spaces!' }
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter your business name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="businessRegNumber"
                      label="Business Registration Number"
                      rules={[{ validator: validateBusinessRegNumber }]}
                    >
                      <Input
                        prefix={<ShopOutlined />}
                        placeholder="e.g., ABC123-DEF456"
                        size="large"
                        style={{ textTransform: 'uppercase' }}
                        onChange={(e) => {
                          e.target.value = e.target.value.toUpperCase()
                        }}
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
                  name="addressDescription"
                  label="Business Address"
                  rules={[
                    { required: true, message: 'Please enter business address!' },
                    { max: 500, message: 'Address must not exceed 500 characters!' }
                  ]}
                >
                  <TextArea
                    prefix={<EnvironmentOutlined />}
                    placeholder="Enter your complete business address"
                    rows={4}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="imageUrl"
                  label="Business Logo URL (Optional)"
                  rules={[{ validator: validateImageUrl }]}
                >
                  <Input
                    prefix={<PictureOutlined />}
                    placeholder="https://example.com/logo.jpg"
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
                  <Text>{new Date(seller.createdAt).toLocaleDateString()}</Text>
                </div>
                <div className="stat-item">
                  <Text strong>Last Updated:</Text>
                  <Text>{new Date(seller.updatedAt).toLocaleDateString()}</Text>
                </div>
                <div className="stat-item">
                  <Text strong>Account Status:</Text>
                  <Text type={seller.isDeleted ? 'danger' : 'success'}>
                    {seller.isDeleted ? 'Deleted' : 'Active'}
                  </Text>
                </div>
                <div className="stat-item">
                  <Text strong>Has Logo:</Text>
                  <Text>{seller.imageUrl ? 'Yes' : 'No'}</Text>
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
              This action cannot be undone. All your products and data will be permanently deleted.
            </Text>
            <div className="warning-details">
              <Text strong>This will delete:</Text>
              <ul>
                <li>Your seller account</li>
                <li>All your products</li>
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

export default SellerProfile