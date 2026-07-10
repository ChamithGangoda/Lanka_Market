import { useState, useEffect } from 'react'
import { Layout, Menu, Typography, Button, message, Space, Avatar, Dropdown } from 'antd'
import { 
  ShoppingOutlined, 
  CreditCardOutlined, 
  UserOutlined, 
  LogoutOutlined,
  SettingOutlined,
  ShopOutlined,
  ProfileFilled
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import SellerProducts from '../components/SellerProducts'
import SellerPayments from '../components/SellerPayments'
import './SellerDashboard.css'
import SellerProfile from './SellerProfile'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const SellerDashboard = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [activeIndex, setActiveIndex] = useState('1')
  const [sellerData, setSellerData] = useState(null)
  
  const menuItems = [
    {
      key: '1',
      label: 'Product Management',
      icon: <ShoppingOutlined />
    },
    {
      key: '2',
      label: 'Payment Management',
      icon: <CreditCardOutlined />
    },
    {
      key: '3',
      label: 'Profile Management',
      icon: <ProfileFilled />
    }
  ]

  const handleMenuClick = ({ key }) => {
    setActiveIndex(key)
  }

  const renderContent = () => {
    switch(activeIndex) {
      case '1':
        return <SellerProducts />
      case '2':
        return <SellerPayments />
      case '3':
        return <SellerProfile />
      default:
        return <SellerProducts />
    }
  }

  const getPageTitle = () => {
    switch(activeIndex) {
      case '1':
        return 'Product Management'
      case '2':
        return 'Payment Management'
      default:
        return 'Product Management'
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('sellerId')
    localStorage.removeItem('sellerName')
    localStorage.removeItem('sellerEmail')
    localStorage.removeItem('sellerBusinessReg')
    localStorage.removeItem('sellerData')
    messageApi.success('Logged out successfully!')
    navigate('/seller-auth')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        navigate('/seller-profile')
      }
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => {
        // Navigate to settings page
        messageApi.info('Settings feature coming soon!')
      }
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ]

  useEffect(() => {
    // Load seller data from localStorage
    const storedSellerData = localStorage.getItem('sellerData')
    if (storedSellerData) {
      try {
        setSellerData(JSON.parse(storedSellerData))
      } catch (error) {
        console.error('Error parsing seller data:', error)
        messageApi.error('Error loading seller data. Please login again.')
        navigate('/seller-auth')
      }
    } else {
      messageApi.error('No seller data found. Please login.')
      navigate('/seller-auth')
    }
  }, [messageApi, navigate])

  if (!sellerData) {
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
      <Layout className="seller-dashboard">
        <Sider width={250} className="seller-sidebar">
          <div className="seller-logo">
            <Title level={3} className="logo-text">
              <ShopOutlined className="logo-icon" />
              Seller Panel
            </Title>
          </div>
          
          <div className="seller-info">
            <Avatar 
              size={64} 
              icon={<UserOutlined />} 
              src={sellerData.imageUrl}
              className="seller-avatar"
            />
            <div className="seller-details">
              <Text strong className="seller-name">{sellerData.name}</Text>
              <Text type="secondary" className="seller-reg">
                {sellerData.businessRegNumber}
              </Text>
            </div>
          </div>

          <Menu
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            selectedKeys={[activeIndex]}
            className="seller-menu"
          />
        </Sider>
        
        <Layout className="seller-main">
          <Header className="seller-header">
            <div className="header-left">
              <Title level={2} className="page-title">{getPageTitle()}</Title>
            </div>
            <div className="header-right">
              <Space>
                <Text className="welcome-text">
                  Welcome, {sellerData.name}
                </Text>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <Button type="text" className="user-menu-button">
                    <Avatar 
                      size="small" 
                      icon={<UserOutlined />} 
                      src={sellerData.imageUrl}
                    />
                  </Button>
                </Dropdown>
              </Space>
            </div>
          </Header>
          
          <Content className="seller-content">
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default SellerDashboard