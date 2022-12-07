package model

import (
	"gorm.io/gorm"
	"time"
)

type Task struct {
	ID          uint           `gorm:"column:id" json:"id" form:"id"`
	CreatedAt   time.Time      // 创建时间
	UpdatedAt   time.Time      // 更新时间
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`                                  // 删除时间
	Issuer      string         `gorm:"column:issuer" json:"issuer" form:"issuer"`       // 发布人hash
	Hash        string         `gorm:"column:hash" json:"hash" form:"hash"`             // 交易hash
	Title       string         `gorm:"size:255;column:title" json:"title" form:"title"` // 标题
	Desc        string         `gorm:"size:2047;column:desc" json:"desc" form:"desc"`   // 描述
	Period      int64          `gorm:"column:period" json:"period" form:"period"`       // 预计周期
	Budget      string         `gorm:"column:budget" json:"budget" form:"budget"`       // 预计金额
	Attachment  string         `gorm:"column:attachment" json:"attachment" form:"attachment"`
	Currency    string         `gorm:"column:currency:size:30" json:"currency" form:"currency"`     // 币种
	ApplySwitch uint8          `gorm:"column:apply_switch" json:"apply_switch" form:"apply_switch"` //报名开关: 0.关  1.开
	Suffix      string         `gorm:"column:suffix" json:"suffix" form:"suffix"`                   // 附件后缀名
}
