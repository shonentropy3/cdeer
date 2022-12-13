package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	"errors"
	"time"
)

// GetApplyList
// @function: GetApplyList
// @description: 获取需求里报名详情
// @param:
// @return:
func GetApplyList(searchInfo request.GetApplyListRequest) (err error, list interface{}, total int64) {
	var applyList []response.GetApplyListRespond
	limit := searchInfo.PageSize
	offset := searchInfo.PageSize * (searchInfo.Page - 1)
	db := global.DB.Model(&model.Apply{})
	// 根据TaskId过滤
	if searchInfo.TaskID != 0 {
		db = db.Where("task_id = ?", searchInfo.TaskID).Order("sort_time desc")
	}
	err = db.Count(&total).Error
	if err != nil {
		return err, list, total
	} else {
		db = db.Limit(limit).Offset(offset)
		err = db.Order("created_at desc").Preload("User").Find(&applyList).Error
	}
	return err, applyList, total
}

// GetApply
// @function: GetApply
// @description: 分页获取个⼈报名中的项⽬
// @param:
// @return:
func GetApply(searchInfo request.GetApplyRequest) (err error, list interface{}, total int64) {
	var applyList []response.GetApplyRespond
	limit := searchInfo.PageSize
	offset := searchInfo.PageSize * (searchInfo.Page - 1)
	db := global.DB.Model(&model.Apply{})
	// 根据报名人地址过滤
	if searchInfo.TaskID != 0 {
		db = db.Where("task_id = ?", searchInfo.TaskID)
	}
	err = db.Count(&total).Error
	if err != nil {
		return err, list, total
	} else {
		db = db.Limit(limit).Offset(offset)
		err = db.Order("created_at desc").Preload("Task").Find(&applyList).Error
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
	result := tx.Model(&model.Apply{}).Create(&applyReq.Apply)
	if result.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("添加失败")
	}
	// 保存交易hash
	transHash := model.TransHash{SendAddr: applyReq.ApplyAddr, EventName: "ApplyFor", Hash: applyReq.Hash}
	transHashRes := tx.Model(&model.TransHash{}).Create(&transHash)
	if transHashRes.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("新建失败")
	}
	return tx.Commit().Error
}

// UpdatedApply
// @function: UpdatedApply
// @description: 修改报名信息
// @param: applyReq request.UpdatedApplyRequest
// @return: err error
func UpdatedApply(applyReq request.UpdatedApplyRequest) (err error) {
	result := global.DB.Model(&model.Apply{}).Where("apply_addr = ?", applyReq.ApplyAddr).Where("task_id = ?", applyReq.TaskID).Updates(&applyReq.Apply)
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

// UpdatedApplySort
// @function: UpdatedApplySort
// @description: 更新报名列表排序
// @param: taskReq request.CreateTaskRequest
// @return: err error
func UpdatedApplySort(sortReq request.UpdatedApplySortRequest) (err error) {
	db := global.DB.Model(&model.Apply{})
	err = db.Where("task_id = ?", sortReq.TaskID).Where("apply_addr = ?", sortReq.ApplyAddr).Update("sort_time", time.Now()).Error
	return err
}
