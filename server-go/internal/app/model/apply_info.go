package model

import "time"

type ApplyInfo struct {
	Id         int       `gorm:"column:id" json:"id" form:"id"`
	ApplyAddr  string    `gorm:"column:apply_addr" json:"apply_addr" form:"apply_addr"`
	TaskId     int64     `gorm:"column:task_id" json:"task_id" form:"task_id"`
	Price      float64   `gorm:"column:price" json:"price" form:"price"`
	Sort       int16     `gorm:"column:sort" json:"sort" form:"sort"` //排序: 0.底部  1.正常
	Desc       string    `gorm:"column:desc" json:"desc" form:"desc"`
	CreateTime time.Time `gorm:"column:create_time" json:"create_time" form:"create_time"`
	UpdateTime time.Time `gorm:"column:update_time" json:"update_time" form:"update_time"`
}
