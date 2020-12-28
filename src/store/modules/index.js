let modules = {};
const fileImports = require.context('.', false, /\.js$/);
fileImports.keys().forEach(filePath => {
  if (filePath === './index.js') {
    return;
  }
  modules[filePath.replace(/(\.\/|\.js$)/g, '')] = fileImports(filePath).default;	// 这里是把比如'./exampleModule.js'的filePath换成'exampleModule'，具体可以见下面的link
});
export default modules;
