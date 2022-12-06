package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	Req "code-market-admin/internal/app/model/request"
)

// GetSearchList
// @function: GetSearchList
// @description: 分页获取任务数据
// @param: task model.Tasks, info Req.PageInfo
// @return: err error, list interface{}, total int64
func GetSearchList(task model.Tasks, info Req.PageInfo) (err error, list interface{}, total int64) {
	// SELECT * FROM tasks where position('${params}' in title) > 0
	var searchList []model.Tasks
	limit := info.PageSize
	offset := info.PageSize * (info.Page - 1)
	db := global.DB.Model(&model.Tasks{})
	if task.Title != "" {
		if err = db.Where("title ILIKE ?", "%"+task.Title+"%").Error; err != nil {
			return err, list, total
		}
	}
	err = db.Count(&total).Error
	if err != nil {
		return err, list, total
	} else {
		db = db.Limit(limit).Offset(offset)
		err = db.Order("create_time desc").Find(&searchList).Error
	}
	return err, searchList, total
}
