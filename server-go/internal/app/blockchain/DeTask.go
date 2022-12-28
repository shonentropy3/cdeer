package blockchain

import (
	ABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/message"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/utils"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/tidwall/gjson"
	"gorm.io/gorm/clause"
	"strings"
	"time"
)

func DeTask(transHash model.TransHash, Logs []*types.Log) (haveBool bool, err error) {
	switch transHash.EventName {
	case "TaskCreated":
		err = ParseTaskCreated(transHash, Logs)
		return true, err
	case "TaskModified":
		err = ParseTaskModified(transHash, Logs)
		return true, err
	case "TaskDisabled":
		err = ParseTaskDisabled(transHash, Logs)
		return true, err
	case "ApplyFor":
		err = ParseApplyFor(transHash, Logs)
		return true, err
	case "CancelApply":
		err = ParseCancelApply(transHash, Logs)
		return true, err
	}

	return false, nil
}

// ParseTaskCreated 解析TaskCreated事件
func ParseTaskCreated(transHash model.TransHash, Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeTaskMetaData.ABI))
	if err != nil {
		return err
	}
	for _, vLog := range Logs {
		var taskCreated ABI.DeTaskTaskCreated
		ParseErr := contractAbi.UnpackIntoInterface(&taskCreated, "TaskCreated", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			task := model.Task{TaskID: vLog.Topics[1].Big().Uint64(), Title: taskCreated.Task.Title, Desc: taskCreated.Task.Desc, Period: taskCreated.Task.Period}
			task.Issuer = taskCreated.Issuer.String()
			task.Budget = taskCreated.Task.Budget.String()
			task.Attachment = taskCreated.Task.Attachment
			task.Currency = currencyNames[taskCreated.Task.Currency]
			task.Role = ParseSkills(taskCreated.Task.Skills.Int64())
			// 解析Raw数据
			task.Suffix = gjson.Get(transHash.Raw, "suffix").String()
			// 更新||插入数据
			err = tx.Model(&model.Task{}).Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "task_id"}},
				UpdateAll: true,
			}).Create(&task).Error
			if err != nil {
				tx.Rollback()
				return err
			}
			// 删除任务
			if err = tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Updates(map[string]interface{}{"raw": "", "deleted_at": time.Now()}).Error; err != nil {
				tx.Rollback()
				return err
			}
			// 发送消息
			if err = message.Template("TaskCreated", utils.StructToMap([]any{task}), task.Issuer, "", ""); err != nil {
				tx.Rollback()
				return err
			}
			return tx.Commit().Error
		}
	}
	return errors.New("事件解析失败")
}

// ParseTaskModified 解析TaskModified事件
func ParseTaskModified(transHash model.TransHash, Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeTaskMetaData.ABI))
	if err != nil {
		fmt.Println(err)
	}
	for _, vLog := range Logs {
		var taskModified ABI.DeTaskTaskModified
		ParseErr := contractAbi.UnpackIntoInterface(&taskModified, "TaskModified", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			task := model.Task{TaskID: vLog.Topics[1].Big().Uint64(), Title: taskModified.Task.Title, Desc: taskModified.Task.Desc, Period: taskModified.Task.Period}
			task.Issuer = taskModified.Issuer.String()
			task.Budget = taskModified.Task.Budget.String()
			task.Attachment = taskModified.Task.Attachment
			task.Currency = currencyNames[taskModified.Task.Currency]
			task.Role = ParseSkills(taskModified.Task.Skills.Int64())
			// 解析Raw数据
			task.Suffix = gjson.Get(transHash.Raw, "suffix").String()
			// 更新||插入数据
			err = tx.Model(&model.Task{}).Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "task_id"}},
				UpdateAll: true,
			}).Create(&task).Error
			if err != nil {
				tx.Rollback()
				return err
			}
			// 删除任务
			if err = tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Updates(map[string]interface{}{"raw": "", "deleted_at": time.Now()}).Error; err != nil {
				tx.Rollback()
				return err
			}
			return tx.Commit().Error
		}
	}
	return errors.New("事件解析失败")
}

// ParseTaskDisabled 解析TaskDisabled事件
func ParseTaskDisabled(transHash model.TransHash, Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeTaskMetaData.ABI))
	if err != nil {
		fmt.Println(err)
	}
	for _, vLog := range Logs {
		var taskDisabled ABI.DeTaskTaskDisabled
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
			raw := tx.Model(&model.Task{}).Where("task_id = ?", taskID).Update("deleted_at", time.Now())
			if raw.Error != nil {
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

// ParseApplyFor 解析ApplyFor事件
func ParseApplyFor(transHash model.TransHash, Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeTaskMetaData.ABI))
	if err != nil {
		fmt.Println(err)
	}
	for _, vLog := range Logs {
		var applyFor ABI.DeTaskApplyFor
		ParseErr := contractAbi.UnpackIntoInterface(&applyFor, "ApplyFor", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			taskID := vLog.Topics[1].Big().Uint64()                         // 任务ID
			price := applyFor.Cost.String()                                 // 报价
			applyAddr := common.HexToAddress(vLog.Topics[2].Hex()).String() // 申请人
			apply := model.Apply{TaskID: taskID, Price: price, ApplyAddr: applyAddr}
			// 解析Raw数据
			apply.Desc = gjson.Get(transHash.Raw, "desc").String()
			// 更新||插入数据
			err = tx.Model(&model.Apply{}).Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "apply_addr"}, {Name: "task_id"}},
				UpdateAll: true,
			}).Create(&apply).Error
			if err != nil {
				tx.Rollback()
				return err
			}
			// 查询Task信息
			var task model.Task
			err = tx.Model(&model.Task{}).Where("task_id =?", taskID).First(&task).Error
			if err != nil {
				tx.Rollback()
				return err
			}
			// 发送消息
			if err = message.Template("ApplyFor", utils.StructToMap([]any{apply, task}), task.Issuer, apply.ApplyAddr, ""); err != nil {
				tx.Rollback()
				return err
			}
			// 删除任务
			if err = tx.Model(&model.TransHash{}).Where("hash = ?", vLog.TxHash.String()).Updates(map[string]interface{}{"raw": "", "deleted_at": time.Now()}).Error; err != nil {
				tx.Rollback()
				return err
			}
			return tx.Commit().Error
		}
	}
	return errors.New("事件解析失败")
}

// ParseCancelApply 解析CancelApply事件
func ParseCancelApply(transHash model.TransHash, Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeTaskMetaData.ABI))
	if err != nil {
		fmt.Println(err)
	}
	for _, vLog := range Logs {
		var cancelApply ABI.DeTaskCancelApply
		ParseErr := contractAbi.UnpackIntoInterface(&cancelApply, "CancelApply", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			taskID := vLog.Topics[1].Big().Uint64()  // 任务ID
			applyAddr := cancelApply.Worker.String() // 申请人
			// 开始事务
			tx := global.DB.Begin()
			// 删除数据
			raw := tx.Model(&model.Apply{}).Where("task_id = ?", taskID).Where("apply_addr = ?", applyAddr).Update("deleted_at", time.Now())
			if raw.Error != nil {
				tx.Rollback()
				return
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
