package blockchain

import (
	"code-market-admin/internal/app/global"
	"github.com/ethereum/go-ethereum/core/types"
)

func DeOrder(vLog types.Log) {
	DeOrderABI := global.ContractABI["DeOrder"]
	switch vLog.Topics[0] {
	case DeOrderABI.Events["OrderCreated"].ID:
	}
}
