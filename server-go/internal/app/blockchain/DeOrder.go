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
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/tidwall/gjson"
	"go.uber.org/zap"
	"gorm.io/gorm/clause"
	"math/big"
	"strings"
	"time"
)

func DeOrder(transHash model.TransHash, Logs []*types.Log) (haveBool bool, err error) {
	switch transHash.EventName {
	case "OrderCreated":
		err = ParseOrderCreated(transHash, Logs)
		return true, err
	case "OrderAbort":
		err = ParseOrderAbort(transHash, Logs)
		return true, err
	}

	return false, nil
}

// ParseOrderCreated 解析OrderCreated事件
func ParseOrderCreated(transHash model.TransHash, Logs []*types.Log) (err error) {
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
			order := model.Order{TaskID: vLog.Topics[1].Big().Int64(), OrderId: vLog.Topics[2].Big().Int64()}
			order.Issuer = orderCreated.Issuer.String() // 甲方
			order.Worker = orderCreated.Worker.String() // 乙方
			// 解析 币种
			// 解析Raw数据
			order.Currency = gjson.Get(transHash.Raw, "currency").String()
			// 更新||插入数据
			err = tx.Model(&model.Order{}).Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "order_id"}},
				UpdateAll: true,
			}).Create(&order).Error
			if err != nil {
				tx.Rollback()
				return err
			}
			// 插入日志表
			orderFlow := model.OrderFlow{OrderId: order.OrderId}
			err = tx.Model(&model.OrderFlow{}).Create(&orderFlow).Error
			if err != nil {
				tx.Rollback()
				return err
			}

			// 更新apply表状态
			_ = tx.Model(&model.Apply{}).Where("apply_addr = ? AND task_id = ?", order.Worker, order.TaskID).Update("status", 1).Error
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

// UpdatedProgress 更新任务Progress状态
func UpdatedProgress(orderID int64) (err error) {
	// 错误处理
	defer func() {
		if err := recover(); err != nil {
			global.LOG.Error("UpdatedProgress错误", zap.Any("err:", err))
			time.Sleep(time.Second * 3)
			go UpdatedProgress(orderID)
		}
	}()
	// 获取当前progress
	var progress uint8
	if err = global.DB.Model(&model.Order{}).Select("progress").Where("order_id = ?", orderID).First(&progress).Error; err != nil {
		return err
	}
	// client
	client, err := ethclient.Dial(global.CONFIG.Contract.Provider)
	if err != nil {
		return err
	}
	// 合约地址
	address := global.ContractAddr["DeOrder"]
	instance, err := ABI.NewDeOrder(address, client)
	if err != nil {
		return err
	}
	order, err := instance.GetOrder(nil, big.NewInt(orderID))
	if err != nil {
		return err
	}
	// 获取失败
	if order.Progress == 0 && progress != 0 {
		return errors.New("操作失败")
	}
	// 任务进行中
	if order.Progress == 4 && progress != 4 {
		if err = issuerAgreeOperation(orderID); err != nil {
			return err
		}
	}
	// 任务完成 修改state
	if (order.Progress == 7 && progress != 7) || (order.Progress == 6 && progress != 6) {
		if err = orderDoneOperation(orderID); err != nil {
			return err
		}
	}
	// 状态更新
	if order.Progress != progress {
		// 发送消息
		if err = sendMessage(order); err != nil {
			return err
		}
		// 更新progress
		raw := global.DB.Model(&model.Order{}).Where("order_id = ?", orderID).Update("progress", order.Progress)
		if raw.RowsAffected == 0 {
			return errors.New("操作失败")
		}
		return raw.Error
	}
	return nil
}

// ParseOrderAbort 解析OrderAbort事件
func ParseOrderAbort(transHash model.TransHash, Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeOrderMetaData.ABI))
	if err != nil {
		fmt.Println(err)
	}
	for _, vLog := range Logs {
		var orderAbort ABI.DeOrderOrderAbort
		ParseErr := contractAbi.UnpackIntoInterface(&orderAbort, "OrderAbort", vLog.Data)
		// parse success
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			fmt.Println("Transaction")
			orderId := vLog.Topics[1].Big().Int64()
			var order model.Order
			if err = tx.Model(&model.Order{}).Where("order_id =?", orderId).First(&order).Error; err != nil {
				tx.Rollback()
				return err
			}

			if err = message.Template("OrderStarted", utils.StructToMap([]any{order}), order.Issuer, order.Worker, orderAbort.Who.String()); err != nil {
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

// sendMessage 发送消息
func sendMessage(order ABI.Order) (err error) {
	if order.Progress == 7 {
		// 任务完成
		if err = message.Template("OrderDone", utils.StructToMap([]any{order}), order.Issuer.String(), order.Worker.String(), ""); err != nil {
			return err
		}
	} else if order.Progress == 4 {
		// 任务开始
		if err = message.Template("OrderStarted", utils.StructToMap([]any{order}), order.Issuer.String(), order.Worker.String(), ""); err != nil {
			return err
		}
	} else if order.Progress == 6 {
		// 任务中止
		if err = message.Template("OrderAbort", utils.StructToMap([]any{order}), order.Issuer.String(), order.Worker.String(), ""); err != nil {
			return err
		}
	}
	return nil
}

// orderDoneOperation 状态操作
func orderDoneOperation(orderID int64) (err error) {
	// 修改任务状态
	raw := global.DB.Model(&model.Order{}).Where("order_id = ?", orderID).Update("state", 1)
	if raw.RowsAffected == 0 {
		return errors.New("操作失败")
	}
	if err = saveOrderFlow(orderID); err != nil {
		return err
	}
	// 查询任务
	var order model.Order
	if err = global.DB.Model(&model.Order{}).Where("order_id =?", orderID).First(&order).Error; err != nil {
		return err
	}

	// 删除apply信息
	if err = global.DB.Model(&model.Apply{}).Unscoped().Where("task_id =? AND apply_addr = ?", order.TaskID, order.Worker).Delete(&model.Apply{}).Error; err != nil {
		return err
	}

	return raw.Error
}

// issuerAgreeOperation 状态操作
func issuerAgreeOperation(orderID int64) (err error) {
	// 清空签名 && 修改状态
	raw := global.DB.Model(&model.Order{}).Where("order_id = ?", orderID).Updates(map[string]interface{}{"signature": "", "sign_address": "", "sign_nonce": 0, "status": "IssuerAgreeStage"})
	if raw.RowsAffected == 0 {
		return errors.New("操作失败")
	}
	if err = saveOrderFlow(orderID); err != nil {
		return err
	}
	return raw.Error
}

func saveOrderFlow(orderID int64) (err error) {
	// 查询当前记录
	var order model.Order
	if err = global.DB.Model(&model.Order{}).Where("order_id = ?", orderID).First(&order).Error; err != nil {
		return err
	}
	// 查询level
	var level int64
	if err = global.DB.Model(&model.OrderFlow{}).Where("order_id = ?", order.OrderId).Count(&level).Error; err != nil {
		return err
	}
	// 插入日志表
	orderFlow := model.OrderFlow{OrderId: order.OrderId, Status: order.Status, Stages: order.Stages}
	orderFlow.Level = level + 1             // 节点
	orderFlow.Attachment = order.Attachment // JSON IPFS
	orderFlow.Operator = order.Issuer       // 甲方
	if err = global.DB.Model(&model.OrderFlow{}).Create(&orderFlow).Error; err != nil {
		return err
	}

	return nil
}
