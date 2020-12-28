const configCrossOriginProxy = (app) => {
  const baseUrl = {
    dev: 'http://localhost:8077',
    prod: 'http://121.89.203.245:8077'
  };
  const mode = process.env.NODE_ENV;
  const proxy = require('http-proxy-middleware');
  app.use('/api', proxy({
    target: baseUrl[mode],
    ws: true,
    changeOrigin: true
  }));
};

const configHistoryFallBackInSignlePageApp = (app) => {
  app.use('/', require('connect-history-api-fallback')());
};

const configCodeResourcePath = (app) => {
  const path = require('path');
  const staticResourcePath = path.join(__dirname, '../dist');
  app.use('/', Express.static(staticResourcePath));
};

const startServerWithPort = (app, port) => {
  app.listen(port);
};

// all steps are as follow:
const Express = require('express');
const app = new Express();
configCrossOriginProxy(app);	// 解决后端无法访问问题
configHistoryFallBackInSignlePageApp(app);	// 解决单页面应用刷新跳转问题
configCodeResourcePath(app);	// 解决静态资源访问问题
startServerWithPort(app, '9999');
