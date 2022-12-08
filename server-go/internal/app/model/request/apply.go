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

type CreateApplyRequest struct {
	model.Apply
}

type UpdatedApplyRequest struct {
	model.Apply
}

type DeleteApplyRequest struct {
	model.Apply
}
