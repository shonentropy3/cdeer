package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
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
