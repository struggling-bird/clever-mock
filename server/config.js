const path = require("path");
const fs = require("fs");
const beautify = require("js-beautify");
const configPath = path.resolve(__dirname, '.config');
let globalConfig = {
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
    connectionLimit: 1000,
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Dong_1013501639',
    database: 'clever_mock'
  }
};
try {
    fs.statSync(configPath);
    globalConfig = JSON.parse(fs.readFileSync(configPath).toString());
}
catch (e) {
    fs.writeFileSync(configPath, beautify.js(JSON.stringify(globalConfig), {
        'indent_size': 2
    }));
}

module.exports = globalConfig
