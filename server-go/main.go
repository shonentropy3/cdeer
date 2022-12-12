package main

import (
	"code-market-admin/internal/app/core"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/initialize"
	"go.uber.org/zap"
)

func main() {
	// 初始化Viper
	global.VIP = core.Viper()
	// 初始化zap日志库
	global.LOG = core.Zap()
	// 注册全局logger
	zap.ReplaceGlobals(global.LOG)
	// 初始化GORM连接
	global.DB = initialize.Gorm()
	// 初始化数据库
	if global.DB != nil {
		initialize.RegisterTables(global.DB) // 初始化表
		// 程序结束前关闭数据库链接
		db, _ := global.DB.DB()
		defer db.Close()
	}
	// 初始化缓存
	global.Cache = initialize.Cache()
	// 初始化合约ABI
	initialize.InitContract()

	// 启动扫块任务
	//go blockchain.HandleTransaction()
	core.RunWindowsServer()
}
