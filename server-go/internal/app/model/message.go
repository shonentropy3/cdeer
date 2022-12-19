package model

import "code-market-admin/internal/app/global"

type Message struct {
	global.MODEL
	SendID  uint   `json:"send_id" form:"send_id"`                    // 发送者ID
	RecID   uint   `json:"rec_id" form:"rec_id"`                      // 接收者ID
	Message string `json:"message" form:"message"`                    // 站内信内容
	Url     string `json:"url" form:"url"`                            // 超链接
	Status  uint8  `gorm:"column:status" json:"status" form:"status"` // 站内信的查看状态 0: 未读 1已读
}
