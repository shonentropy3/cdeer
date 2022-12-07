package response

import "code-market-admin/internal/app/model"

type GetSearchListRespond struct {
	model.Task
	Role []uint16 `gorm:"column:role" json:"role" form:"role"`
}
