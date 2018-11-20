module.exports = {
  port: 3000,
  session: {
    name: 'cleverMock',
    secret: 'cleverMock',
    // store:
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24小时
    }
  },
  logger: {
  
  },
  db: {
    connectionLimit: 10,
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'dongyongqiang',
    database: 'clever_mock'
  }
}
