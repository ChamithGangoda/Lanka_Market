import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Table, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  message, 
  Popconfirm, 
  Tag, 
  Tooltip,
  Row,
  Col,
  Statistic,
  Image
} from 'antd'
import { 
  PlusOutlined, 
  ShoppingOutlined, 
  EditOutlined, 
  DeleteOutlined, 
   ReadFilled as RestoreOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DollarOutlined,
  StockOutlined,
  SearchOutlined,
  PictureOutlined
} from '@ant-design/icons'
import productService from '../services/productService'
import categoryService from '../services/categoryService'
import './SellerProducts.css'

const { Title, Text } = Typography
const { TextArea } = Input

const SellerProducts = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [stats, setStats] = useState({ 
    activeProducts: 0, 
    deletedProducts: 0, 
    inStockProducts: 0, 
    outOfStockProducts: 0 
  })
  
  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  // Form instances
  const [createForm] = Form.useForm()
  const [editForm] = Form.useForm()

  // Load products, categories and stats
  const loadData = async () => {
    setLoading(true)
    try {
      const sellerId = localStorage.getItem('sellerId')
      if (!sellerId) {
        messageApi.error('Seller ID not found. Please login again.')
        return
      }

      // Load products
      const productsData = showDeleted 
        ? await productService.getAllDeletedProducts()
        : await productService.getProductsBySeller(sellerId)
      
      // Filter products by seller
     // const sellerProducts = productsData.filter(product => product.seller?.id == sellerId)
      setProducts(productsData)
      setFilteredProducts(productsData)
      
      // Load categories
      const categoriesData = await categoryService.getAllActiveCategories()
      setCategories(categoriesData)
      
      // Load stats
      const statsData = await productService.getProductStats()
      setStats(statsData)
    } catch (error) {
      messageApi.error('Failed to load data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value)
    if (!value.trim()) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }

  // Create product
  const handleCreate = async (values) => {
    try {
      const sellerId = localStorage.getItem('sellerId')
      if (!sellerId) {
        messageApi.error('Seller ID not found. Please login again.')
        return
      }

      const productData = {
        name: values.name,
        price: values.price,
        description: values.description,
        imageUrl: values.imageUrl || null,
        inStockAmount: values.inStockAmount,
        category: { id: values.categoryId },
        seller: { id: sellerId }
      }

      await productService.createProduct(productData)
      messageApi.success('Product created successfully!')
      setIsCreateModalVisible(false)
      createForm.resetFields()
      loadData()
    } catch (error) {
      messageApi.error('Failed to create product: ' + error.message)
    }
  }

  // Edit product
  const handleEdit = async (values) => {
    try {
      const sellerId = localStorage.getItem('sellerId')
      if (!sellerId) {
        messageApi.error('Seller ID not found. Please login again.')
        return
      }

      const productData = {
        name: values.name,
        price: values.price,
        description: values.description,
        imageUrl: values.imageUrl || null,
        inStockAmount: values.inStockAmount,
        category: { id: values.categoryId },
        seller: { id: sellerId }
      }

      await productService.updateProduct(editingProduct.id, productData)
      messageApi.success('Product updated successfully!')
      setIsEditModalVisible(false)
      setEditingProduct(null)
      editForm.resetFields()
      loadData()
    } catch (error) {
      messageApi.error('Failed to update product: ' + error.message)
    }
  }

  // Delete product
  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id)
      messageApi.success('Product deleted successfully!')
      loadData()
    } catch (error) {
      messageApi.error('Failed to delete product: ' + error.message)
    }
  }

  // Restore product
  const handleRestore = async (id) => {
    try {
      await productService.restoreProduct(id)
      messageApi.success('Product restored successfully!')
      loadData()
    } catch (error) {
      messageApi.error('Failed to restore product: ' + error.message)
    }
  }

  // Open edit modal
  const openEditModal = (product) => {
    setEditingProduct(product)
    editForm.setFieldsValue({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      inStockAmount: product.inStockAmount,
      categoryId: product.category?.id
    })
    setIsEditModalVisible(true)
  }

  // Table columns
  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'image',
      width: 80,
      render: (imageUrl) => (
        imageUrl ? (
          <Image
            width={50}
            height={50}
            src={imageUrl}
            alt="Product"
            style={{ borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div style={{ 
            width: 50, 
            height: 50, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PictureOutlined style={{ color: '#d9d9d9' }} />
          </div>
        )
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${price}
        </Text>
      )
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 120,
      render: (categoryName) => (
        <Tag color="blue">{categoryName}</Tag>
      )
    },
    {
      title: 'Stock',
      dataIndex: 'inStockAmount',
      key: 'inStockAmount',
      width: 100,
      sorter: (a, b) => a.inStockAmount - b.inStockAmount,
      render: (amount) => (
        <Tag color={amount > 5 ? 'green' : amount > 0 ? 'orange' : 'red'}>
          {amount}
        </Tag>
      )
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
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
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
                title="Are you sure you want to delete this product?"
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
              title="Are you sure you want to restore this product?"
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
    loadData()
  }, [showDeleted])

  return (
    <>
      {contextHolder}
      <div className="seller-products">
        {/* Statistics Cards */}
        <Row gutter={16} className="stats-row">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={stats.activeProducts}
                valueStyle={{ color: '#1890ff' }}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="In Stock"
                value={stats.inStockProducts}
                valueStyle={{ color: '#52c41a' }}
                prefix={<StockOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Out of Stock"
                value={stats.outOfStockProducts}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<EyeInvisibleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Deleted"
                value={stats.deletedProducts}
                valueStyle={{ color: '#faad14' }}
                prefix={<EyeOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Card */}
        <Card className="main-card">
          <div className="card-header">
            <div className="header-left">
              <Title level={3} className="section-title">
                <ShoppingOutlined className="title-icon" />
                My Products
              </Title>
              <Text type="secondary">Manage your product inventory</Text>
            </div>
            <div className="header-right">
              <Space>
          {/*      <Button
                  type={showDeleted ? 'default' : 'primary'}
                  icon={showDeleted ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  onClick={() => setShowDeleted(!showDeleted)}
                >
                  {showDeleted ? 'Show Active' : 'Show Deleted'}
                </Button>*/}
                <Input
                  placeholder="Search products..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: 300 }}
                />
                {!showDeleted && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalVisible(true)}
                  >
                    Add Product
                  </Button>
                )}
              </Space>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} products`
            }}
            scroll={{ x: 1000 }}
          />
        </Card>

        {/* Create Modal */}
        <Modal
          title="Create New Product"
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false)
            createForm.resetFields()
          }}
          footer={null}
          width={600}
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreate}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Product Name"
              rules={[
                { required: true, message: 'Please enter product name!' },
                { min: 2, message: 'Name must be at least 2 characters!' },
                { max: 200, message: 'Name must not exceed 200 characters!' }
              ]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Price ($)"
                  rules={[
                    { required: true, message: 'Please enter price!' },
                    { type: 'number', min: 0.01, message: 'Price must be greater than 0!' }
                  ]}
                >
                  <InputNumber
                    placeholder="0.00"
                    style={{ width: '100%' }}
                    precision={2}
                    min={0.01}
                    step={0.01}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="inStockAmount"
                  label="Stock Amount"
                  rules={[
                    { required: true, message: 'Please enter stock amount!' },
                    { type: 'number', min: 0, message: 'Stock must be 0 or greater!' }
                  ]}
                >
                  <InputNumber
                    placeholder="0"
                    style={{ width: '100%' }}
                    min={0}
                    step={1}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select placeholder="Select category">
                {(categories?? []).map(category => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Please enter description!' },
                { max: 1000, message: 'Description must not exceed 1000 characters!' }
              ]}
            >
              <TextArea
                placeholder="Enter product description"
                rows={4}
              />
            </Form.Item>

            <Form.Item
              name="imageUrl"
              label="Image URL (Optional)"
              rules={[
                { max: 500, message: 'URL must not exceed 500 characters!' },
                { 
                  pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 
                  message: 'Please enter a valid URL!' 
                }
              ]}
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Create Product
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
          title="Edit Product"
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false)
            setEditingProduct(null)
            editForm.resetFields()
          }}
          footer={null}
          width={600}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEdit}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Product Name"
              rules={[
                { required: true, message: 'Please enter product name!' },
                { min: 2, message: 'Name must be at least 2 characters!' },
                { max: 200, message: 'Name must not exceed 200 characters!' }
              ]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Price ($)"
                  rules={[
                    { required: true, message: 'Please enter price!' },
                    { type: 'number', min: 0.01, message: 'Price must be greater than 0!' }
                  ]}
                >
                  <InputNumber
                    placeholder="0.00"
                    style={{ width: '100%' }}
                    precision={2}
                    min={0.01}
                    step={0.01}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="inStockAmount"
                  label="Stock Amount"
                  rules={[
                    { required: true, message: 'Please enter stock amount!' },
                    { type: 'number', min: 0, message: 'Stock must be 0 or greater!' }
                  ]}
                >
                  <InputNumber
                    placeholder="0"
                    style={{ width: '100%' }}
                    min={0}
                    step={1}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select placeholder="Select category">
                {categories.map(category => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Please enter description!' },
                { max: 1000, message: 'Description must not exceed 1000 characters!' }
              ]}
            >
              <TextArea
                placeholder="Enter product description"
                rows={4}
              />
            </Form.Item>

            <Form.Item
              name="imageUrl"
              label="Image URL (Optional)"
              rules={[
                { max: 500, message: 'URL must not exceed 500 characters!' },
                { 
                  pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 
                  message: 'Please enter a valid URL!' 
                }
              ]}
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Update Product
                </Button>
                <Button onClick={() => {
                  setIsEditModalVisible(false)
                  setEditingProduct(null)
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

export default SellerProducts
