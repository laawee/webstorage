import React, { useState, useEffect } from 'react';
import { Layout, Menu, Upload, message, List, Button } from 'antd';
import { UploadOutlined, FileOutlined, DeleteOutlined } from '@ant-design/icons';
import COS from 'cos-js-sdk-v5';

const { Header, Content, Footer } = Layout;

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
        message.error('Failed to fetch files');
      } else {
        setFiles(data.Contents);
      }
    });
  };

  const handleUpload = (info) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      fetchFiles();
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleDelete = (key) => {
    cos.deleteObject({
      Bucket: process.env.REACT_APP_COS_BUCKET,
      Region: process.env.REACT_APP_COS_REGION,
      Key: key,
    }, (err, data) => {
      if (err) {
        message.error('Failed to delete file');
      } else {
        message.success('File deleted successfully');
        fetchFiles();
      }
    });
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Cloud Storage</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ margin: '16px 0' }}>
          <Upload
            customRequest={({ file, onSuccess }) => {
              cos.putObject({
                Bucket: process.env.REACT_APP_COS_BUCKET,
                Region: process.env.REACT_APP_COS_REGION,
                Key: file.name,
                Body: file,
              }, (err, data) => {
                if (err) {
                  message.error('Upload failed');
                } else {
                  onSuccess();
                }
              });
            }}
            onChange={handleUpload}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          <List
            itemLayout="horizontal"
            dataSource={files}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDelete(item.Key)}
                  >
                    Delete
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<FileOutlined />}
                  title={item.Key}
                  description={`Size: ${(item.Size / 1024).toFixed(2)} KB`}
                />
              </List.Item>
            )}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Cloud Storage ©2024 Created with Ant Design</Footer>
    </Layout>
  );
};

export default App;
