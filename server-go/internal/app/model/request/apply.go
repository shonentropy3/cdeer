package request

import "code-market-admin/internal/app/model"

type GetApplyListRequest struct {
	model.Apply
	PageInfo
}
type GetApplyRequest struct {
	model.Apply
	PageInfo
}
type CreateApplyRequest struct {
	model.Apply
}

type UpdatedApplyRequest struct {
	model.Apply
}

type UpdatedApplySortRequest struct {
	model.Apply
}

type DeleteApplyRequest struct {
	model.Apply
}
