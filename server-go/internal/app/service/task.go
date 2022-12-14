package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	_ "code-market-admin/internal/app/model/response"
	"encoding/json"
	"errors"
	"go.uber.org/zap"
)

// GetTaskList
// @function: GetTaskList
// @description: 分页获取需求数据
// @param: task model.Tasks, info Req.PageInfo
// @return: err error, list interface{}, total int64
func GetTaskList(searchInfo request.GetTaskListRequest) (err error, list interface{}, total int64) {
	var responses []response.GetTaskListRespond
	var taskList []model.Task
	limit := searchInfo.PageSize
	offset := searchInfo.PageSize * (searchInfo.Page - 1)
	db := global.DB.Model(&model.Task{})
	// 根据ID过滤
	if searchInfo.ID != 0 {
		db = db.Where("id = ?", searchInfo.ID)
	}
	// 根据链上TaskID过滤
	if searchInfo.TaskID != 0 {
		db = db.Where("task_id = ?", searchInfo.TaskID)
	}
	// 根据标题过滤
	if searchInfo.Title != "" {
		db = db.Where("title ILIKE ?", "%"+searchInfo.Title+"%")
	}
	// 根据创建者Hash过滤
	if searchInfo.Issuer != "" {
		db = db.Where("issuer = ?", searchInfo.Issuer)
	} else {
		//报名开关: 0.关  1.开  这里前端显示
		db = db.Where("apply_switch = 1")
	}
	//// 根据技能要求过滤
	//if searchInfo.Status != 0 {
	//	db = db.Where("status = ?", searchInfo.Status)
	//}
	// 根据技能要求过滤
	if searchInfo.Role != nil {
		db = db.Where("role && ?", searchInfo.Role)
	}
	err = db.Count(&total).Error
	if err != nil {
		return err, list, total
	} else {
		db = db.Limit(limit).Offset(offset)
		err = db.Order("created_at desc").Find(&taskList).Error
	}
	// 获取报名人数
	for _, task := range taskList {
		res := response.GetTaskListRespond{Task: task}
		if err = global.DB.Model(&model.Apply{}).Where("task_id = ?", task.TaskID).Count(&res.ApplyCount).Error; err != nil {
			global.LOG.Error("", zap.Error(err))
			return err, responses, total
		}
		responses = append(responses, res)
	}
	return err, responses, total
}

// CreateTask
// @function: CreateTask
// @description: 发布需求
// @param: taskReq request.CreateTaskRequest
// @return: err error
func CreateTask(taskReq request.CreateTaskRequest) (err error) {
	// 开始事务
	tx := global.DB.Begin()
	// 查找技能要求是否在列表中
	var roleList []int64
	for _, v := range taskReq.Role {
		roleList = append(roleList, v)
	}
	var count int64
	if err = tx.Model(&model.TaskRole{}).Where("role_num in ?", roleList).Count(&count).Error; err != nil {
		tx.Rollback()
		return errors.New("新建失败")
	}
	if int(count) != len(taskReq.Role) {
		tx.Rollback()
		return errors.New("新建失败")
	}
	// 保存请求数据
	raw, err := json.Marshal(taskReq)
	if err != nil {
		tx.Rollback()
		return errors.New("新建失败")
	}
	// 保存交易hash
	transHash := model.TransHash{SendAddr: taskReq.Issuer, EventName: "TaskCreated", Hash: taskReq.Hash, Raw: string(raw)}
	transHashRes := tx.Model(&model.TransHash{}).Create(&transHash)
	if transHashRes.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("新建失败")
	}
	return tx.Commit().Error
}

// UpdatedTask
// @function: UpdatedTask
// @description: 修改需求
// @param: task model.Tasks, info Req.PageInfo
// @return: err error, list interface{}, total int64
func UpdatedTask(taskReq request.UpdatedTaskRequest) (err error) {
	// 开始事务
	tx := global.DB.Begin()
	// 保存请求数据
	raw, err := json.Marshal(taskReq)
	if err != nil {
		tx.Rollback()
		return errors.New("新建失败")
	}
	// 保存交易hash
	transHash := model.TransHash{SendAddr: taskReq.Issuer, EventName: "TaskModified", Hash: taskReq.Hash, Raw: string(raw)}
	transHashRes := tx.Model(&model.TransHash{}).Create(&transHash)
	if transHashRes.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("修改失败")
	}
	return tx.Commit().Error
}

// DeleteTask
// @function: DeleteTask
// @description: 删除需求
// @param: task model.Tasks, info Req.PageInfo
// @return: err error, list interface{}, total int64
func DeleteTask(taskReq request.DeleteTaskRequest) (err error) {
	// 开始事务
	tx := global.DB.Begin()
	// 保存交易hash
	transHash := model.TransHash{SendAddr: taskReq.Issuer, EventName: "TaskDisabled", Hash: taskReq.Hash}
	transHashRes := tx.Model(&model.TransHash{}).Create(&transHash)
	if transHashRes.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("删除失败")
	}
	return nil
}

// TODO:modifyApplySwitch 修改报名开关
func ModifyApplySwitch(req request.ModifyApplySwitchRequest) (err error) {
	// TODO:校验是否本人操作
	res := global.DB.Model(&model.Task{}).Where("task_id", req.TaskID).Update("apply_switch", req.ApplySwitch)
	if res.RowsAffected == 0 {
		return errors.New("操作失败")
	}
	return res.Error
}
