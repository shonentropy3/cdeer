package model

import (
	"code-market-admin/internal/app/global"
)

type Order struct {
	global.MODEL
	OrderId     int64  `gorm:"column:order_id" json:"order_id" form:"order_id"`
	TaskId      int64  `gorm:"column:task_id" json:"task_id" form:"task_id"`
	Issuer      string `gorm:"column:issuer" json:"issuer" form:"issuer"`
	Worker      string `gorm:"column:worker" json:"worker" form:"worker"`
	Attachment  string `gorm:"column:attachment" json:"attachment" form:"attachment"`
	Signature   string `gorm:"column:signature" json:"signature" form:"signature"`
	SignAddress string `gorm:"column:sign_address" json:"sign_address" form:"sign_address"`
	SignNonce   int64  `gorm:"column:sign_nonce" json:"sign_nonce" form:"sign_nonce"`
	Stages      string `gorm:"column:stages" json:"stages" form:"stages"`
}
