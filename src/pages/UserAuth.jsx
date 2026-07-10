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
  EnvironmentOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import userService from '../services/userService'
import './UserAuth.css'

const { Title, Text } = Typography
const { TabPane } = Tabs

const UserAuth = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [activeTab, setActiveTab] = useState('login')
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Validation patterns based on backend constraints
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
    },
    password: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    }
  }

  // Login handler
  const handleLogin = async (values) => {
    setLoading(true)
    try {
      const user = await userService.loginUser(values.email, values.password)
      
      // Save user data to localStorage
      localStorage.setItem('userId', user.id)
      localStorage.setItem('userFirstName', user.firstName)
      localStorage.setItem('userLastName', user.lastName)
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('userFullName', user.firstName + ' ' + user.lastName)
      localStorage.setItem('userData', JSON.stringify(user))
      
      messageApi.success('Login successful! Welcome back!')
      
      // Navigate to home page
       setTimeout(() => {
        window.location.href = '/'
       }, 3000)
    } catch (error) {
      messageApi.error('Login failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Register handler
  const handleRegister = async (values) => {
    setLoading(true)
    try {
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        address: values.address
      }

      const newUser = await userService.createUser(userData)
      
      messageApi.success('Account created successfully! Please login to continue.')
      setActiveTab('login')
      registerForm.resetFields()
    } catch (error) {
      messageApi.error('Registration failed: ' + error.message)
    } finally {
      setLoading(false)
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

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Password is required'))
    }
    if (!validationPatterns.password.pattern.test(value)) {
      return Promise.reject(new Error(validationPatterns.password.message))
    }
    return Promise.resolve()
  }

  return (
    <>
      {contextHolder}
      <div className="user-auth-container">
        <Row justify="center" align="middle" className="auth-row">
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <Card className="auth-card">
              <div className="auth-header">
                <Title level={2} className="auth-title">
                  <UserOutlined className="title-icon" />
                  LankaMarket
                </Title>
                <Text type="secondary" className="auth-subtitle">
                  Shop with confidence
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
                      Register
                    </span>
                  } 
                  key="register"
                >
                  <Form
                    form={registerForm}
                    layout="vertical"
                    onFinish={handleRegister}
                    className="auth-form"
                    scrollToFirstError
                  >
                    <Row gutter={16}>
                      <Col span={12}>
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
                      <Col span={12}>
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

export default UserAuth