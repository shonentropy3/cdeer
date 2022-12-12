package service

import (
	"code-market-admin/internal/app/blockchain"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	"errors"
)

// GetApplyList
// @function: GetApplyList
// @description: 分页获取个⼈报名中的项⽬
// @param:
// @return:
func GetApplyList(searchInfo request.GetApplyListRequest) (err error, list interface{}, total int64) {
	var responses []response.GetApplyListRespond
	var applyList []model.Apply
	limit := searchInfo.PageSize
	offset := searchInfo.PageSize * (searchInfo.Page - 1)
	db := global.DB.Model(&model.Apply{})
	// 根据ApplyAddr过滤
	if searchInfo.ApplyAddr != "" {
		db = db.Where("apply_addr = ?", searchInfo.ApplyAddr)
	}
	// 根据TaskId过滤
	if searchInfo.TaskID != 0 {
		db = db.Where("task_id = ?", searchInfo.TaskID).Order("sort_time desc")
	}
	err = db.Count(&total).Error
	if err != nil {
		return err, list, total
	} else {
		db = db.Limit(limit).Offset(offset)
		err = db.Order("created_at desc").Find(&applyList).Error
	}
	// 根据如果有TaskId则直接返回
	if searchInfo.TaskID != 0 {
		return err, applyList, total
	}
	// 获取任务详情
	for _, apply := range applyList {
		var task model.Task

		if err = global.DB.Model(&model.Task{}).Where("task_id = ?", apply.TaskID).First(&task).Error; err != nil {
			return err, list, total
		}
		res := response.GetApplyListRespond{Apply: apply, Task: task}
		responses = append(responses, res)
	}
	return err, responses, total
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

	go blockchain.TraverseBlocks()
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
