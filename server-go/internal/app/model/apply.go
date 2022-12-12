package model

import (
	"code-market-admin/internal/app/global"
	"time"
)

type Apply struct {
	global.MODEL
	Hash      string    `gorm:"column:hash" json:"hash" form:"hash"`
	ApplyAddr string    `gorm:"column:apply_addr" json:"apply_addr" form:"apply_addr"`
	TaskID    uint64    `gorm:"column:task_id" json:"task_id" form:"task_id"`
	Price     string    `gorm:"column:price" json:"price" form:"price"`
	SortTime  time.Time `gorm:"column:sort_time" json:"sort_time" form:"sort_time"`
}
