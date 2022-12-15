package request

import (
	"code-market-admin/internal/app/model"
)

type GetTaskListRequest struct {
	model.Task
	PageInfo
}

type GetTaskDetailRequest struct {
	model.Task
}

type CreateTaskRequest struct {
	Hash string `gorm:"hash" json:"hash" form:"hash"` // 交易hash
	model.Task
}

type UpdatedTaskRequest struct {
	Hash string `gorm:"hash" json:"hash" form:"hash"` // 交易hash
	model.Task
}

type DeleteTaskRequest struct {
	model.Task
}
type ModifyApplySwitchRequest struct {
	TaskID      uint64 `gorm:"column:task_id" json:"task_id" json:"task_id"` // 链上任务ID
	ApplySwitch uint8  `json:"apply_switch" form:"apply_switch"`             // 报名开关: 0.关  1.开
}
