package response

import "code-market-admin/internal/app/model"

type UserAvatarRespond struct {
	Address  string `gorm:"column:address" json:"address" form:"address"`
	Username string `gorm:"column:username" json:"username" form:"username"`
	Avatar   string `gorm:"column:avatar" json:"avatar" form:"avatar"`
}

type MsgListRespond struct {
	model.Message
	Avatar string `gorm:"avatar" json:"avatar" form:"avatar"` // 头像
}
