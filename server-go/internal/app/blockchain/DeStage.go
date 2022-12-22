package blockchain

import (
	ABI "code-market-admin/abi"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/core/types"
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
		err = parseAppendStage(Logs)
		return true, err
	case "ProlongStage":
		err = parseProlongStage(Logs)
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
func parseAppendStage(Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeStageMetaData.ABI))
	if err != nil {
		return err
	}
	for _, vLog := range Logs {
		var appendStage ABI.DeStageAppendStage
		ParseErr := contractAbi.UnpackIntoInterface(&appendStage, "AppendStage", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			orderID := vLog.Topics[1].Big().Uint64()
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
func parseProlongStage(Logs []*types.Log) (err error) {
	contractAbi, err := abi.JSON(strings.NewReader(ABI.DeStageMetaData.ABI))
	if err != nil {
		return err
	}
	for _, vLog := range Logs {
		var prolongStage ABI.DeStageProlongStage
		ParseErr := contractAbi.UnpackIntoInterface(&prolongStage, "ProlongStage", vLog.Data)
		// 解析成功
		if ParseErr == nil {
			// 开始事务
			tx := global.DB.Begin()
			// 更新数据
			orderID := vLog.Topics[1].Big().Uint64()
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
