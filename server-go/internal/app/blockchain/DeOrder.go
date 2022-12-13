package blockchain

import (
	DeTaskABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"errors"
	"github.com/ethereum/go-ethereum/core/types"
)

func DeOrde(transHash model.TransHash, Logs []*types.Log) (haveBool bool, err error) {
	switch transHash.EventName {
	case "OrderCreated":
		err = ParseOrderCreated(Logs)
		return true, err
	}

	return false, nil
}

// ParseOrderCreated 解析OrderCreated事件
func ParseOrderCreated(Logs []*types.Log) (err error) {
	contractAbi := global.ContractABI["DeOrder"]
	for _, vLog := range Logs {
		var taskCreated DeTaskABI.DeTaskTaskCreated
		ParseErr := contractAbi.UnpackIntoInterface(&taskCreated, "TaskCreated", vLog.Data)
		// parse success
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			task := model.Task{TaskID: vLog.Topics[1].Big().Uint64(), Show: true, Status: 102, Title: taskCreated.Task.Title, Desc: taskCreated.Task.Desc, Period: taskCreated.Task.Period}
			task.Budget = taskCreated.Task.Budget.String()
			task.Attachment = taskCreated.Task.Attachment
			// 更新数据
			if err = tx.Model(&model.Task{}).Where("hash = ?", vLog.TxHash.String()).Updates(&task).Error; err != nil {
				tx.Rollback()
				return err
			}
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
