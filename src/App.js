import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Button,
  Input,
  Table,
  Space,
  message,
  Upload,
  Avatar,
  Progress
} from 'antd';
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

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const QuarkCloudStorage = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Simulating fetching files
    setFiles([
      { key: '1', name: '来自：分享', isFolder: true, size: '-', lastModified: '2024-09-22 17:13' },
      { key: '2', name: '夸克云解压', isFolder: true, size: '-', lastModified: '2024-09-22 17:08' },
      { key: '3', name: '夸克上传文件', isFolder: true, size: '-', lastModified: '2024-06-13 22:35' },
      { key: '4', name: '文档工具', isFolder: true, size: '-', lastModified: '2024-05-26 19:52' },
      { key: '5', name: '夸克快传', isFolder: true, size: '-', lastModified: '2024-05-19 12:18' },
      { key: '6', name: '我的扫描件', isFolder: true, size: '-', lastModified: '2024-05-09 20:00' },
      { key: '7', name: 'lora', isFolder: true, size: '-', lastModified: '2023-04-25 20:42' },
      { key: '8', name: 'Stable-diffusion', isFolder: true, size: '-', lastModified: '2023-04-25 20:42' },
    ]);
  }, []);

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <FolderOutlined />
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
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ padding: '20px' }}>
          <Space align="center">
            <Avatar icon={<UserOutlined />} />
            <div>
              <div>夸克8148</div>
              <Progress percent={35} size="small" showInfo={false} />
              <div style={{ fontSize: '12px', color: '#888' }}>3.5G/10G</div>
            </div>
          </Space>
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
          <div style={{ float: 'left', margin: '16px 24px' }}>
            <img src="/api/placeholder/100/30" alt="Quark Cloud Logo" style={{ height: '30px' }} />
          </div>
          <Space style={{ float: 'right', marginRight: '20px' }}>
            <Search
              placeholder="搜索全部文件"
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary">新人专属优惠</Button>
            <BellOutlined style={{ fontSize: '20px' }} />
            <DesktopOutlined style={{ fontSize: '20px' }} />
            <MobileOutlined style={{ fontSize: '20px' }} />
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Space style={{ marginBottom: 16 }}>
            <Upload>
              <Button type="primary" icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
            <Button icon={<FolderAddOutlined />}>新建文件夹</Button>
          </Space>
          <Table
            columns={columns}
            dataSource={files}
            pagination={false}
            title={() => "全部文件 8"}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default QuarkCloudStorage;
