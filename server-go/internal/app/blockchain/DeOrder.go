package blockchain

import (
	DeTaskABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"errors"
	"github.com/ethereum/go-ethereum/core/types"
)

func DeOrder(transHash model.TransHash, Logs []*types.Log) (haveBool bool, err error) {
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
		var orderCreated DeTaskABI.DeOrderOrderCreated
		ParseErr := contractAbi.UnpackIntoInterface(&orderCreated, "OrderCreated", vLog.Data)
		// parse success
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			order := model.Order{TaskID: orderCreated.TaskId.Int64(), OrderId: orderCreated.OrderId.Int64()}
			order.Issuer = orderCreated.Issuer.String() // 甲方
			order.Worker = orderCreated.Worker.String() // 乙方
			// 更新数据
			if err = tx.Model(&model.Order{}).Where("hash = ?", vLog.TxHash.String()).Updates(&order).Error; err != nil {
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
