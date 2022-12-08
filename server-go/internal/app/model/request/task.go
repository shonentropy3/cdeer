package request

import (
	"code-market-admin/internal/app/model"
)

type GetSearchListRequest struct {
	model.Task
	PageInfo
}
type CreateTaskRequest struct {
	model.Task
}

type UpdatedTaskRequest struct {
	model.Task
}
type DeleteTaskRequest struct {
	ID uint `gorm:"column:id" json:"id" form:"id"`
}
