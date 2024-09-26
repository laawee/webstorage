import React, { useState, useEffect } from 'react'
import { Layout, Menu, Button, Input, Table, Space, message, Upload, Progress, Spin } from 'antd'
import {
  FolderOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  FileOutlined,
  CustomerServiceOutlined,
  LinkOutlined,
  ShareAltOutlined,
  UploadOutlined,
  FolderAddOutlined,
  SearchOutlined,
  BellOutlined,
  DesktopOutlined,
  MobileOutlined,
  UserOutlined
} from '@ant-design/icons'
import styles from '../styles/QuarkCloudStorage.module.css'

const { Header, Sider, Content } = Layout
const { Search } = Input

const QuarkCloudStorage = () => {
  const [files, setFiles] = useState([])
  const [currentPath, setCurrentPath] = useState('/')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFiles(currentPath)
  }, [currentPath])

  const fetchFiles = async (path) => {
    setLoading(true)
    try {
      const response = await fetch('/api/cos-operations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      })
      const data = await response.json()
      if (response.ok) {
        const folders = data.CommonPrefixes?.map(prefix => ({
          key: prefix.Prefix,
          name: prefix.Prefix.split('/').slice(-2)[0],
          isFolder: true,
          size: '-',
          lastModified: '-',
        })) || []
        const files = data.Contents?.filter(file => file.Key !== path).map(file => ({
          key: file.Key,
          name: file.Key.split('/').pop(),
          isFolder: false,
          size: (file.Size / 1024).toFixed(2) + ' KB',
          lastModified: new Date(file.LastModified).toLocaleString(),
        })) || []
        setFiles([...folders, ...files])
      } else {
        throw new Error(data.error || 'Failed to fetch files')
      }
    } catch (err) {
      console.error('Failed to fetch files:', err)
      message.error('Failed to fetch files')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const response = await fetch('/api/cos-operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file, path: currentPath }),
      })
      const data = await response.json()
      if (response.ok) {
        message.success(`${file.name} uploaded successfully.`)
        onSuccess()
        fetchFiles(currentPath)
      } else {
        throw new Error(data.error || 'Failed to upload file')
      }
    } catch (err) {
      console.error('Upload failed:', err)
      message.error(`${file.name} upload failed.`)
      onError(err)
    }
  }

  const handleFileClick = (file) => {
    if (file.isFolder) {
      setCurrentPath(file.key)
    } else {
      message.info(`File clicked: ${file.name}`)
    }
  }

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space style={{ cursor: 'pointer' }} onClick={() => handleFileClick(record)}>
          {record.isFolder ? <FolderOutlined /> : <FileOutlined />}
          {text}
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '修改日期',
      dataIndex: 'lastModified',
      key: 'lastModified',
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div className={styles.userInfo}>
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <UserOutlined className={styles.userIcon}/>
            <div>夸克8148</div>
            <Progress percent={35} size="small" style={{ width: '80%' }} />
            <div className={styles.storageInfo}>3.5G/10G</div>
          </Space>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['1']} className={styles.menu}>
          <Menu.Item key="1" icon={<FolderOutlined />}>全部文件</Menu.Item>
          <Menu.Item key="2" icon={<ClockCircleOutlined />}>最近</Menu.Item>
          <Menu.Item key="3" icon={<VideoCameraOutlined />}>视频</Menu.Item>
          <Menu.Item key="4" icon={<PictureOutlined />}>图片</Menu.Item>
          <Menu.Item key="5" icon={<FileOutlined />}>文档</Menu.Item>
          <Menu.Item key="6" icon={<CustomerServiceOutlined />}>音频</Menu.Item>
          <Menu.Item key="7" icon={<LinkOutlined />}>BT种子</Menu.Item>
          <Menu.Item key="8" icon={<ShareAltOutlined />}>我的分享</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.logoContainer}>
            <img src="/logo.png" alt="Quark Cloud Logo" className={styles.logo}/>
          </div>
          <Space className={styles.headerActions}>
            <Search
              placeholder="搜索全部文件"
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary">新人专属优惠</Button>
            <BellOutlined className={styles.headerIcon}/>
            <DesktopOutlined className={styles.headerIcon}/>
            <MobileOutlined className={styles.headerIcon}/>
          </Space>
        </Header>
        <Content className={styles.content}>
          <Space className={styles.contentActions}>
            <Upload customRequest={handleUpload}>
              <Button type="primary" icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
            <Button icon={<FolderAddOutlined />}>新建文件夹</Button>
          </Space>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={files}
              pagination={false}
              rowKey="key"
              className={styles.fileTable}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  )
}

export default QuarkCloudStorage
