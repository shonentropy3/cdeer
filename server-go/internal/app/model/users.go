package model

import "time"

type Users struct {
	Id       int       `gorm:"column:id" json:"id" form:"id"`
	Address  string    `gorm:"column:address" json:"address" form:"address"`
	Username string    `gorm:"column:username" json:"username" form:"username"`
	Avatar   string    `gorm:"column:avatar" json:"avatar" form:"avatar"`
	Telegram string    `gorm:"column:telegram" json:"telegram" form:"telegram"`
	Wechat   string    `gorm:"column:wechat" json:"wechat" form:"wechat"`
	Skype    string    `gorm:"column:skype" json:"skype" form:"skype"`
	Discord  string    `gorm:"column:discord" json:"discord" form:"discord"`
	Phone    string    `gorm:"column:phone" json:"phone" form:"phone"`
	Role     string    `gorm:"column:role" json:"role" form:"role"`
	Date     time.Time `gorm:"column:date" json:"date" form:"date"`
	Update   time.Time `gorm:"column:update" json:"update" form:"update"`
}
