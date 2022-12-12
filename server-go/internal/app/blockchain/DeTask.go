package blockchain

import (
	DeTaskABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"errors"
	"github.com/ethereum/go-ethereum/core/types"
)

func DeTask(transHash model.TransHash, Logs []*types.Log) (haveBool bool, err error) {
	switch transHash.EventName {
	case "TaskCreated":
		err = ParseTaskCreated(Logs)
		return true, err
	}
	return false, nil
}

// ParseTaskCreated 解析TaskCreated事件
func ParseTaskCreated(Logs []*types.Log) (err error) {
	for _, vLog := range Logs {
		contractAbi := global.ContractABI["DeTask"]
		var taskCreated DeTaskABI.DeTaskTaskCreated
		ParseErr := contractAbi.UnpackIntoInterface(&taskCreated, "TaskCreated", vLog.Data)
		// parse success
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			task := model.Task{TaskID: vLog.Topics[1].Big().Uint64(), Status: 1, Title: taskCreated.Task.Title, Desc: taskCreated.Task.Desc, Period: taskCreated.Task.Period}
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

// ParseTaskModified 解析TaskModified事件
func ParseTaskModified(vLog types.Log) {
	contractAbi := global.ContractABI["DeTask"]
	var taskModified DeTaskABI.DeTaskTaskModified
	ParseErr := contractAbi.UnpackIntoInterface(&taskModified, "TaskModified", vLog.Data)
	// parse success
	if ParseErr == nil {
		// 开始事务
		tx := global.DB.Begin()
		// 更新数据--不存在则插入
		// TODO: 技能要求
		task := model.Task{TaskID: vLog.Topics[1].Big().Uint64(), Status: 1, Title: taskModified.Task.Title, Desc: taskModified.Task.Desc, Period: taskModified.Task.Period}
		task.Budget = taskModified.Task.Budget.String()
		task.Attachment = taskModified.Task.Attachment
		task.Hash = vLog.TxHash.String()
		task.Status = 102
		// 删除数据
		raw := tx.Model(&model.Task{}).Where("task_id = ?", vLog.Topics[1].Big().Uint64()).Updates(&task)
		if raw.Error != nil {
			tx.Rollback()
			return
		}
		// 删除任务
		if err := tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Delete(&model.TransHash{}).Error; err != nil {
			tx.Rollback()
			return
		}
		tx.Commit()
	}
	return
}

// ParseTaskDisabled 解析TaskDisabled事件
func ParseTaskDisabled(vLog types.Log) {
	contractAbi := global.ContractABI["DeTask"]
	var taskDisabled DeTaskABI.DeTaskTaskDisabled
	ParseErr := contractAbi.UnpackIntoInterface(&taskDisabled, "TaskDisabled", vLog.Data)
	// parse success
	if ParseErr == nil {
		// 开始事务
		tx := global.DB.Begin()
		if vLog.Topics[2].Big().Int64() == 0 {
			return
		}
		// 删除数据
		raw := tx.Model(&model.Task{}).Where("task_id = ?", vLog.Topics[1].Big().Uint64()).Delete(&model.Task{})
		if raw.Error != nil {
			tx.Rollback()
			return
		}
		// 删除任务
		if err := tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Delete(&model.TransHash{}).Error; err != nil {
			tx.Rollback()
			return
		}
		tx.Commit()
	}
	return
}

// ParseApplyFor 解析ApplyFor事件
func ParseApplyFor(vLog types.Log) {
	contractAbi := global.ContractABI["DeTask"]
	var applyFor DeTaskABI.DeTaskApplyFor
	ParseErr := contractAbi.UnpackIntoInterface(&applyFor, "ApplyFor", vLog.Data)

	// parse success
	if ParseErr == nil {
		// 开始事务
		tx := global.DB.Begin()
		// 更新数据--不存在则插入
		// TODO: 技能要求
		apply := model.Apply{TaskID: vLog.Topics[1].Big().Uint64(), Price: applyFor.Cost.String(), Hash: vLog.TxHash.String()}
		// 更新数据
		raw := tx.Model(&model.Apply{}).Where("apply_addr = ?", vLog.Topics[2].String()).Updates(&apply)
		if raw.Error != nil {
			tx.Rollback()
			return
		}
		// 不存在则插入
		if raw.RowsAffected == 0 {
			if err := tx.Model(&model.Apply{}).Save(&apply); err != nil {
				tx.Rollback()
				return
			}
		}
		// 删除任务
		if err := tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Delete(&model.TransHash{}).Error; err != nil {
			tx.Rollback()
			return
		}
		tx.Commit()
	}
	return
}
