package model

import "code-market-admin/internal/app/global"

type Upload struct {
	global.MODEL
	Name string `json:"name" gorm:"size:50;comment:文件名"`     // 文件名
	Url  string `json:"url" gorm:"size:2047;comment:文件地址"`   // 文件地址
	Key  string `json:"key" gorm:"type:char(36);comment:编号"` // 编号
}
