package request

import "code-market-admin/internal/app/model"

type CreatedStageRequest struct {
	model.Order
	Obj string `json:"obj" form:"obj"`
}
