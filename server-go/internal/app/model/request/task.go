package request

import (
	"code-market-admin/internal/app/model"
)

type GetSearchListRequest struct {
	model.Tasks
	PageInfo
	Role uint16 `gorm:"column:role" json:"role" form:"role"`
}
