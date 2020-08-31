## Hellper
使用说明

####安装
 ```$xslt
npm install hellper --save
```

####导入

1. 入口文件app.js导入
```$xslt
import { hellper } from 'hellper';
hellper();
```

2. 根目录配置文件 hellper.config.js

```$xslt
module.exports = {
  magic: true, // 辅助增长文本
  check: true,  // 代码检测
  nameCheckIgnore: [ // 文件名称检测忽略文件 路径及子路径都不检测
    '/submodule/utils',
    '/server'
  ]
};

```

3. 接口监听 request.js

```$xslt
import {HttpListen} from 'hellper';
const httpListen = new HttpListen();

/***
 * Request 拦截器
 */
service.interceptors.request.use(config => {
  // 监听请求
  httpListen.listen(config);
  ...
  ...
  ...
  })
```

> 功能介绍：

1. 右键增长文本： magic: true
2. input输入框maxlength属性遗漏检查：check: true
3. ellipses样式title属性遗漏检查：check: true
4. axios重复请求提醒 check: true
5. url超长提醒

> 提示

+ 文件名格式检测方法： 
```$xslt
npm run check
```
+ magic: true 开启右键增长文件， alt + 右键可快速插入长文本
+ check: true  开启 代码校验，接口监听（前提配置request.js）
+ nameCheckIgnore 为路径匹配，全匹配以及其子路径所有文件，文件夹皆过滤。
+ 配置文件名称必须为 hellper.config.js,否则功能无法开启。
