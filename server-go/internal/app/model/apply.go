package model

import (
	"time"
)

type Apply struct {
	ID         uint      `gorm:"column:id;primarykey" json:"id" form:"id"`
	ApplyAddr  string    `gorm:"column:apply_addr" json:"apply_addr" form:"apply_addr"`
	TaskId     uint      `gorm:"column:task_id" json:"task_id" form:"task_id"`
	Price      float64   `gorm:"column:price" json:"price" form:"price"`
	Sort       uint8     `gorm:"column:sort" json:"sort" form:"sort"` //排序: 0.底部  1.正常
	CreateTime time.Time `gorm:"column:create_time" json:"create_time" form:"create_time"`
	UpdateTime time.Time `gorm:"column:update_time" json:"update_time" form:"update_time"`
	SortTime   time.Time `gorm:"column:sort_time" json:"sort_time" form:"sort_time"`
}
