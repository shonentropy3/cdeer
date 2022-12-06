package model

import "time"

type Orders struct {
	ID          int64     `gorm:"column:id" db:"column:id" json:"id" form:"id"`
	OrderId     int64     `gorm:"column:order_id" db:"column:order_id" json:"order_id" form:"order_id"`
	TaskId      int64     `gorm:"column:task_id" db:"column:task_id" json:"task_id" form:"task_id"`
	Issuer      string    `gorm:"column:issuer" db:"column:issuer" json:"issuer" form:"issuer"`
	Worker      string    `gorm:"column:worker" db:"column:worker" json:"worker" form:"worker"`
	Attachment  string    `gorm:"column:attachment" db:"column:attachment" json:"attachment" form:"attachment"`
	Signature   string    `gorm:"column:signature" db:"column:signature" json:"signature" form:"signature"`
	Signaddress string    `gorm:"column:signaddress" db:"column:signaddress" json:"signaddress" form:"signaddress"`
	Signnonce   int64     `gorm:"column:signnonce" db:"column:signnonce" json:"signnonce" form:"signnonce"`
	Stages      string    `gorm:"column:stages" db:"column:stages" json:"stages" form:"stages"`
	CreateTime  time.Time `gorm:"column:create_time" db:"column:create_time" json:"create_time" form:"create_time"`
	UpdateTime  time.Time `gorm:"column:update_time" db:"column:update_time" json:"update_time" form:"update_time"`
}
