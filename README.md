# lczx-web
lczx web client

## [vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/)

## 开发

```bash
# 克隆项目
git clone https://github.com/liusuxian/lczx-web.git

# 进入项目目录
cd lczx-web

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
## 第三方插件
```bash
# 安装StreamSaver
npm install streamsaver

# 安装vue-treeselect
npm install --save @riophae/vue-treeselect

# 安装element-china-area-data
npm install element-china-area-data -S

# 安装wl-vue-select
npm i wl-vue-select -S

# 安装wl-explorer
npm i wl-explorer -S
```
