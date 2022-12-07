package request

import (
	"code-market-admin/internal/app/model"
)

type GetSearchListRequest struct {
	model.Task
	PageInfo
	Role uint16 `gorm:"column:role" json:"role" form:"role"`
}
type CreateTaskRequest struct {
	model.Task
	Role []uint16 `gorm:"column:role" json:"role" form:"role"`
}
