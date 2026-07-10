import { useState } from 'react'
import { Layout, Menu, Typography } from 'antd'
import AdminCategories from '../components/AdminCategories'
import AdminSellers from '../components/AdminSellers'
import AdminUsers from '../components/AdminUsers'
import { ShoppingOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons'
import './AdminDashboard.css'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const AdminDashboard = () => {
    const [activeIndex, setActiveIndex] = useState('1')
    
    const menuItems = [
        {
            key: '1',
            label: 'Categories',
            icon: <ShoppingOutlined />
        },
        {
            key: '2',
            label: 'Sellers',
            icon: <ShopOutlined />
        },
        {
            key: '3',
            label: 'Users',
            icon: <UserOutlined />
        }
    ]

    const handleMenuClick = ({ key }) => {
        setActiveIndex(key)
    }

    const renderContent = () => {
        switch(activeIndex) {
            case '1':
                return <AdminCategories />
            case '2':
                return <AdminSellers />
            case '3':
                return <AdminUsers />
            default:
                return <AdminCategories />
        }
    }

    const getPageTitle = () => {
        switch(activeIndex) {
            case '1':
                return 'Categories Management'
            case '2':
                return 'Sellers Management'
            case '3':
                return 'Users Management'
            default:
                return 'Categories Management'
        }
    }

    return (
        <Layout className="admin-dashboard">
            <Sider width={250} className="admin-sidebar">
                <div className="admin-logo">
                    <Title level={3} className="logo-text">Admin Panel</Title>
                </div>
                <Menu
                    mode="inline"
                    items={menuItems}
                    onClick={handleMenuClick}
                    selectedKeys={[activeIndex]}
                    className="admin-menu"
                />
            </Sider>
            <Layout className="admin-main">
                <Header className="admin-header">
                    <Title level={2} className="page-title">{getPageTitle()}</Title>
                </Header>
                <Content className="admin-content">
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    )
}

export default AdminDashboard