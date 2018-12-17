# 代理设置方式

#### 通过webpack的devServer代理

```javascript
devServer: {
    proxy: [{
        ... // 其它设置参数
        target: 'https://mock/clevertools.cn',
        headers: {
            'clever-mock': 'mock key'
        }
    }]
}
```

#### 通过axios直接访问

* 通过baseUrl

```javascript
axios({
    url: '/api/test',
    method: 'get',
    headers: {
        'clever-mock': 'mock key'
    },
    baseURL: 'https://mock.clevertools.cn'
})
```

* 通过proxy设置

```javascript
axios({
    url: '/api/test',
    method: 'get',
    headers: {
        'clever-mock': 'mock key'
    },
    proxy: {
        host: 'https://mock.clevertools.cn'
    }
})
```

