package blockchain

import (
	DeTaskABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"errors"
	"github.com/ethereum/go-ethereum/core/types"
	"time"
)

func DeTask(transHash model.TransHash, Logs []*types.Log) (haveBool bool, err error) {
	switch transHash.EventName {
	case "TaskCreated":
		err = ParseTaskCreated(Logs)
		return true, err
	case "TaskModified":
		err = ParseTaskModified(Logs)
		return true, err
	case "TaskDisabled":
		err = ParseTaskDisabled(Logs)
		return true, err
	case "ApplyFor":
		err = ParseApplyFor(Logs)
		return true, err
	case "CancelApply":
		err = ParseCancelApply(Logs)
		return true, err
	}

	return false, nil
}

// ParseTaskCreated 解析TaskCreated事件
func ParseTaskCreated(Logs []*types.Log) (err error) {
	contractAbi := global.ContractABI["DeTask"]
	for _, vLog := range Logs {
		var taskCreated DeTaskABI.DeTaskTaskCreated
		ParseErr := contractAbi.UnpackIntoInterface(&taskCreated, "TaskCreated", vLog.Data)
		// 解析成功
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

// ParseTaskModified 解析TaskModified事件
func ParseTaskModified(Logs []*types.Log) (err error) {
	contractAbi := global.ContractABI["DeTask"]
	for _, vLog := range Logs {
		var taskModified DeTaskABI.DeTaskTaskModified
		ParseErr := contractAbi.UnpackIntoInterface(&taskModified, "TaskModified", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			task := model.Task{Status: 202, Title: taskModified.Task.Title, Desc: taskModified.Task.Desc, Period: taskModified.Task.Period}
			task.TaskID = vLog.Topics[1].Big().Uint64()
			task.Budget = taskModified.Task.Budget.String()
			task.Attachment = taskModified.Task.Attachment // 附件
			task.Status = 102                              // 创建成功状态
			// 更新数据
			raw := tx.Model(&model.Task{}).Where("task_id = ?", task.TaskID).Updates(&task)
			if raw.Error != nil {
				tx.Rollback()
				return err
			}
			// 删除任务
			if err = tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Delete(&model.TransHash{}).Error; err != nil {
				tx.Rollback()
				return err
			}
			tx.Commit()
		}
	}
	return errors.New("事件解析失败")
}

// ParseTaskDisabled 解析TaskDisabled事件
func ParseTaskDisabled(Logs []*types.Log) (err error) {
	contractAbi := global.ContractABI["DeTask"]
	for _, vLog := range Logs {
		var taskDisabled DeTaskABI.DeTaskTaskDisabled
		ParseErr := contractAbi.UnpackIntoInterface(&taskDisabled, "TaskDisabled", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			if vLog.Topics[2].Big().Int64() == 0 {
				return
			}
			// 删除数据
			taskID := vLog.Topics[1].Big().Uint64()
			raw := tx.Model(&model.Task{}).Where("task_id = ?", taskID).Update("status", 302).Update("deleted_at", time.Now())
			if raw.Error != nil {
				tx.Rollback()
				return err
			}
			// 删除任务
			if err = tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Delete(&model.TransHash{}).Error; err != nil {
				tx.Rollback()
				return err
			}
			tx.Commit()
		}
	}
	return errors.New("事件解析失败")
}

// ParseApplyFor 解析ApplyFor事件
func ParseApplyFor(Logs []*types.Log) (err error) {
	contractAbi := global.ContractABI["DeTask"]
	for _, vLog := range Logs {
		var applyFor DeTaskABI.DeTaskApplyFor
		ParseErr := contractAbi.UnpackIntoInterface(&applyFor, "ApplyFor", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			taskID := vLog.Topics[1].Big().Uint64() // 任务ID
			price := applyFor.Cost.String()         // 报价
			applyAddr := vLog.Topics[2].String()    // 申请人
			apply := model.Apply{TaskID: taskID, Price: price, ApplyAddr: applyAddr, Status: 102}
			// 更新数据
			raw := tx.Model(&model.Apply{}).Where("task_id = ?", taskID).Where("apply_addr = ?", applyAddr).Updates(&apply)
			if raw.Error != nil {
				tx.Rollback()
				return
			}
			// 删除任务
			if err = tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Delete(&model.TransHash{}).Error; err != nil {
				tx.Rollback()
				return err
			}
			tx.Commit()
		}
	}
	return errors.New("事件解析失败")
}

// ParseCancelApply 解析CancelApply事件
func ParseCancelApply(Logs []*types.Log) (err error) {
	contractAbi := global.ContractABI["DeTask"]
	for _, vLog := range Logs {
		var cancelApply DeTaskABI.DeTaskCancelApply
		ParseErr := contractAbi.UnpackIntoInterface(&cancelApply, "CancelApply", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			taskID := vLog.Topics[1].Big().Uint64()  // 任务ID
			applyAddr := cancelApply.Worker.String() // 申请人
			// 开始事务
			tx := global.DB.Begin()
			// 删除数据
			raw := tx.Model(&model.Apply{}).Where("task_id = ?", taskID).Where("apply_addr = ?", applyAddr).Update("status", 302).Update("deleted_at", time.Now())
			if raw.Error != nil {
				tx.Rollback()
				return
			}
			// 删除任务
			if err = tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Delete(&model.TransHash{}).Error; err != nil {
				tx.Rollback()
				return err
			}
			tx.Commit()
		}
	}
	return errors.New("事件解析失败")
}
