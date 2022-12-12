package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"fmt"
)

// SetNftCache
// @function: SetNftCache
// @description: 创建NFT缓存
// @param:
// @return:
func SetNftCache(setnftCache request.SetNftCacheRequest) (err error) {
	db := global.DB.Model(&model.Nft{})
	if err = db.Model(&model.Nft{}).Create(&setnftCache.Nft).Error; err != nil {
		return err
	}
	return err
}

// GetNftCache
// @function: GetNftCache
// @description: 获取NFT缓存
// @param:
// @return:
func GetNftCache(getnftcache request.GetNftCacheRequest) (err error, list interface{}) {
	var nftList []model.Nft
	db := global.DB.Model(&model.Nft{})
	arr := []string{"erc721", "erc1155"}
	fmt.Println(arr)
	if err = db.Where("Account = ?", getnftcache.Account).Find(&nftList).Error; err != nil {
		return err, list
	}
	return err, nftList
}

// UpdateNftCache
// @function: UpdateNftCache
// @description: 修改NFT缓存
// @param:
// @return:
func UpdateNftCache(updatenftcache request.UpdateNftCacheRequest) (err error) {
	db := global.DB.Model(&model.Nft{})
	if err = db.Model(&model.User{}).Where("Account = ?", updatenftcache.Account).Updates(&updatenftcache.Nft).
		Error; err != nil {
		return err
	}
	return err
}
