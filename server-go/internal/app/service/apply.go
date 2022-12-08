package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"errors"
)

// GetApplyList
// @function: GetApplyList
// @description: 分页获取个⼈报名中的项⽬
// @param:
// @return:
func GetApplyList(searchInfo request.GetApplyListRequest) (err error, list interface{}, total int64) {
	var applyList []model.Apply
	limit := searchInfo.PageSize
	offset := searchInfo.PageSize * (searchInfo.Page - 1)
	db := global.DB.Model(&model.Apply{})
	// 根据ApplyAddr过滤
	if searchInfo.ApplyAddr != "" {
		db = db.Where("apply_addr = ?", searchInfo.ApplyAddr)
	}
	// 根据TaskId过滤
	if searchInfo.TaskId != 0 {
		db = db.Where("task_id = ?", searchInfo.TaskId).Order("sort_time desc")
	}
	err = db.Count(&total).Error
	if err != nil {
		return err, list, total
	} else {
		db = db.Limit(limit).Offset(offset)
		err = db.Order("create_time desc").Find(&applyList).Error
	}
	return err, applyList, total
}

// CreateApply
// @function: CreateApply
// @description: 添加报名信息
// @param: taskReq request.CreateTaskRequest
// @return: err error
func CreateApply(applyReq request.CreateApplyRequest) (err error) {
	// 开始事务
	tx := global.DB.Begin()
	result := tx.Model(&model.Task{}).Create(&applyReq.Apply)
	if result.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("添加失败")
	}

	return tx.Commit().Error
}

// UpdatedApply
// @function: UpdatedApply
// @description: 修改报名信息
// @param: applyReq request.UpdatedApplyRequest
// @return: err error
func UpdatedApply(applyReq request.UpdatedApplyRequest) (err error) {
	result := global.DB.Model(&model.Apply{}).Where("id = ?", applyReq.ID).Updates(&applyReq.Apply)
	if result.RowsAffected == 0 {
		return errors.New("修改失败")
	}
	return result.Error
}

// DeleteApply
// @function: DeleteApply
// @description: 删除报名信息
// @param: applyReq request.DeleteApplyRequest
// @return: err error
func DeleteApply(applyReq request.DeleteApplyRequest) (err error) {
	result := global.DB.Delete(&model.Apply{}, applyReq.ID)
	if result.RowsAffected == 0 {
		return errors.New("删除失败")
	}
	return result.Error
}
