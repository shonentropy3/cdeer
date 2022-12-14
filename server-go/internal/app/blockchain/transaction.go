package blockchain

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"strings"
	"sync"
	"time"
)

func HandleTransaction() {
	// 错误处理
	defer func() {
		if err := recover(); err != nil {
			global.LOG.Error("HandleTransaction致命错误")
			time.Sleep(time.Second * 3)
			go HandleTransaction()
		}
	}()
	//
	client, err := ethclient.Dial(global.CONFIG.Contract.Provider)
	//client, err := ethclient.Dial("https://summer-tame-pine.matic-testnet.discover.quiknode.pro/fdf3c786bf1dd3e5e848f0c98947ea4f5caee358/")
	if err != nil {
		panic("Error dial")
	}
	var txMap sync.Map

	// 循环
	for {
		// 获取需要扫描的数据
		var transHashList []model.TransHash
		db := global.DB.Model(&model.TransHash{})
		if err := db.Find(&transHashList).Error; err != nil {
			continue
		}
		var haveBool bool // 是否空map
		txMap.Range(func(key, value interface{}) bool {
			haveBool = true
			return false
		})
		// 无任务
		if len(transHashList) == 0 && haveBool {
			continue
		}
		// 任务列表
		for _, trans := range transHashList {
			trans.Hash = strings.TrimSpace(trans.Hash)
			_, loaded := txMap.LoadOrStore(trans.Hash, trans)
			if loaded == false {
				go HandleTransactionReceipt(client, txMap, trans.Hash)
			}
		}
		time.Sleep(time.Second * 10)
	}
}

func HandleTransactionReceipt(client *ethclient.Client, txMap sync.Map, hash string) {
	// 是否在处理列表
	transHashAny, ok := txMap.Load(hash)
	if !ok {
		return
	}
	transHash, ok := transHashAny.(model.TransHash)
	if !ok {
		global.LOG.Error("HandleTransactionReceipt Reflect Error")
		return
	}
	fmt.Println(hash)
	// 解析交易Hash
	res, err := client.TransactionReceipt(context.Background(), common.HexToHash(hash))
	// 待交易
	if err != nil {
		fmt.Println("待交易")
		fmt.Println(err)
		txMap.Delete(hash)
		// TODO: 控制尝试次数
		return
	}
	// 交易失败
	if res.Status == 0 {
		fmt.Println("交易失败")
		HandleTraverseFailed(transHash)
		txMap.Delete(hash)
	}
	// 交易成功
	if res.Status == 1 {
		fmt.Println("交易成功")
		if err := HandleTraverseSuccess(transHash, res.Logs); err != nil {
			fmt.Println(err)
			txMap.Delete(hash)
		} else {
			fmt.Println("交易成功--删除")
			txMap.Delete(hash)
		}
	}
}
