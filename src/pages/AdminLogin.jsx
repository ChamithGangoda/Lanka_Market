import React from 'react'
import { Card, Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = (values) => {
    const { email, password } = values
    
    if (email === 'admin@admin.com' && password === 'admin123') {
      message.success('Login successful!')
      navigate('/admin-dashboard')
    } else {
      message.error('Invalid credentials. Please check your email and password.')
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="admin-login-container">
      <Card className="admin-login-card" title="Admin Login">
        <Form
          form={form}
          name="adminLogin"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                min: 6,
                message: 'Password must be at least 6 characters!',
              },
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
              className="login-button"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AdminLogin