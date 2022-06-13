#  结构
upchain--code--market：hardhat项目
codeMarket_backend：node后端项目
codeMarket_frontend：react前端项目

## 安装依赖
```
upchain--code--market：hardhat项目
codeMarket_backend：node后端项目
codeMarket_frontend：react前端项目

分别进入项目路径下，安装依赖。
npm install
```

## 配置助记词等
```
    cp envExample .env
    修改以下字段：
    MNEMONIC: 助记词（用于签名，默认部署者）
```

## 运行
```
upchain--code--market
启动本地节点：
npx hardhat node 
本地部署：
npx hardhat run scripts/1_deploy_CodeMarket.js --network dev

(codeMarket_frontend目录下)：
npm run start

(codeMarket_backend目录下)：
node main.js
```

## 功能