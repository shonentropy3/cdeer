## Detask-Go后端项目结构

```shell
├── assets
├── cmd
├── config
├── docs
├── frontend
├── internal
│   └── app
│       ├── api
│       ├── config
│       ├── core
│       ├── global
│       ├── initialize
│       ├── middleware
│       ├── model
│       ├── resource
│       ├── router
│       ├── service
│       ├── source
│       ├── task
│       └── utils
└── uploads
```

| 文件夹       | 说明                    | 描述                        |
| ------------ | ----------------------- | --------------------------- |
| `assets` | 资源文件 | 资源文件 |
| `cmd` | 程序入口 | 程序初始化 |
| `config` | 配置文件目录 | 配置文件目录 |
| `docs` | swagger文档目录 | swagger文档目录 |
| `frontend` | 后台前端目录 | 后台前端目录 |
| `internal` | 内部函数               |  |
| `--app` |  |  |
| `api` | v1版本接口              | v1版本接口                  |
| `config`     | 配置包                  | config.yaml对应的配置结构体 |
| `core`       | 核心文件                | 核心组件(zap, viper, server)的初始化 |
| `global`     | 全局对象                | 全局对象 |
| `initialize` | 初始化 | router,redis,gorm,validator, timer的初始化 |
| `middleware` | 中间件层 | 用于存放 `gin` 中间件代码 |
| `model`      | 模型层                  | 模型对应数据表              |
| `resource`   | 静态资源文件夹          | 负责存放静态文件                |
| `router`     | 路由层                  | 路由层 |
| `service`    | service层               | 存放业务逻辑问题 |
| `source` | source层 | 存放初始化数据的函数 |
| `utils`      | 工具包                  | 工具函数封装            |
| `task`       | 定时任务        | 存放定时任务具体实现                       |


## 交叉编译

编译成二进制文件后可以直接运行
```shell
# 编译成 Linux
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build
# 编译成 macOS ARM64
CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build
# 编译成Windows
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build 
```
## 服务部署

#### 1、修改配置文件

```
cp ./config/config.demo.yaml ./config/config.yaml
vi ./config/config.yaml
```

```yaml
# system configuration
system:
  env: public  # 程序运行环境public/develop
  addr: 8888 # 程序运行端口
  db-type: pgsql # 数据库类型pgsql/mysql
  oss-type: local # OSS类型
  use-multipoint: false
  use-redis: false
  use-captcha: false
  iplimit-count: 15000
  iplimit-time: 3600

# pgsql configuration
pgsql:
  path: "127.0.0.1"   # 数据库IP
  port: "5432"        # 数据库端口
  config: "" 
  db-name: "itom-admin" # 数据库库名
  username: "postgres"  # 数据库用户
  password: "123456"    # 数据库密码
  max-idle-conns: 10    # 闲置链接数
  max-open-conns: 100   # 最大链接数
  log-mode: "info"      # 日志模式info/warn/error/slice
  log-zap: false
```