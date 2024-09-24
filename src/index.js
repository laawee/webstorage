import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';  // 确保这里的 'App' 与文件名大小写完全匹配

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
