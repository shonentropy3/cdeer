package model

type Nfts struct {
	ID         int64  `gorm:"column:id" json:"id" form:"id"`
	Info       string `gorm:"column:info"  json:"info" form:"info"`
	Account    string `gorm:"column:account"  json:"account" form:"account"`
	Chain      string `gorm:"column:chain" json:"chain" form:"chain"`
	ErcType    string `gorm:"column:erc_type" json:"erc_type" form:"erc_type"`
	CreateTime int64  `gorm:"column:create_time" json:"create_time" form:"create_time"`
}
