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
	Hash string `gorm:"hash" json:"hash" form:"hash"` // 交易hash
}

type UpdatedApplyRequest struct {
	model.Apply
	Hash string `gorm:"hash" json:"hash" form:"hash"` // 交易hash
}

type UpdatedApplySortRequest struct {
	model.Apply
}

type DeleteApplyRequest struct {
	Hash string `gorm:"hash" json:"hash" form:"hash"` // 交易hash
}
