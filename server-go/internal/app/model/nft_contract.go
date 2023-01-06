package model

import "code-market-admin/internal/app/global"

type NftContract struct {
	global.MODEL
	Address      string `gorm:"column:address"  json:"address" form:"address"`                  // 合约地址
	Name         string `gorm:"column:name" json:"name" form:"name"`                            // 合约名称
	Logo         string `gorm:"column:logo" json:"logo" form:"logo"`                            // 合约Logo
	Account      string `gorm:"column:account"  json:"account" form:"account"`                  // 持有人
	Amount       uint64 `gorm:"column:amount" json:"amount" form:"amount"`                      // 持有数量
	Chain        string `gorm:"column:chain" json:"chain" form:"chain"`                         // 区块链的简称（eth, bnb, polygon, moonbeam, arbitrum, optimism, platon, avalanche, cronos）
	ErcType      string `gorm:"column:erc_type" json:"erc_type" form:"erc_type"`                // NFT 的 erc 标准类型（erc721 或 erc1155）
	ExternalLink string `gorm:"column:external_link" json:"external_link" form:"external_link"` // NFT对应的网站链接
}
