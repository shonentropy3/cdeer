package response

import "code-market-admin/internal/app/model"

type GetOrderListResponse struct {
	model.Order
	Task model.Task `json:"task" form:"task" gorm:"foreignKey:TaskID;references:TaskID"`
}
