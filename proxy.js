const proxy = require('http-proxy-middleware')

module.exports = function(app) {

  require('dotenv').config()

  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const API_TOKEN = process.env.REACT_APP_API_KEY;
  const headers  = {
    "Content-Type": "application/json",
    "Authorization": API_TOKEN
  }

  // define http-proxy-middleware
  let DOProxy = proxy({
    target: BASE_API_URL,
    changeOrigin: true,
    pathRewrite: {
    '^/api' : '/'
  },
    headers: headers,
  })

  // define the route and map the proxy
  app.use('/', DOProxy)

};