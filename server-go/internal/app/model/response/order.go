package response

import "code-market-admin/internal/app/model"

type GetOrderListResponse struct {
	model.Order
	Task          model.Task `json:"task" form:"task" gorm:"foreignKey:TaskID;references:TaskID"`
	StageJson     string     `json:"stage_json" form:"stage_json" gorm:"-"`
	LastStageJson string     `json:"last_stage_json" form:"last_stage_json" gorm:"-"`
	LastStages    string     `json:"last_stages" form:"last_stages" gorm:"-"`
}
