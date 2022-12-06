package request

import (
	"code-market-admin/internal/app/model"
)

type GetSearchListRequest struct {
	model.Tasks
	PageInfo
}
