package model

type MessageTmpl struct {
	ID      uint   `gorm:"primarykey"`                                          // 主键ID
	Issuer  string `gorm:"issuer" json:"issuer" form:"issuer"`                  // 甲方模版
	Worker  string `gorm:"worker" json:"worker" form:"worker"`                  // 乙方模版
	Common  string `gorm:"common" json:"common" form:"common"`                  // 通用模版
	Status  string `gorm:"status" json:"status" form:"status"`                  // 事件状态
	Disable bool   `gorm:"disable;default:false" json:"disable" form:"disable"` // 是否禁用 0: 启用 1: 禁用
}
