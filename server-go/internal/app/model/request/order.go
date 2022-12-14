package request

import "code-market-admin/internal/app/model"

type GetOrderListRequest struct {
	model.Order
	PageInfo
}
type CreateOrderRequest struct {
	model.Order
}

type UpdatedStageRequest struct {
	model.Order
	Obj string `json:"obj" form:"obj"`
}
