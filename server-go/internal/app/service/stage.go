package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"errors"
)

// CreatedStage
// @function: CreatedStage
// @description: 创建阶段划分
// @param:
// @return:
func CreatedStage(stage request.CreatedStageRequest) (err error) {
	err, hashJSON := UploadJSON(stage.Obj)
	if err != nil {
		return err
	}
	stage.Attachment = hashJSON
	// 更新数据
	raw := global.DB.Model(&model.Order{}).Where("order_id = ?", stage.OrderId).Updates(&stage.Order)
	if raw.RowsAffected == 0 {
		return errors.New("创建失败")
	}
	return raw.Error
}
