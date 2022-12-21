package main

import (
	"code-market-admin/internal/app/blockchain"
	"code-market-admin/internal/app/core"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/initialize"
	"go.uber.org/zap"
	"time"
)

func main() {
	global.StartTime = time.Now()
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
	// 初始化合约地址
	initialize.InitContract()
	// 初始化缓存
	global.Cache = initialize.Cache()
	// 启动扫块任务
	go blockchain.HandleTransaction()
	core.RunWindowsServer()
	/*
		client, err := ethclient.Dial("https://backend.buildbear.io/node/charming-bohr-99d0de")
		if err != nil {
			log.Fatal(err)
		}
		address := common.HexToAddress("0x0F6332bA28917FcEeB3e8184b2cfF242958Da0e6")
		instance, err := DeTaskABI.NewDeOrder(address, client)
		if err != nil {
			fmt.Println("1")
			fmt.Println(err)
		}
		version, err := instance.GetOrder(nil, big.NewInt(5))
		if err != nil {
			fmt.Println("2")
			fmt.Println(err)
		}

		fmt.Printf("%+v", version) // "1.0"
	*/
}
