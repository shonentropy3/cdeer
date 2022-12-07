package model

import "time"

type Task struct {
	ID          uint      `gorm:"column:id" json:"id" form:"id"`
	Issuer      string    `gorm:"column:issuer" json:"issuer" form:"issuer"`
	Hash        string    `gorm:"column:hash" json:"hash" form:"hash"`
	Title       string    `gorm:"size:255;column:title" json:"title" form:"title"`
	Desc        string    `gorm:"size:2047;column:desc" json:"desc" form:"desc"`
	Period      int64     `gorm:"column:period" json:"period" form:"period"`
	Budget      string    `gorm:"column:budget" json:"budget" form:"budget"`
	Attachment  string    `gorm:"column:attachment" json:"attachment" form:"attachment"`
	ApplySwitch int16     `gorm:"column:apply_switch" json:"apply_switch" form:"apply_switch"` //报名开关: 0.关  1.开
	Del         int16     `gorm:"column:del" json:"del" form:"del"`                            //项目状态: 0.不删  1.删除
	Suffix      string    `gorm:"column:suffix" json:"suffix" form:"suffix"`
	CreateTime  time.Time `gorm:"column:create_time" json:"create_time" form:"create_time"`
	UpdateTime  time.Time `gorm:"column:update_time" json:"update_time" form:"update_time"`
}
