import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Input, Table, Space, message, Upload, Progress, Spin } from 'antd';
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
} from '@ant-design/icons';
import COS from 'cos-js-sdk-v5';
import '../styles/QuarkCloudStorage.css';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

const QuarkCloudStorage = () => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);

  const fetchFiles = async (path) => {
    setLoading(true);
    try {
      const data = await cos.getBucket({
        Bucket: process.env.COS_BUCKET,
        Region: process.env.COS_REGION,
        Prefix: path,
        Delimiter: '/',
      });
      const folders = data.CommonPrefixes.map(prefix => ({
        key: prefix.Prefix,
        name: prefix.Prefix.split('/').slice(-2)[0],
        isFolder: true,
        size: '-',
        lastModified: '-',
      }));
      const files = data.Contents.filter(file => file.Key !== path).map(file => ({
        key: file.Key,
        name: file.Key.split('/').pop(),
        isFolder: false,
        size: (file.Size / 1024).toFixed(2) + ' KB',
        lastModified: new Date(file.LastModified).toLocaleString(),
      }));
      setFiles([...folders, ...files]);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      message.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = ({ file, onSuccess, onError }) => {
    const key = currentPath + file.name;
    cos.putObject({
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      Key: key,
      Body: file,
    }, (err, data) => {
      if (err) {
        console.error('Upload failed:', err);
        message.error(`${file.name} upload failed.`);
        onError(err);
      } else {
        console.log('Upload successful:', data);
        message.success(`${file.name} uploaded successfully.`);
        onSuccess();
        fetchFiles(currentPath);
      }
    });
  };

  const getTemporaryUrl = (file) => {
    if (file.isFolder) return;
    cos.getObjectUrl({
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      Key: file.key,
      Sign: true,
      Expires: 3600,
    }, (err, data) => {
      if (err) {
        console.error('Failed to get temporary URL:', err);
        message.error('Failed to get temporary URL');
      } else {
        message.success(`Temporary URL: ${data.Url}`);
        console.log('Temporary URL:', data.Url);
      }
    });
  };

  const handleFileClick = (file) => {
    if (file.isFolder) {
      setCurrentPath(file.key);
    } else {
      getTemporaryUrl(file);
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
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
      align: 'center',
    },
    {
      title: '修改日期',
      dataIndex: 'lastModified',
      key: 'lastModified',
      align: 'center',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div className="user-info">
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <UserOutlined className="user-icon"/>
            <div>夸克8148</div>
            <Progress percent={35} size="small" style={{ width: '80%' }} />
            <div className="storage-info">3.5G/10G</div>
          </Space>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['1']} className="menu">
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
        <Header className="header">
          <div className="logo-container">
            <img src="/assets/logo.png" alt="Quark Cloud Logo" className="logo"/>
          </div>
          <Space className="header-actions">
            <Search
              placeholder="搜索全部文件"
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary">新人专属优惠</Button>
            <BellOutlined className="header-icon"/>
            <DesktopOutlined className="header-icon"/>
            <MobileOutlined className="header-icon"/>
          </Space>
        </Header>
        <Content className="content">
          <Space className="content-actions">
            <Upload customRequest={handleUpload}>
              <Button type="primary" icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
            <Button icon={<FolderAddOutlined />}>新建文件夹</Button>
          </Space>
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={files}
              pagination={false}
              title={() => `全部文件 ${files.length}`}
              className="file-table"
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default QuarkCloudStorage;
