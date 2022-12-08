package blockchain

import (
	DeTaskABI "code-market-admin/abi"
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

func TaskCreatedEvent(task model.Task) {
	// 查找
	client, err := ethclient.Dial("https://summer-tame-pine.matic-testnet.discover.quiknode.pro/fdf3c786bf1dd3e5e848f0c98947ea4f5caee358/")
	if err != nil {
		fmt.Println(err)
	}
	defer client.Close()
	// contract address
	jsonFile, err := os.Open("user.json") // Read JSON file
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
	// topic address
	topic := common.HexToHash("0xd8360f0cdb1cec5c8584cfa3130b0ea128658503f60bfbb817d72f05d9011357")
	// mark scan history
	markBlock := big.NewInt(0)
	// LOOP Scan
	for {
		// get block height
		header, err := client.HeaderByNumber(context.Background(), nil)
		if err != nil {
			log.Fatal(err)
		}
		// Test
		// header.Number = big.NewInt(29498338)
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
			taskCreated, taskId, parseSuc := ParseTaskInfoLog(contractAbi, vLog)
			// parse success then send message to
			if parseSuc {
				_ = taskCreated
				_ = taskId
				// TODO: 修改数据库
				//result := global.DB.Model(&model.Apply{}).Where("id = ?", applyReq.ID).Updates(&applyReq.Apply)
				//if result.RowsAffected == 0 {
				//	return errors.New("修改失败")
				//}
			}
		}
		// mark block is parsed
		markBlock = header.Number
		// time sleep to scan block
		time.Sleep(60 * time.Second)
	}
}

// ParseTaskInfoLog
// parse Log
func ParseTaskInfoLog(contractAbi abi.ABI, vLog types.Log) (taskCreated DeTaskABI.StorageTaskCreated, taskId common.Hash, parseSuc bool) {
	// parse TaskCreated event
	ParseErr := contractAbi.UnpackIntoInterface(&taskCreated, "TaskCreated", vLog.Data)
	// parse success
	if ParseErr == nil {
		//fmt.Printf("%+v", taskCreated)
		return taskCreated, vLog.Topics[1], true
	}
	return taskCreated, taskId, false
}
