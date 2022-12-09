package response

import "code-market-admin/internal/app/model"

type GetTaskListRespond struct {
	model.Task
	ApplyCount int64 `json:"apply_count" form:"apply_count"`
}
