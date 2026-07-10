import React, { useState } from 'react'
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  message, 
  Space, 
  Typography,
  Divider,
  Row,
  Col
} from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  ShopOutlined, 
  EnvironmentOutlined,
  PictureOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import sellerService from '../services/sellerService'
import './SellerAuth.css'

const { Title, Text } = Typography
const { TabPane } = Tabs

const SellerAuth = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [activeTab, setActiveTab] = useState('login')
  const [loginForm] = Form.useForm()
  const [signupForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Validation patterns based on backend constraints
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
    password: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    },
    imageUrl: {
      pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: 'Please enter a valid URL format'
    }
  }

  // Login handler
  const handleLogin = async (values) => {
    setLoading(true)
    try {
      const seller = await sellerService.loginSeller(values.email, values.password)
      
      // Save seller data to localStorage
      localStorage.setItem('sellerId', seller.id)
      localStorage.setItem('sellerName', seller.name)
      localStorage.setItem('sellerEmail', seller.email)
      localStorage.setItem('sellerBusinessReg', seller.businessRegNumber)
      localStorage.setItem('sellerData', JSON.stringify(seller))
      
      messageApi.success('Login successful! Welcome back!')
      navigate('/seller-dashboard')
    } catch (error) {
      messageApi.error('Login failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Signup handler
  const handleSignup = async (values) => {
    setLoading(true)
    try {
      const sellerData = {
        name: values.name,
        businessRegNumber: values.businessRegNumber.toUpperCase(),
        email: values.email,
        addressDescription: values.addressDescription,
        password: values.password,
        imageUrl: values.imageUrl || null
      }

      const newSeller = await sellerService.createSeller(sellerData)
      
      messageApi.success('Account created successfully! Please login to continue.')
      setActiveTab('login')
      signupForm.resetFields()
    } catch (error) {
      messageApi.error('Signup failed: ' + error.message)
    } finally {
      setLoading(false)
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

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Password is required'))
    }
    if (!validationPatterns.password.pattern.test(value)) {
      return Promise.reject(new Error(validationPatterns.password.message))
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

  return (
    <>
      {contextHolder}
      <div className="seller-auth-container">
        <Row justify="center" align="middle" className="auth-row">
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <Card className="auth-card">
              <div className="auth-header">
                <Title level={2} className="auth-title">
                  <ShopOutlined className="title-icon" />
                  Seller Portal
                </Title>
                <Text type="secondary" className="auth-subtitle">
                  Manage your business and products
                </Text>
              </div>

              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                className="auth-tabs"
                centered
              >
                <TabPane 
                  tab={
                    <span>
                      <LoginOutlined />
                      Login
                    </span>
                  } 
                  key="login"
                >
                  <Form
                    form={loginForm}
                    layout="vertical"
                    onFinish={handleLogin}
                    className="auth-form"
                  >
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
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Please enter your password!' }
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Enter your password"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                        className="auth-button"
                      >
                        Sign In
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>

                <TabPane 
                  tab={
                    <span>
                      <UserAddOutlined />
                      Sign Up
                    </span>
                  } 
                  key="signup"
                >
                  <Form
                    form={signupForm}
                    layout="vertical"
                    onFinish={handleSignup}
                    className="auth-form"
                    scrollToFirstError
                  >
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
                      <Input.TextArea
                        prefix={<EnvironmentOutlined />}
                        placeholder="Enter your complete business address"
                        rows={3}
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[{ validator: validatePassword }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Enter a strong password"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="Confirm Password"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve()
                            }
                            return Promise.reject(new Error('Passwords do not match!'))
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirm your password"
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

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                        className="auth-button"
                      >
                        Create Account
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>

              <Divider />
              <div className="auth-footer">
                <Text type="secondary">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default SellerAuth