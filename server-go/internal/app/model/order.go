package model

import "time"

type Order struct {
	ID          uint      `gorm:"column:id;primarykey" json:"id" form:"id"`
	OrderId     int64     `gorm:"column:order_id" json:"order_id" form:"order_id"`
	TaskId      int64     `gorm:"column:task_id" json:"task_id" form:"task_id"`
	Issuer      string    `gorm:"column:issuer" json:"issuer" form:"issuer"`
	Worker      string    `gorm:"column:worker" json:"worker" form:"worker"`
	Attachment  string    `gorm:"column:attachment" json:"attachment" form:"attachment"`
	Signature   string    `gorm:"column:signature" json:"signature" form:"signature"`
	SignAddress string    `gorm:"column:sign_address" json:"sign_address" form:"sign_address"`
	SignNonce   int64     `gorm:"column:sign_nonce" json:"sign_nonce" form:"sign_nonce"`
	Stages      string    `gorm:"column:stages" json:"stages" form:"stages"`
	CreateTime  time.Time `gorm:"column:create_time" json:"create_time" form:"create_time"`
	UpdateTime  time.Time `gorm:"column:update_time" json:"update_time" form:"update_time"`
}
