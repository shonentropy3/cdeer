# 整体框架

code--market：hardhat项目；

frontend：基于react的next框架的前端项目；

server：基于nest框架的nodejs后端项目，主要作用是作为后端接口使用；

server_data：基于nest框架的nodejs项目，作用为同步数据库和链上数据；

## 注

1. 复制 envExample 文件，命名为.env，添加个人钱包助记词

2. 启动项目之前先启动本地节点，在code--market目录下执行

   ```js
   npx hardhat node
   ```


3. 在code--market项目下建表：

   ```js
   // 第一个postgres为用户名，第二个postgres为库名，可以更改
   psql -p5432 "postgres" -d postgres -f init_tables.sql
   ```


# 项目启动

##  frontend

### 本地启动
```js
// 进入frontend路径下，安装依赖。
npm install
npm install next
npm run dev
```

### 部署
```js
// 打包后用next启动，渲染速度极大提高
npx next build
// 启动
npx next start
```

## server

该项目为前端提供接口

注：

1. 需复制.envExample文件，命名为.env，填写数据

```js
// 本地部署
// 部署task合约
npx hardhat run scripts/1_deploy_CodeMarket.js --network dev
// 部署order合约
npx hardhat run scripts/2_deploy_Order.js --network dev
// 部署order合约
// 若需测试，可以考虑deploy_initPro.js脚本
// npx hardhat run scripts/deploy_initPro.js  --network dev
// 启动项目
npm run start:dev
```

2. 设计创建表实体类，可以参考server项目下package.json包中scripts中的db

## server_data

目前是定时任务同步数据库和链上数据，在server_data/src/app/service/task.ts路径下为定时任务入口；

注：

1. 需复制.envExample文件，命名为.env，填写数据

```js
// 启动项目
npm run start:dev
```

3. 设计创建表实体类，可以参考server_data项目下package.json包中scripts中的db
