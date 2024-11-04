const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// 代理设置
app.use('/api/proxy/models', createProxyMiddleware({
  target: 'https://openrouter.ai', // 目标服务器
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy/models': '/api/v1/models', // 重写路径
  },
  onProxyReq: (proxyReq, req, res) => {
    // 可添加自定义请求头
    proxyReq.setHeader('User-Agent', 'Apifox/1.0.0 (https://apifox.com)');
  },
}));

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
