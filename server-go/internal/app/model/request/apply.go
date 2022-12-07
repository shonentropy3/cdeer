package request

import "code-market-admin/internal/app/model"

type GetApplyListRequest struct {
	model.Apply
	PageInfo
}
type GetOrderListRequest struct {
	model.Order
	PageInfo
}
