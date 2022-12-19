package model

import (
	"code-market-admin/internal/app/global"
	"github.com/lib/pq"
)

type Task struct {
	global.MODEL
	TaskID      uint64        `gorm:"column:task_id;unique" json:"task_id" form:"task_id"`     // 链上任务ID，唯一值
	Issuer      string        `gorm:"column:issuer;type:char(42)" json:"issuer" form:"issuer"` // 发布人hash
	Title       string        `gorm:"size:255;column:title" json:"title" form:"title"`         // 标题
	Desc        string        `gorm:"size:2047;column:desc" json:"desc" form:"desc"`           // 描述
	Period      uint32        `gorm:"column:period" json:"period" form:"period"`               // 预计周期
	Budget      string        `gorm:"column:budget" json:"budget" form:"budget"`               // 预计金额
	Role        pq.Int64Array `gorm:"column:role;type:integer[]" json:"role" form:"role"`      // 所需技能
	Attachment  string        `gorm:"column:attachment" json:"attachment" form:"attachment"`
	Currency    string        `gorm:"column:currency;size:30" json:"currency" form:"currency"`               // 币种
	ApplySwitch uint8         `gorm:"column:apply_switch;default:1" json:"apply_switch" form:"apply_switch"` //报名开关: 0.关  1.开
	Suffix      string        `gorm:"column:suffix" json:"suffix" form:"suffix"`                             // 附件后缀名
}
