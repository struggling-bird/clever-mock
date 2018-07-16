module.exports = {
  target: 'http://192.168.1.102:8080',// http://www.hxs-edu.com/
  // target: 'http://www.hxs-edu.com',
  port: 8181,  // 服务端口
  autoMockCodes: [404], // 当代理失败时自动使用mock的，proxy server code
  onlyProxy: false, // 全局仅使用代理配置（建议：服务异常时，调试使用，优先级最高）
  onlyMock: false // 全局仅使用mock配置（建议：服务异常时，调试使用，优先级最高）
}
