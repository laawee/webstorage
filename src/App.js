import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Input, Table, Space, message, Upload } from 'antd';
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
} from '@ant-design/icons';
import COS from 'cos-js-sdk-v5';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const cos = new COS({
  SecretId: process.env.REACT_APP_COS_SECRET_ID,
  SecretKey: process.env.REACT_APP_COS_SECRET_KEY,
});

const App = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    cos.getBucket({
      Bucket: process.env.REACT_APP_COS_BUCKET,
      Region: process.env.REACT_APP_COS_REGION,
    }, (err, data) => {
      if (err) {
        console.error('Failed to fetch files:', err);
        message.error('Failed to fetch files');
      } else {
        setFiles(data.Contents.map(file => ({
          key: file.Key,
          name: file.Key,
          size: (file.Size / 1024).toFixed(2) + ' KB',
          lastModified: new Date(file.LastModified).toLocaleString(),
        })));
      }
    });
  };

  const handleUpload = ({ file, onSuccess, onError }) => {
    console.log('Uploading file:', file.name);
    cos.putObject({
      Bucket: process.env.REACT_APP_COS_BUCKET,
      Region: process.env.REACT_APP_COS_REGION,
      Key: file.name,
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
        fetchFiles();
      }
    });
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Space><FolderOutlined />{text}</Space>,
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
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ padding: '20px' }}>
          <h2>夸克网盘</h2>
          <p>用户名 3.5G/10G</p>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['1']}>
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
        <Header style={{ background: '#fff', padding: 0 }}>
          <Space style={{ float: 'right', marginRight: '20px' }}>
            <Search placeholder="搜索全部文件" style={{ width: 200 }} />
            <BellOutlined style={{ fontSize: '20px' }} />
            <DesktopOutlined style={{ fontSize: '20px' }} />
            <MobileOutlined style={{ fontSize: '20px' }} />
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Space style={{ marginBottom: 16 }}>
            <Upload customRequest={handleUpload}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
            <Button icon={<FolderAddOutlined />}>新建文件夹</Button>
          </Space>
          <Table columns={columns} dataSource={files} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
