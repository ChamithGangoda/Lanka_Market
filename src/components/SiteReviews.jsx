import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  message, 
  Typography, 
  Space, 
  Tag, 
  Spin,
  Empty,
  Table,
  Modal,
  Form,
  Input,
  Rate,
  Popconfirm,
  Tooltip,
  Statistic,
  Select,
  InputNumber,
  Divider,
  Avatar,
  Badge
} from 'antd'
import { 
  StarOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  MessageOutlined,
  TrophyOutlined,
  LikeOutlined,
  DislikeOutlined
} from '@ant-design/icons'
import reviewService from '../services/reviewService'
import './SiteReviews.css'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const SiteReviews = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [ratingFilter, setRatingFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const userId = localStorage.getItem('userId')
  const isAuthenticated = !!userId

  // Load reviews
  const loadReviews = async () => {
    setLoading(true)
    try {
      const reviewsData = await reviewService.getAllActiveReviews()
      const formattedReviews = reviewService.formatReviewsForDisplay(reviewsData)
      setReviews(formattedReviews)
      setFilteredReviews(formattedReviews)
    } catch (error) {
      messageApi.error('Failed to load reviews: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort reviews
  const filterAndSortReviews = () => {
    let filtered = [...reviews]

    // Filter by rating
    if (ratingFilter !== 'ALL') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter))
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(review => 
        review.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        review.content?.toLowerCase().includes(searchText.toLowerCase()) ||
        review.userName?.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    // Sort reviews
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredReviews(filtered)
  }

  // Get rating color
  const getRatingColor = (rating) => {
    switch (rating) {
      case 5: return '#52c41a'
      case 4: return '#1890ff'
      case 3: return '#faad14'
      case 2: return '#fa8c16'
      case 1: return '#ff4d4f'
      default: return '#d9d9d9'
    }
  }

  // Show create modal
  const showCreateModal = () => {
    if (!isAuthenticated) {
      messageApi.error('Please login to create a review')
      return
    }
    form.resetFields()
    setCreateModalVisible(true)
  }

  // Show edit modal
  const showEditModal = (review) => {
    if (!isAuthenticated) {
      messageApi.error('Please login to edit reviews')
      return
    }
    if (review.userId !== parseInt(userId)) {
      messageApi.error('You can only edit your own reviews')
      return
    }
    editForm.setFieldsValue({
      title: review.title,
      content: review.content,
      rating: review.rating
    })
    setSelectedReview(review)
    setEditModalVisible(true)
  }

  // Show view modal
  const showViewModal = (review) => {
    setSelectedReview(review)
    setViewModalVisible(true)
  }

  // Create review
  const handleCreateReview = async (values) => {
    try {
      const reviewData = {
        title: values.title,
        content: values.content,
        rating: values.rating,
        userId: parseInt(userId)
      }
      await reviewService.createReview(reviewData)
      messageApi.success('Review created successfully')
      setCreateModalVisible(false)
      form.resetFields()
      loadReviews()
    } catch (error) {
      messageApi.error('Failed to create review: ' + error.message)
    }
  }

  // Update review
  const handleUpdateReview = async (values) => {
    try {
      const reviewData = {
        title: values.title,
        content: values.content,
        rating: values.rating
      }
      await reviewService.updateReview(selectedReview.id, reviewData)
      messageApi.success('Review updated successfully')
      setEditModalVisible(false)
      setSelectedReview(null)
      editForm.resetFields()
      loadReviews()
    } catch (error) {
      messageApi.error('Failed to update review: ' + error.message)
    }
  }

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId)
      messageApi.success('Review deleted successfully')
      loadReviews()
    } catch (error) {
      messageApi.error('Failed to delete review: ' + error.message)
    }
  }

  // Handle rating filter change
  const handleRatingFilterChange = (value) => {
    setRatingFilter(value)
  }

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
  }

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value)
  }

  // Handle sort order change
  const handleSortOrderChange = (value) => {
    setSortOrder(value)
  }

  // Table columns
  const columns = [
    {
      title: 'Review',
      key: 'review',
      width: 300,
      render: (_, record) => (
        <div className="review-content">
          <Text strong className="review-title">{record.title}</Text>
          <br />
          <Text type="secondary" className="review-preview">
            {record.content?.substring(0, 100)}...
          </Text>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating) => (
        <Space direction="vertical" size="small">
          <Rate disabled value={rating} style={{ color: getRatingColor(rating) }} />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {reviewService.getRatingDescription(rating)}
          </Text>
        </Space>
      )
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
      render: (userName) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text>{userName || 'Anonymous'}</Text>
        </Space>
      )
    },
    {
      title: 'Date',
      dataIndex: 'formattedCreatedAt',
      key: 'formattedCreatedAt',
      width: 100,
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <Text>{date}</Text>
        </Space>
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Space>
          {record.isRecent && <Tag color="green">Recent</Tag>}
          <Tag color="blue">Active</Tag>
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => showViewModal(record)}
              size="small"
            />
          </Tooltip>
          {isAuthenticated && record.userId === parseInt(userId) && (
            <>
              <Tooltip title="Edit Review">
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  onClick={() => showEditModal(record)}
                  size="small"
                />
              </Tooltip>
              <Popconfirm
                title="Delete Review"
                description="Are you sure you want to delete this review? This action cannot be undone."
                onConfirm={() => handleDeleteReview(record.id)}
                okText="Yes"
                cancelText="No"
                okType="danger"
              >
                <Tooltip title="Delete Review">
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ]

  useEffect(() => {
    loadReviews()
  }, [])

  useEffect(() => {
    filterAndSortReviews()
  }, [ratingFilter, searchText, sortBy, sortOrder, reviews])

  if (loading) {
    return (
      <>
        {contextHolder}
        <div className="site-reviews-loading">
          <Spin size="large" />
          <Text>Loading reviews...</Text>
        </div>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <div className="site-reviews-container">
        <div className="site-reviews-header">
          <Title level={1} className="site-reviews-title">
            <StarOutlined className="title-icon" />
            Customer Reviews
          </Title>
          <Text type="secondary" className="site-reviews-subtitle">
            Read what our customers have to say about LankaMarket
          </Text>
        </div>

        {/* Review Statistics */}
        {reviews.length > 0 && (
          <Row gutter={16} className="site-reviews-stats">
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Reviews"
                  value={reviews.length}
                  prefix={<MessageOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Average Rating"
                  value={reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length}
                  precision={1}
                  prefix={<StarOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="5-Star Reviews"
                  value={reviews.filter(review => review.rating === 5).length}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Recent Reviews"
                  value={reviews.filter(review => review.isRecent).length}
                  prefix={<LikeOutlined />}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Filters and Controls */}
        <Card className="filters-card">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={6}>
              <Space>
                <FilterOutlined />
                <Text strong>Rating Filter:</Text>
                <Select
                  value={ratingFilter}
                  onChange={handleRatingFilterChange}
                  style={{ width: 120 }}
                  placeholder="Filter by rating"
                >
                  <Option value="ALL">All Ratings</Option>
                  <Option value="5">5 Stars</Option>
                  <Option value="4">4 Stars</Option>
                  <Option value="3">3 Stars</Option>
                  <Option value="2">2 Stars</Option>
                  <Option value="1">1 Star</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={6}>
              <Space>
                <Text strong>Sort By:</Text>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  style={{ width: 120 }}
                >
                  <Option value="createdAt">Date</Option>
                  <Option value="rating">Rating</Option>
                  <Option value="title">Title</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={6}>
              <Space>
                <Text strong>Order:</Text>
                <Select
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  style={{ width: 100 }}
                >
                  <Option value="desc">Desc</Option>
                  <Option value="asc">Asc</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={6}>
              <Space>
                <Input
                  placeholder="Search reviews..."
                  value={searchText}
                  onChange={handleSearchChange}
                  prefix={<SearchOutlined />}
                  allowClear
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadReviews}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Create Review Button */}
        {isAuthenticated && (
          <div className="create-review-section">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
              size="large"
              className="create-review-btn"
            >
              Write a Review
            </Button>
          </div>
        )}

        {/* Reviews Table */}
        <div className="site-reviews-content">
          {filteredReviews.length === 0 ? (
            <Card className="site-reviews-empty-card">
              <Empty
                description={reviews.length === 0 ? "No reviews found" : "No reviews match your filters"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                {reviews.length === 0 ? (
                  <Button type="primary" onClick={showCreateModal}>
                    Write First Review
                  </Button>
                ) : (
                  <Button onClick={() => {
                    setRatingFilter('ALL')
                    setSearchText('')
                  }}>
                    Clear Filters
                  </Button>
                )}
              </Empty>
            </Card>
          ) : (
            <Card className="reviews-table-card">
              <Table
                columns={columns}
                dataSource={filteredReviews}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} reviews`
                }}
                scroll={{ x: 800 }}
                className="reviews-table"
              />
            </Card>
          )}
        </div>

        {/* Create Review Modal */}
        <Modal
          title={
            <div className="modal-header">
              <StarOutlined className="modal-icon" />
              <span>Write a Review</span>
            </div>
          }
          open={createModalVisible}
          onCancel={() => {
            setCreateModalVisible(false)
            form.resetFields()
          }}
          footer={null}
          width={600}
          className="review-modal"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateReview}
            className="review-form"
          >
            <Form.Item
              name="title"
              label="Review Title"
              rules={[
                { required: true, message: 'Please enter a review title' },
                { min: 2, message: 'Title must be at least 2 characters' },
                { max: 200, message: 'Title must not exceed 200 characters' }
              ]}
            >
              <Input placeholder="Enter a title for your review" />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please select a rating' }]}
            >
              <Rate allowHalf={false} />
            </Form.Item>

            <Form.Item
              name="content"
              label="Review Content"
              rules={[
                { required: true, message: 'Please enter your review content' },
                { max: 1000, message: 'Content must not exceed 1000 characters' }
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Share your experience with LankaMarket..."
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit Review
                </Button>
                <Button onClick={() => {
                  setCreateModalVisible(false)
                  form.resetFields()
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Review Modal */}
        <Modal
          title={
            <div className="modal-header">
              <EditOutlined className="modal-icon" />
              <span>Edit Review</span>
            </div>
          }
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false)
            setSelectedReview(null)
            editForm.resetFields()
          }}
          footer={null}
          width={600}
          className="review-modal"
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateReview}
            className="review-form"
          >
            <Form.Item
              name="title"
              label="Review Title"
              rules={[
                { required: true, message: 'Please enter a review title' },
                { min: 2, message: 'Title must be at least 2 characters' },
                { max: 200, message: 'Title must not exceed 200 characters' }
              ]}
            >
              <Input placeholder="Enter a title for your review" />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please select a rating' }]}
            >
              <Rate allowHalf={false} />
            </Form.Item>

            <Form.Item
              name="content"
              label="Review Content"
              rules={[
                { required: true, message: 'Please enter your review content' },
                { max: 1000, message: 'Content must not exceed 1000 characters' }
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Share your experience with LankaMarket..."
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Review
                </Button>
                <Button onClick={() => {
                  setEditModalVisible(false)
                  setSelectedReview(null)
                  editForm.resetFields()
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Review Modal */}
        <Modal
          title={
            <div className="modal-header">
              <EyeOutlined className="modal-icon" />
              <span>Review Details</span>
            </div>
          }
          open={viewModalVisible}
          onCancel={() => {
            setViewModalVisible(false)
            setSelectedReview(null)
          }}
          footer={null}
          width={700}
          className="review-modal"
        >
          {selectedReview && (
            <div className="review-detail-content">
              <Card className="review-detail-card">
                <div className="review-header">
                  <Title level={3} className="review-detail-title">
                    {selectedReview.title}
                  </Title>
                  <Space>
                    <Rate disabled value={selectedReview.rating} style={{ color: getRatingColor(selectedReview.rating) }} />
                    <Tag color="blue">{reviewService.getRatingDescription(selectedReview.rating)}</Tag>
                  </Space>
                </div>
                
                <Divider />
                
                <div className="review-content-detail">
                  <Paragraph className="review-text">
                    {selectedReview.content}
                  </Paragraph>
                </div>
                
                <Divider />
                
                <div className="review-meta">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Space>
                        <UserOutlined />
                        <Text strong>By: {selectedReview.userName || 'Anonymous'}</Text>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <CalendarOutlined />
                        <Text>Posted: {selectedReview.formattedCreatedAt}</Text>
                      </Space>
                    </Col>
                  </Row>
                  {selectedReview.isRecent && (
                    <div style={{ marginTop: 8 }}>
                      <Tag color="green">Recent Review</Tag>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </>
  )
}

export default SiteReviews