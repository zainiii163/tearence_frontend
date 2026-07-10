const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Include /api in target: Express app.use('/api', ...) strips that prefix before
  // forwarding, so /api/v1/foo becomes /v1/foo — Laravel routes live under /api/v1.
  const apiTarget = 'http://127.0.0.1:8000/api';
  const storageTarget = 'http://127.0.0.1:8000/storage';

  app.use(
    '/api',
    createProxyMiddleware({
      target: apiTarget,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req) => {
        console.log(`Proxying request: ${req.method} ${req.url} -> ${apiTarget}${req.url}`);
      },
      onProxyRes: (proxyRes, req) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] =
          'Content-Type, Authorization, Content-Length, X-Requested-With';
        console.log(`Proxy response: ${proxyRes.statusCode} for ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        console.error(`Make sure the Laravel backend is running on ${apiTarget}`);
        if (!res.headersSent) {
          res.status(502).json({
            error: 'Proxy error occurred',
            message:
              'Backend server not reachable. Start Laravel: php artisan serve --host=127.0.0.1 --port=8000',
          });
        }
      },
    })
  );

  app.use(
    '/storage',
    createProxyMiddleware({
      target: storageTarget,
      changeOrigin: true,
      secure: false,
    })
  );
};
