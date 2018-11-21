#clever-mock
# cleverMock
请求代理与mock平台
## 可以解决什么问题？
* 对项目中所有的接口都可以轻松实现管理，且cleverMock支持API分组
* 每个API接口支持自定义代理地址，即你可以根据项目实际需求，将不同的API代理请求向不同的服务。
这意味着：
	* 可以同时与多个服务或者开发同事联调不同的接口
	* 项目迭代中，可以只代理你想要的API到指定服务，最大限度降低联调时无关请求的干扰性
* 自动根据实际请求保存mock数据，通过cleverMock跑完一个项目，相当于copy了一个后台服务
* 每个接口支持自动更新mock数据，避免手动维护
* 自动根据请求的响应，生成接口的响应结构，想维护文档，你只需要加下注释
* 支持动态mock，通过mock脚本，可以动态生成mock数据，脱离后台服务限制
* 更多精彩等你发现…

## 环境要求
* nodeJS环境
* mysql数据库
## 安装步骤
1. `git clone git@github.com:koajs/koa.io.git`
2. 进入`server`目录安装依赖包`yarn`
3. 创建mysql数据库，并且导入表结构（”server/database.sql”）
4. 向数据库中导入基础数据(“server/initData.sql”)
5. 修改数据库配置信息：”server/config.js”
```js
{
	...
	db: {
	  connectionLimit: 10,
  	  host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'xxx',
    database: 'database_name'
  }

}
```
6. 启动server
`node server/app.js`
## 使用步骤
1. 访问cleverMock，注册新用户
2. 登录平台
3. 创建项目
> 主要是代理平台地址（即你最终想请求的服务器地址）
4. 根据引导，在自身项目的request header中，增加头信息
`clever-mock: "secretKey"`
5. 自身项目的请求，代理设置为cleverMock地址
6. 自身项目运行且发送请求后，代理平台的API列表中有记录即代表使用成功
