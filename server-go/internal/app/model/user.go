package model

import (
	"code-market-admin/internal/app/global"
	"github.com/lib/pq"
)

type User struct {
	global.MODEL
	Address  string        `gorm:"column:address;UNIQUE" json:"address" form:"address"`
	Username *string       `gorm:"column:username" json:"username" form:"username"`
	Avatar   *string       `gorm:"column:avatar" json:"avatar" form:"avatar"`
	Telegram *string       `gorm:"column:telegram" json:"telegram" form:"telegram"`
	Wechat   *string       `gorm:"column:wechat" json:"wechat" form:"wechat"`
	Skype    *string       `gorm:"column:skype" json:"skype" form:"skype"`
	Discord  *string       `gorm:"column:discord" json:"discord" form:"discord"`
	Phone    *string       `gorm:"column:phone" json:"phone" form:"phone"`
	Role     pq.Int64Array `gorm:"column:role;type:integer[];default:'{}'" json:"role" form:"role"` // 所需技能
}
