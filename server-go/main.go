package main

import (
	ABI "code-market-admin/abi"
	"code-market-admin/internal/app/blockchain"
	"code-market-admin/internal/app/core"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/initialize"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"go.uber.org/zap"
	"log"
	"math/big"
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
	global.JsonCache = initialize.JsonCache()
	global.TokenCache = initialize.TokenCache()
	// 启动扫块任务
	go blockchain.HandleTransaction()
	core.RunWindowsServer()

	//client, err := ethclient.Dial("https://summer-tame-pine.matic-testnet.discover.quiknode.pro/fdf3c786bf1dd3e5e848f0c98947ea4f5caee358/")
	client, err := ethclient.Dial("https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
	if err != nil {
		log.Fatal(err)
	}
	address := common.HexToAddress("0xbFfCBB5b474D208B7F82F3958E08c664f29365f4")
	instance, err := ABI.NewDeOrder(address, client)
	if err != nil {
		fmt.Println("1")
		fmt.Println(err)
	}
	version, err := instance.GetOrder(nil, big.NewInt(10))
	if err != nil {
		fmt.Println(err)
	}

	//version, err := instance.GetOrder(nil, big.NewInt(7))
	//if err != nil {
	//	fmt.Println(err)
	//}
	//fmt.Println(version) // "1.0"
	fmt.Printf("%+v", version) // "1.0"
}
