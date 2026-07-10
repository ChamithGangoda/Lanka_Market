import React from 'react'
import { Layout, Button, Menu } from 'antd'
import { UserOutlined, HeartOutlined, CreditCardOutlined, LoginOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
const { Header } = Layout

const Navbar = () => {
  const userId = localStorage.getItem('userId')
  const isAuthenticated = !!userId
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('userId')
    window.location.reload()
  }

  const menuItems = isAuthenticated ? [
    {
      key: 'cart',
      icon: <ShoppingCartOutlined />,
      label: 'My Cart',
      onClick: () => {
        navigate('/my-cart')
      }
    },
   
    {
      key: 'payments',
      icon: <CreditCardOutlined />,
      label: 'My Payments',
      onClick: () => {
        navigate('/my-payments')
      }
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        navigate('/profile')
      }
    },
  ] : []

  return (
    <Header className="navbar">
      <div className="navbar-content">
        <div className="navbar-title">
          <Link to="/">LankaMarket</Link>
        </div>
        
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Menu
                mode="horizontal"
                items={menuItems}
                className="navbar-menu-items"
              />
              <Button 
                type="primary" 
                icon={<UserOutlined />}
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </Header>
  )
}

export default Navbar