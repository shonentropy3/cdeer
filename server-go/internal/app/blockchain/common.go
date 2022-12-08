package blockchain

import (
	DeTaskABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"context"
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"io"
	"log"
	"math/big"
	"os"
	"strings"
	"time"
)

type ContractAddr struct {
	Address      string `json:"address"`
	ContractName string `json:"contractName"`
}

func TraverseBlocks() (err error) {
	client, err := ethclient.Dial("https://summer-tame-pine.matic-testnet.discover.quiknode.pro/fdf3c786bf1dd3e5e848f0c98947ea4f5caee358/")
	if err != nil {
		fmt.Println(err)
	}
	defer client.Close()
	// contract address
	jsonFile, err := os.Open("./abi/DeTask.json") // Read JSON file
	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()
	byteValue, _ := io.ReadAll(jsonFile)
	var contractAddr ContractAddr
	err = json.Unmarshal([]byte(byteValue), &contractAddr)
	if err != nil {
		fmt.Println(err)
	}
	contractAddress := common.HexToAddress(contractAddr.Address)
	// TODO: 将topic存为列表过滤  topic address
	topic := common.HexToHash("0xd8360f0cdb1cec5c8584cfa3130b0ea128658503f60bfbb817d72f05d9011357")
	// mark scan history
	markBlock := big.NewInt(0)
	// LOOP Scan
	for {
		// 获取需要扫描的数据
		var taskList []model.TransHash
		db := global.DB.Model(&model.TransHash{})
		if err = db.Find(&taskList).Error; err != nil {
			return err
		}
		if len(taskList) == 0 {
			return err
		}
		// 开始扫描
		// get block height
		header, err := client.HeaderByNumber(context.Background(), nil)
		if err != nil {
			log.Fatal(err)
		}
		// Test
		header.Number = big.NewInt(29533037)
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
			Addresses: []common.Address{contractAddress},
			Topics:    [][]common.Hash{{topic}},
		}
		// Load contract ABI
		logs, err := client.FilterLogs(context.Background(), query)
		if err != nil {
			log.Fatal(err)
		}
		contractAbi, err := abi.JSON(strings.NewReader(DeTaskABI.StorageMetaData.ABI))
		if err != nil {
			fmt.Println(err)
		}

		for _, vLog := range logs {
			ParseLog(taskList, contractAbi, vLog)
		}
		// mark block is parsed
		markBlock = header.Number
		// time sleep to scan block
		time.Sleep(60 * time.Second)
	}
}

// ParseLog TODO: 优化
func ParseLog(taskList []model.TransHash, contractAbi abi.ABI, vLog types.Log) {
	for _, v := range taskList {
		// 交易hash相同
		if common.HexToHash(v.Hash) == vLog.TxHash {
			var taskCreated DeTaskABI.StorageTaskCreated
			ParseErr := contractAbi.UnpackIntoInterface(&taskCreated, "TaskCreated", vLog.Data)
			// parse success
			if ParseErr == nil {
				//fmt.Printf("%+v", taskCreated)
				// 更新数据库
				// 开始事务
				tx := global.DB.Begin()
				if err := tx.Model(&model.Task{}).Where("hash = ?", v.Hash).Updates(&model.Task{TaskID: vLog.Topics[1].Big().Uint64(), Status: 1}).Error; err != nil {
					tx.Rollback()
					fmt.Println("dd1")
					return
				}
				if err := tx.Model(&model.TransHash{}).Where("id = ?", v.ID).Delete(&model.TransHash{}).Error; err != nil {
					tx.Rollback()
					fmt.Println("dd2")
					return
				}
				tx.Commit()
			}
		}
	}
}
