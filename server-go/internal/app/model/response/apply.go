package response

import "code-market-admin/internal/app/model"

type GetApplyListRespond struct {
	model.Apply
	User model.User `json:"user" form:"user" gorm:"foreignKey:Address;references:ApplyAddr"`
}

type GetApplyRespond struct {
	model.Apply
	Task model.Task `json:"task" form:"task" gorm:"foreignKey:TaskID;references:TaskID"`
}
