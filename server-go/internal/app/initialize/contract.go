package initialize

import (
	"code-market-admin/internal/app/global"
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"io"
	"os"
	"path/filepath"
)

type ContractAddr struct {
	Address      string `json:"address"`
	ContractName string `json:"contractName"`
}

// InitContract 加载合约信息
func InitContract() {
	// 初始化全局变量
	global.ContractAddr = make(map[string]common.Address)
	// 遍历当前目录下的JSON文件，获取合约地址
	dir := fmt.Sprintf("./abi/%s/", global.CONFIG.Contract.Net)
	if err := filepath.Walk(dir, walkFunc); err != nil {
		panic(err)
	}
}

func walkFunc(path string, info os.FileInfo, err error) error {
	// 判断文件是否是JSON文件
	if filepath.Ext(path) == ".json" {
		// 打开文件
		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()

		// 解析JSON文件
		byteValue, _ := io.ReadAll(file)
		var contractAddr ContractAddr
		err = json.Unmarshal([]byte(byteValue), &contractAddr)
		if err != nil {
			fmt.Println(err)
		}

		global.ContractAddr[contractAddr.ContractName] = common.HexToAddress(contractAddr.Address)
	}

	return nil
}
