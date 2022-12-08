package model

import (
	"code-market-admin/internal/app/global"
)

type TransHash struct {
	global.MODEL
	Hash     string `gorm:"column:hash" json:"hash" form:"hash"`
	TaskId   int64  `gorm:"column:task_id" json:"task_id" form:"task_id"`
	Category int16  `gorm:"column:category" json:"category" form:"category"` //交易hash种类: 1.创建需求  2.修改需求  3.报名  4.修改报名  5.删除报名 6.创建订单以及修改订单
	SendAddr string `gorm:"column:send_addr" json:"send_addr" form:"send_addr"`
	IsUpdate int16  `gorm:"column:is_update" json:"is_update" form:"is_update"` //是否同步链上数据: 0.未同步  1.已经同步
}
