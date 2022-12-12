package model

import "code-market-admin/internal/app/global"

type Nft struct {
	global.MODEL
	Info    string `gorm:"column:info"  json:"info" form:"info"`
	Account string `gorm:"column:account"  json:"account" form:"account"`
	Chain   string `gorm:"column:chain" json:"chain" form:"chain"`
	ErcType string `gorm:"column:erc_type" json:"erc_type" form:"erc_type"`
}
