const configCrossOriginProxy = (app) => {
  const baseUrl = {
    dev: 'http://localhost:8077',
    prod: 'https://www.meetingall.info:8077/'
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

// all steps are as follow:
const Express = require('express');
let https = require('https');
let fs = require('fs');

const app = new Express();

configCrossOriginProxy(app);	// 解决后端无法访问问题
configHistoryFallBackInSignlePageApp(app);	// 解决单页面应用刷新跳转问题
configCodeResourcePath(app);	// 解决静态资源访问问题

// https config
const httpsOption = {
  key: fs.readFileSync('/var/ssl/4982052_www.meetingall.info.key'),
  cert: fs.readFileSync('/var/ssl/4982052_www.meetingall.info.crt')
};
https.createServer(httpsOption, app).listen(9999, function () {
  console.log('https: 9999');
});

// // Test config http auto jump to https
// let http = require('http');
// http.createServer(app).listen(9999, function (request, response) {
//   response.writeHead(301, { 'Location': 'https://www.meetingall.info:9999' });
//   response.end();
// });
