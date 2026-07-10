import React, { useState, useEffect } from 'react'
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Space, 
  Popconfirm, 
  Card,
  Row,
  Col,
  Statistic,
  Input as SearchInput,
  Tag,
  Tooltip
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReadFilled as RestoreOutlined,
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import categoryService from '../services/categoryService'
import './AdminCategories.css'

const AdminCategories = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [stats, setStats] = useState({ activeCategories: 0, deletedCategories: 0 })
  
  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  
  // Form instances
  const [createForm] = Form.useForm()
  const [editForm] = Form.useForm()

  // Load categories and stats
  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = showDeleted 
        ? await categoryService.getAllDeletedCategories()
        : await categoryService.getAllActiveCategories()
      setCategories(data)
      setFilteredCategories(data)
      
      // Load stats
      const statsData = await categoryService.getCategoryStats()
      setStats(statsData)
    } catch (error) {
      messageApi.error('Failed to load categories: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value)
    if (!value.trim()) {
      setFilteredCategories(categories)
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCategories(filtered)
    }
  }

  // Create category
  const handleCreate = async (values) => {
    try {
      await categoryService.createCategoryByName(values.name)
      messageApi.success('Category created successfully!')
      setIsCreateModalVisible(false)
      createForm.resetFields()
      loadCategories()
    } catch (error) {
      messageApi.error('Failed to create category: ' + error.message)
    }
  }

  // Edit category
  const handleEdit = async (values) => {
    try {
      await categoryService.updateCategory(editingCategory.id, values)
      messageApi.success('Category updated successfully!')
      setIsEditModalVisible(false)
      setEditingCategory(null)
      editForm.resetFields()
      loadCategories()
    } catch (error) {
      messageApi.error('Failed to update category: ' + error.message)
    }
  }

  // Delete category
  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id)
      messageApi.success('Category deleted successfully!')
      loadCategories()
    } catch (error) {
      messageApi.error('Failed to delete category: ' + error.message)
    }
  }

  // Restore category
  const handleRestore = async (id) => {
    try {
      await categoryService.restoreCategory(id)
      messageApi.success('Category restored successfully!')
      loadCategories()
    } catch (error) {
      messageApi.error('Failed to restore category: ' + error.message)
    }
  }

  // Open edit modal
  const openEditModal = (category) => {
    setEditingCategory(category)
    editForm.setFieldsValue({
      name: category.name
    })
    setIsEditModalVisible(true)
  }

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Status',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 100,
      render: (isDeleted) => (
        <Tag color={isDeleted ? 'red' : 'green'}>
          {isDeleted ? 'Deleted' : 'Active'}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          {!showDeleted ? (
            <>
              <Tooltip title="Edit">
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  size="small"
                  onClick={() => openEditModal(record)}
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to delete this category?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    size="small"
                  />
                </Tooltip>
              </Popconfirm>
            </>
          ) : (
            <Popconfirm
              title="Are you sure you want to restore this category?"
              onConfirm={() => handleRestore(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Restore">
                <Button 
                  type="primary" 
                  icon={<RestoreOutlined />} 
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
    loadCategories()
  }, [showDeleted])

  return (
    <>
      {contextHolder}
      <div className="admin-categories">
        {/* Statistics Cards */}
        <Row gutter={16} className="stats-row">
          <Col span={12}>
            <Card>
              <Statistic
                title="Active Categories"
                value={stats.activeCategories}
                valueStyle={{ color: '#3f8600' }}
                prefix={<EyeOutlined />}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Deleted Categories"
                value={stats.deletedCategories}
                valueStyle={{ color: '#cf1322' }}
                prefix={<EyeInvisibleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Card */}
        <Card className="main-card">
          <div className="card-header">
            <div className="header-left">
              <h3>Categories Management</h3>
              <Button
                type={showDeleted ? 'default' : 'primary'}
                icon={showDeleted ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                onClick={() => setShowDeleted(!showDeleted)}
              >
                {showDeleted ? 'Show Active' : 'Show Deleted'}
              </Button>
            </div>
            <div className="header-right">
              <SearchInput
                placeholder="Search categories..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300, marginRight: 16 }}
              />
              {!showDeleted && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  Add Category
                </Button>
              )}
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} categories`
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Create Modal */}
        <Modal
          title="Create New Category"
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false)
            createForm.resetFields()
          }}
          footer={null}
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreate}
          >
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: 'Please enter category name!' },
                { min: 2, message: 'Name must be at least 2 characters!' },
                { max: 100, message: 'Name must not exceed 100 characters!' }
              ]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
                <Button onClick={() => {
                  setIsCreateModalVisible(false)
                  createForm.resetFields()
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          title="Edit Category"
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false)
            setEditingCategory(null)
            editForm.resetFields()
          }}
          footer={null}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEdit}
          >
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: 'Please enter category name!' },
                { min: 2, message: 'Name must be at least 2 characters!' },
                { max: 100, message: 'Name must not exceed 100 characters!' }
              ]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
                <Button onClick={() => {
                  setIsEditModalVisible(false)
                  setEditingCategory(null)
                  editForm.resetFields()
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default AdminCategories