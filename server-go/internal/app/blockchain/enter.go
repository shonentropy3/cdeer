package blockchain

import (
	"code-market-admin/internal/app/model"
	"errors"
	"github.com/ethereum/go-ethereum/core/types"
)

// HandleTraverseFailed 任务交易失败处理
func HandleTraverseFailed(transHash model.TransHash) {
	if DeTaskFail(transHash) {
		return
	}
}

// HandleTraverseSuccess 任务交易成功处理
func HandleTraverseSuccess(transHash model.TransHash, Logs []*types.Log) error {
	if haveBool, err := DeTask(transHash, Logs); haveBool {
		return err
	} else if haveBool, err = DeOrder(transHash, Logs); haveBool {
		return err
	}

	return errors.New("处理失败")
}
