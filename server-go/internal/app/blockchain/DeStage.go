package blockchain

import (
	DeTaskABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"errors"
	"github.com/ethereum/go-ethereum/core/types"
)

func DeStage(transHash model.TransHash, Logs []*types.Log) (haveBool bool, err error) {
	switch transHash.EventName {
	case "ConfirmOrderStage":
		err = ParseConfirmOrderStage(Logs)
		return true, err
	}
	return false, nil
}

// ParseConfirmOrderStage 解析ConfirmOrderStage事件
func ParseConfirmOrderStage(Logs []*types.Log) (err error) {
	contractAbi := global.ContractABI["DeStage"]
	for _, vLog := range Logs {
		var taskCreated DeTaskABI.DeTaskTaskCreated
		ParseErr := contractAbi.UnpackIntoInterface(&taskCreated, "ConfirmOrderStage", vLog.Data)
		// parse success
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// TODO:
			// 删除任务
			if err = tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Delete(&model.TransHash{}).Error; err != nil {
				tx.Rollback()
				return err
			}
			return tx.Commit().Error
		}
	}
	return errors.New("事件解析失败")
}
