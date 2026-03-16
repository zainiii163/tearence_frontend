const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.worldwideadverts.info',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      headers: {
        'Origin': 'https://worldwideadverts.info',
        'Referer': 'https://worldwideadverts.info',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Access-Control-Request-Method': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
        'Access-Control-Request-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
      },
      onProxyReq: (proxyReq, req, res) => {
        // Remove problematic headers that cause CORS issues
        proxyReq.removeHeader('cache-control');
        proxyReq.removeHeader('pragma');
        
        // Set required headers for CORS
        proxyReq.setHeader('Origin', 'https://worldwideadverts.info');
        proxyReq.setHeader('Referer', 'https://worldwideadverts.info');
        
        console.log(`Proxying request: ${req.method} ${req.url} -> https://api.worldwideadverts.info${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers to response
        proxyRes.headers['Access-Control-Allow-Origin'] = 'https://worldwideadverts.info';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With, Origin, Referer';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'false';
        
        console.log(`Proxy response: ${proxyRes.statusCode} for ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).send('Proxy error occurred. Please check console for details.');
      }
    })
  );
};
