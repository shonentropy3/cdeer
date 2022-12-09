package blockchain

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"gorm.io/gorm"
	"log"
	"math/big"
	"time"
)

func TraverseBlocks() (err error) {
	if global.Traversed {
		return err
	}
	global.Traversed = true
	//client, err := ethclient.Dial("https://summer-tame-pine.matic-testnet.discover.quiknode.pro/fdf3c786bf1dd3e5e848f0c98947ea4f5caee358/")
	client, err := ethclient.Dial("https://backend.buildbear.io/node/charming-bohr-99d0de")
	if err != nil {
		fmt.Println(err)
	}
	defer client.Close()
	// mark scan history
	markBlock := big.NewInt(0)
	// LOOP Scan
	for {
		// 扫描
		go TraverseFailed()
		// 获取需要扫描的数据
		var taskList []model.TransHash
		db := global.DB.Model(&model.TransHash{})
		if err = db.Find(&taskList).Error; err != nil {
			return err
		}
		if len(taskList) == 0 {
			global.Traversed = false
			return err
		}
		// 监听事件列表
		//contractAddress := global.ContractAddr["contract"]
		var contractAddressList []common.Address
		for _, v := range global.ContractAddr {
			contractAddressList = append(contractAddressList, v)
		}
		// 开始扫描
		// get block height
		header, err := client.HeaderByNumber(context.Background(), nil)
		if err != nil {
			log.Fatal(err)
		}
		// Test
		//header.Number = big.NewInt(29533037)
		// from block height
		fromBlock := big.NewInt(0)
		fromBlock.Sub(header.Number, big.NewInt(100))
		// markBlock bigger than block height-100
		if markBlock.Cmp(fromBlock) == 1 {
			fromBlock = markBlock
		}
		fmt.Println("fromBlock: ", fromBlock)
		fmt.Println("ToBlock: ", header.Number)
		// block
		query := ethereum.FilterQuery{
			FromBlock: fromBlock,
			ToBlock:   header.Number,
			Addresses: contractAddressList,
		}
		// Load contract ABI
		logs, err := client.FilterLogs(context.Background(), query)
		if err != nil {
			log.Fatal(err)
		}
		for _, vLog := range logs {
			fmt.Println("range")
			ParseLog(vLog)
		}
		// mark block is parsed
		markBlock = header.Number

		// 扫描次数+1
		go TraversePush()
		// time sleep to scan block
		time.Sleep(60 * time.Second)
	}
}

// ParseLog TODO: 优化
func ParseLog(vLog types.Log) {
	switch global.AddrContract[vLog.Address] {
	case "DeTask":
		DeTask(vLog)
	case "DeOrder":

	}
}

// TraverseFailed 任务上链失败处理
func TraverseFailed() {
	db := global.DB.Model(&model.TransHash{})
	// 查找次数大于20的任务
	var transHashList []model.TransHash
	if err := db.Where("try_times >=20").Find(&transHashList); err != nil {
		fmt.Println(err)
		return
	}
	for _, t := range transHashList {
		if DeTaskFail(t) {
			return
		}
	}
}

func TraversePush() {
	db := global.DB.Model(&model.TransHash{}).Session(&gorm.Session{AllowGlobalUpdate: true})
	if err := db.Update("try_times", gorm.Expr("try_times + ?", 1)).Error; err != nil {
		return
	}
}
