package blockchain

import (
	DeTaskABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"github.com/ethereum/go-ethereum/core/types"
)

func DeTask(vLog types.Log) {
	DeTaskABI := global.ContractABI["DeTask"]
	if vLog.Topics[0] == DeTaskABI.Events["TaskCreated"].ID {
		ParseTaskCreated(vLog)
	}
	_ = vLog
}

// ParseTaskCreated
func ParseTaskCreated(vLog types.Log) {
	contractAbi := global.ContractABI["DeTask"]
	var taskCreated DeTaskABI.StorageTaskCreated
	ParseErr := contractAbi.UnpackIntoInterface(&taskCreated, "TaskCreated", vLog.Data)
	// parse success
	if ParseErr == nil {
		// 开始事务
		tx := global.DB.Begin()
		// 更新数据
		// TODO: 解析技能要求
		task := model.Task{TaskID: vLog.Topics[1].Big().Uint64(), Status: 1, Title: taskCreated.Task.Title, Desc: taskCreated.Task.Desc, Period: taskCreated.Task.Period}
		task.Budget = taskCreated.Task.Budget.String()
		task.Attachment = taskCreated.Task.Attachment
		if err := tx.Model(&model.Task{}).Where("hash = ?", vLog.TxHash).Updates(&task).Error; err != nil {
			tx.Rollback()
			return
		}

		// 删除任务
		if err := tx.Model(&model.TransHash{}).Where("id = ?", vLog.TxHash).Delete(&model.TransHash{}).Error; err != nil {
			tx.Rollback()
			return
		}
		tx.Commit()
	}
	return
}
