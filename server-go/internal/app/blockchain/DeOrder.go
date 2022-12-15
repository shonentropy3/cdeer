package blockchain

import (
	ABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/core/types"
	"gorm.io/gorm/clause"
	"strings"
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
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeOrderMetaData.ABI))
	if err != nil {
		fmt.Println(err)
	}
	for _, vLog := range Logs {
		var orderCreated ABI.DeOrderOrderCreated
		ParseErr := contractAbi.UnpackIntoInterface(&orderCreated, "OrderCreated", vLog.Data)
		// parse success
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			fmt.Println("Transaction")
			order := model.Order{TaskID: vLog.Topics[2].Big().Int64(), OrderId: vLog.Topics[1].Big().Int64()}
			order.Issuer = orderCreated.Issuer.String() // 甲方
			order.Worker = orderCreated.Worker.String() // 乙方
			// 更新||插入数据
			err = tx.Model(&model.Order{}).Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "order_id"}},
				UpdateAll: true,
			}).Create(&order).Error
			if err != nil {
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
