package blockchain

import (
	DeTaskABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"github.com/ethereum/go-ethereum/core/types"
)

func DeTask(vLog types.Log) {
	DeTaskABI := global.ContractABI["DeTask"]
	switch vLog.Topics[0] {
	case DeTaskABI.Events["TaskCreated"].ID:
		ParseTaskCreated(vLog)
	}
}

// ParseTaskCreated 解析TaskCreated事件
func ParseTaskCreated(vLog types.Log) {
	contractAbi := global.ContractABI["DeTask"]
	var taskCreated DeTaskABI.DeTaskTaskCreated
	ParseErr := contractAbi.UnpackIntoInterface(&taskCreated, "TaskCreated", vLog.Data)
	// parse success
	if ParseErr == nil {
		// 开始事务
		tx := global.DB.Begin()
		// 更新数据--不存在则插入
		task := model.Task{TaskID: vLog.Topics[1].Big().Uint64(), Status: 1, Title: taskCreated.Task.Title, Desc: taskCreated.Task.Desc, Period: taskCreated.Task.Period}
		task.Budget = taskCreated.Task.Budget.String()
		task.Attachment = taskCreated.Task.Attachment
		// 更新数据
		raw := tx.Model(&model.Task{}).Where("hash = ?", vLog.TxHash.String()).Updates(&task)
		if raw.Error != nil {
			tx.Rollback()
			return
		}
		//// 不存在则插入
		//if raw.RowsAffected == 0 {
		//	if err := tx.Model(&model.Task{})
		//}

		// 删除任务
		if err := tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Delete(&model.TransHash{}).Error; err != nil {
			tx.Rollback()
			return
		}
		tx.Commit()
	}
	return
}
