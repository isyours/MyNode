#Nodejs Blog


一个简单的博客系统，包含博客列表展示、博客详情展示、留言板、博客内容编辑功能。

前端使用了ReactJs框架，使用了MaterialUi样式。后端使用NodeJs和MongoDb。

## 前端目录

前端逻辑保存在`MyNode/app`：
```aidl
app/main.js: 前端应用入口
app/routes.js: 路由配置
app/alt.js: 消息总线
app/actions: 保存前后端通信逻辑
app/components: 模块化实现页面及样式
app/stores: 通信成功后的回调方法
app/stylesheets: 样式模板
```

## 后端目录

后端逻辑保存在`MyNode/server`：
```
server/config: 路由配置、环境配置
server/controller: 前端接口
server/middlewares： 鉴权配置
```


线上作品：[GKwen](https://www.gkwen.com/)
