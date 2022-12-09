package request

import (
	"code-market-admin/internal/app/model"
)

type GetTaskListRequest struct {
	model.Task
	PageInfo
}

type GetTaskDetailRequest struct {
	model.Task
}

type CreateTaskRequest struct {
	model.Task
}

type UpdatedTaskRequest struct {
	model.Task
}

type DeleteTaskRequest struct {
	model.Task
}
