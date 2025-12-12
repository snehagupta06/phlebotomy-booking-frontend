
module.exports = {
  server: {
    port: 5173,
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '^/admin/.*': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '^/booking.*': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
};

