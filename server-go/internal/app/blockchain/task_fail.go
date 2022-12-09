package blockchain

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
)

func DeTaskFail(transHash model.TransHash) (match bool) {
	switch transHash.EventName {
	case "TaskCreated":
		DeTaskFailTask(transHash, 103)
	case "TaskModified":
		DeTaskFailTask(transHash, 203)
	case "TaskDisabled":
		DeTaskFailTask(transHash, 303)
	default:
		return false
	}
	return true
}

func DeTaskFailTask(transHash model.TransHash, status int64) {
	// 开始事务
	tx := global.DB.Begin()
	if err := tx.Model(&model.Task{}).Where("hash = ?", transHash.Hash).Update("status", status).Error; err != nil {
		tx.Rollback()
		return
	}
	if err := tx.Model(&model.TransHash{}).Where("hash = ?", transHash.Hash).Delete(&transHash).Error; err != nil {
		tx.Rollback()
		return
	}
	// 提交事务
	tx.Commit()
}
