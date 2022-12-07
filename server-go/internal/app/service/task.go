package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	_ "code-market-admin/internal/app/model/response"
	"gorm.io/gorm"
)

// GetTaskList
// @function: GetTaskList
// @description: 分页获取任务数据
// @param: task model.Tasks, info Req.PageInfo
// @return: err error, list interface{}, total int64
func GetTaskList(searchInfo request.GetSearchListRequest) (err error, list interface{}, total int64) {
	// SELECT * FROM tasks where position('${params}' in title) > 0
	var searchList []response.GetSearchListRespond
	var taskList []model.Task
	limit := searchInfo.PageSize
	offset := searchInfo.PageSize * (searchInfo.Page - 1)
	db := global.DB.Model(&model.Task{})
	// 项目状态: 0.不删  1.删除
	db = db.Where("del = 0")
	// 根据标题过滤
	if searchInfo.Title != "" {
		if err = db.Where("title ILIKE ?", "%"+searchInfo.Title+"%").Error; err != nil {
			return err, list, total
		}
	}
	// 根据Hash过滤
	if searchInfo.Hash != "" {
		if err = db.Where("hash ILIKE ?", "%"+searchInfo.Hash+"%").Error; err != nil {
			return err, list, total
		}
	} else {
		//报名开关: 0.关  1.开
		db = db.Where("apply_switch = 1")
	}
	// 根据技能要求过滤
	if searchInfo.Role != 0 {
		if err = db.Joins("JOIN task_role_relate ON task_role_relate.task_id=tasks.id "+
			"JOIN task_role ON task_role.id=task_role_relate.role_id").Where("task_role.role_num = ?", searchInfo.Role).Error; err != nil {
			return err, list, total
		}
	}
	err = db.Count(&total).Error
	if err != nil {
		return err, list, total
	} else {
		db = db.Limit(limit).Offset(offset)
		err = db.Order("create_time desc").Find(&taskList).Error
	}
	// 获取技能要求
	for _, t := range taskList {
		var search response.GetSearchListRespond
		if err := global.DB.Model(&model.TaskRole{}).Select("role_num").Joins("JOIN task_role_relate ON task_role_relate.role_id=task_role.id").Where("task_role_relate.task_id =?", t.ID).Find(&search.Role).Error; err != nil {
			if err != gorm.ErrRecordNotFound {
				return err, list, total
			}
		}
		search.Task = t
		searchList = append(searchList, search)
	}
	return err, searchList, total
}
