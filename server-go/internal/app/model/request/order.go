package request

import "code-market-admin/internal/app/model"

type GetOrderListRequest struct {
	model.Order
	PageInfo
}
