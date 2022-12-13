package request

import "code-market-admin/internal/app/model"

type GetOrderListRequest struct {
	model.Order
	PageInfo
}
type CreateOrderRequest struct {
	Hash string `gorm:"column:hash" json:"hash" form:"hash"`
	model.Order
}
