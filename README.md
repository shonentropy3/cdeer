# 代码逻辑：
Detask : 用于描述任务 IPFS
 
DeOrder: 用于敲定合作，邀请合作时创建 Order（createOrder）

确认双方（两个地址）  
确认合作进展（阶段）、项目规划、分阶段付款（按期付款模式、验收付款模式）
确认 付款方式

payOrder + startOrder()  锁定资金 
验收付款模式下， 项目方确认验收、接单方收款
最后一个阶段，接单方收款，项目完成（领 SBT）

穿插逻辑：延长、增加阶段、终止合作


# 分支

master: 开发分支;

mumbai: 测试分支;


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


3. 在code--market项目下

创建数据库：
```
sudo su postgres
create database detask;
create user detask password 'detask@123';

```

进入 psql： 
```
sql -p5432 -U detask -d detask -h 127.0.0.1 -W
```

建表：
   ```js
   // 第一个detask为用户名，第二个detask为库名，可以更改
   psql -p5432 "detask" -d detask -f init_tables.sql
   // 或(Mac) 
   /Applications/Postgres.app/Contents/Versions/14/bin/psql -p5432  "detask" -d detask -f init_tables.sql
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


