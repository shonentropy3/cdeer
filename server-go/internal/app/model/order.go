package model

import (
	"code-market-admin/internal/app/global"
)

type Order struct {
	global.MODEL
	Hash        string `gorm:"column:hash" json:"hash" form:"hash"`
	OrderId     int64  `gorm:"column:order_id;unique" json:"order_id" form:"order_id"`
	TaskID      int64  `gorm:"column:task_id" json:"task_id" form:"task_id"`
	Issuer      string `gorm:"column:issuer" json:"issuer" form:"issuer"`
	Worker      string `gorm:"column:worker" json:"worker" form:"worker"`
	Attachment  string `gorm:"column:attachment" json:"attachment" form:"attachment"`
	Signature   string `gorm:"column:signature" json:"signature" form:"signature"`
	SignAddress string `gorm:"column:sign_address" json:"sign_address" form:"sign_address"`
	SignNonce   int64  `gorm:"column:sign_nonce" json:"sign_nonce" form:"sign_nonce"`
	Currency    string `gorm:"column:currency;size:30" json:"currency" form:"currency"` // 币种
	Stages      string `gorm:"column:stages" json:"stages" form:"stages"`               // 阶段JSON
	State       uint8  `gorm:"column:state;default:0" json:"state" form:"state"`        // 任务状态 0:进行中 1: 已完成
	Progress    uint   `gorm:"column:progress" json:"progress" form:"progress"`         // 阶段
	Status      string `gorm:"column:status" json:"status" form:"status"`               // 事件状态 10：
}
