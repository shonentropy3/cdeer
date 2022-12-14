package model

import (
	"code-market-admin/internal/app/global"
)

type TransHash struct {
	global.MODEL
	Hash      string `gorm:"column:hash;unique" json:"hash" form:"hash"` // 交易hash唯一
	EventName string `gorm:"column:event_name" json:"event_name"`
	SendAddr  string `gorm:"column:send_addr" json:"send_addr" form:"send_addr"`
	Raw       string `gorm:"column:raw" json:"raw" form:"raw"`
	TryTimes  uint16 `gorm:"column:try_times;default:0" json:"try_times" form:"try_times"` // 扫描次数
}
