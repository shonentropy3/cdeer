package service

import (
	"code-market-admin/internal/app/blockchain"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"errors"
)

func SaveHash(transHash model.TransHash) (err error) {
	transHashRes := global.DB.Model(&model.TransHash{}).Create(&transHash)
	if transHashRes.RowsAffected == 0 {
		return errors.New("新建失败")
	}
	// 启动扫描任务
	if !global.Traversed.Load() {
		go blockchain.HandleTransaction()
	}
	return nil
}
