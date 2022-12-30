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
	"github.com/tidwall/gjson"
	"strings"
)

func DeStage(transHash model.TransHash, Logs []*types.Log) (haveBool bool, err error) {
	switch transHash.EventName {
	case "ConfirmOrderStage":
		err = parseConfirmOrderStage(Logs)
		return true, err
	case "SetStage":
		err = parseSetStage(Logs)
		return true, err
	case "AppendStage":
		err = parseAppendStage(transHash, Logs)
		return true, err
	case "ProlongStage":
		err = parseProlongStage(transHash, Logs)
		return true, err

	}
	return false, nil
}

// ParseConfirmOrderStage 解析ConfirmOrderStage事件
func parseConfirmOrderStage(Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeStageMetaData.ABI))
	if err != nil {
		fmt.Println(err)
	}
	for _, vLog := range Logs {
		var confirmOrderStage ABI.DeStageConfirmOrderStage
		ParseErr := contractAbi.UnpackIntoInterface(&confirmOrderStage, "ConfirmOrderStage", vLog.Data)
		// parse success
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// TODO:
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

// parseSetStage 解析SetStage事件
func parseSetStage(Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeStageMetaData.ABI))
	if err != nil {
		return err
	}
	for _, vLog := range Logs {
		var setStage ABI.DeStageSetStage
		ParseErr := contractAbi.UnpackIntoInterface(&setStage, "SetStage", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			orderID := vLog.Topics[1].Big().Uint64()
			err = global.DB.Model(&model.OrderFlow{}).Where("order_id = ? AND audit = 0", orderID).Update("audit", 1).Error
			if err != nil {
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

// parseAppendStage 解析AppendStage事件
func parseAppendStage(transHash model.TransHash, Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeStageMetaData.ABI))
	if err != nil {
		return err
	}
	for _, vLog := range Logs {
		var appendStage ABI.DeStageAppendStage
		ParseErr := contractAbi.UnpackIntoInterface(&appendStage, "AppendStage", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			if contractAbi.Events["AppendStage"].ID != vLog.Topics[0] {
				continue
			}
			orderID := vLog.Topics[1].Big().Uint64()
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			err = tx.Model(&model.OrderFlow{}).Where("order_id = ? AND audit = 0 AND del = 0", orderID).Update("audit", 1).Error
			if err != nil {
				tx.Rollback()
				return err
			}
			// 保存order日志 && 将Order状态改变
			if err = issuerAgreeOperation(int64(orderID)); err != nil {
				return err
			}
			// 发送消息
			if err = sendMessage(orderID, "AgreeAppend", transHash.SendAddr, nil); err != nil {
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

// parseProlongStage 解析ProlongStage事件
func parseProlongStage(transHash model.TransHash, Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeStageMetaData.ABI))
	if err != nil {
		return err
	}
	for _, vLog := range Logs {
		var prolongStage ABI.DeStageProlongStage
		ParseErr := contractAbi.UnpackIntoInterface(&prolongStage, "ProlongStage", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			if contractAbi.Events["ProlongStage"].ID != vLog.Topics[0] {
				continue
			}
			orderID := vLog.Topics[1].Big().Uint64()
			// 保存order日志
			if err = issuerAgreeOperation(int64(orderID)); err != nil {
				return err
			}
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			err = tx.Model(&model.OrderFlow{}).Where("order_id = ? AND audit = 0 AND del = 0", orderID).Update("audit", 1).Error
			if err != nil {
				tx.Rollback()
				return err
			}
			// 任务状态改变
			err = tx.Model(&model.Order{}).Where("order_id = ?", orderID).Update("status", "IssuerAgreeStage").Error
			if err != nil {
				tx.Rollback()
				return err
			}
			// 发送消息
			type StageData struct {
				Stage string `json:"stage"`
			}
			if err = sendMessage(orderID, "AgreeProlong", transHash.SendAddr, StageData{Stage: "P" + prolongStage.StageIndex.String()}); err != nil {
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

// sendMessage 发送消息
func sendMessage(orderID uint64, status string, sender string, inter any) (err error) {
	// Order信息
	var order model.Order
	if err = global.DB.Model(&model.Order{}).Where("order_id = ?", orderID).First(&order).Error; err != nil {
		return err
	}
	if status == "AgreeAppend" {
		// 查询日志记录
		var orderFlowTop model.OrderFlow
		if err = global.DB.Model(&model.OrderFlow{}).Where("order_id = ? AND del = 0", orderID).Order("level desc").First(&orderFlowTop).Error; err != nil {
			return err
		}
		stagesNew := gjson.Get(orderFlowTop.Obj, "stages.#.milestone.title")
		type StageData struct {
			StageName string `json:"stage_name"`
		}
		stageName := stagesNew.Array()[len(stagesNew.Array())-1].String()
		inter = StageData{StageName: stageName}
	}
	// Task信息
	var task model.Task
	if err = global.DB.Model(&model.Task{}).Where("task_id = ?", order.TaskID).First(&task).Error; err != nil {
		return err
	}
	if err = message.Template(status, utils.StructToMap([]any{order, task, inter}), order.Issuer, order.Worker, sender); err != nil {
		return err
	}
	return nil
}
