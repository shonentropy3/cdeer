package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	"encoding/json"
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
		err = db.Where("status = 0").Order("created_at desc").Preload("User").Find(&applyList).Error
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
	if searchInfo.ApplyAddr != "" {
		db = db.Where("apply_addr = ?", searchInfo.ApplyAddr)
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
func CreateApply(applyReq request.CreateApplyRequest, address string) (err error) {
	// 保存请求数据
	raw, err := json.Marshal(applyReq)
	if err != nil {
		return errors.New("新建失败")
	}
	// 保存交易hash
	transHash := model.TransHash{SendAddr: address, EventName: "ApplyFor", Hash: applyReq.Hash, Raw: string(raw)}
	if err = SaveHash(transHash); err != nil {
		return errors.New("新建失败")
	}
	return nil
}

// UpdatedApply
// @function: UpdatedApply
// @description: 修改报名信息
// @param: applyReq request.UpdatedApplyRequest
// @return: err error
func UpdatedApply(applyReq request.UpdatedApplyRequest, address string) (err error) {
	// 保存请求数据
	raw, err := json.Marshal(applyReq)
	if err != nil {
		return errors.New("新建失败")
	}
	// 保存交易hash
	transHash := model.TransHash{SendAddr: address, EventName: "ApplyFor", Hash: applyReq.Hash, Raw: string(raw)}
	if err = SaveHash(transHash); err != nil {
		return errors.New("新建失败")
	}
	return nil
}

// DeleteApply
// @function: DeleteApply
// @description: 删除报名信息
// @param: applyReq request.DeleteApplyRequest
// @return: err error
func DeleteApply(hash string, address string) (err error) {
	// 保存交易hash
	transHash := model.TransHash{SendAddr: address, EventName: "CancelApply", Hash: hash}
	if err = SaveHash(transHash); err != nil {
		return errors.New("新建失败")
	}
	return nil
}

// UpdatedApplySort
// @function: UpdatedApplySort
// @description: 更新报名列表排序
// @param: taskReq request.CreateTaskRequest
// @return: err error
func UpdatedApplySort(sortReq request.UpdatedApplySortRequest) (err error) {
	db := global.DB.Model(&model.Apply{})
	raw := db.Where("task_id = ?", sortReq.TaskID).Where("apply_addr = ?", sortReq.ApplyAddr).Update("sort_time", time.Now())
	if raw.RowsAffected == 0 {
		return errors.New("设置失败")
	}
	return raw.Error
}
