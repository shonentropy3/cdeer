package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"fmt"
	"github.com/tidwall/gjson"
	"io"
	"net/http"
	"time"
)

// GetNftCollection
// @description: 获取NFT收藏
// @param:
// @return:
func GetNftCollection() {

}

// GetList
// @description: 获取NFT列表
// @param:
// @return:
func GetList() {

}

// AddCollection 添加NFT
func AddCollection(nftContract model.NftContract, address string) (err error) {
	apiMap := map[string]string{"eth": "restapi", "bnb": "bnbapi", "polygon": "polygonapi", "moonbeam": "moonbeamapi",
		"arbitrum": "arbitrumapi", "optimism": "optimismapi", "platon": "platonapi", "avalanche": "avaxapi", "cronos": "cronosapi", "solana": "solanaapi"}
	// 获取合约信息
	assetsUrl := fmt.Sprintf("https://%s.nftscan.com/api/v2/account/own/%s?limit=1", apiMap[nftContract.Chain], nftContract.Address)
	res, err := nftScanRequest(assetsUrl)
	if err != nil {
		fmt.Println(err)
		return
	}
	nftContract.Account = address
	nftContract.Amount = gjson.Get(res, "msg.data.total").Uint()
	nftContract.Name = gjson.Get(res, "msg.data.contract_name").String() // 合约名称
	nftContract.Logo = fmt.Sprintf("https://logo.nftscan.com/logo/%s.png", nftContract.Address)
	nftContract.ErcType = gjson.Get(res, "msg.data.erc_type").String() // 合约名称
	// 保存数据
	if err = global.DB.Model(&model.NftContract{}).Create(&nftContract).Error; err != nil {
		return err
	}
	return nil
}

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

// nftScanRequest
func nftScanRequest(url string) (res string, err error) {
	tryTimes := 3 // 重试次数
	for i := 0; i < tryTimes; i++ {
		fmt.Println(i)
		// 超时时间：60秒
		client := &http.Client{Timeout: time.Second * 60}
		req, errReq := http.NewRequest("GET", url, nil)
		req.Header.Set("X-API-KEY", "Ovzh6fBZ")
		if errReq != nil {
			err = errReq
			continue
		}
		resp, errReq := client.Do(req)
		if errReq != nil {
			err = errReq
			continue
		}
		result, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		if !gjson.Valid(string(result)) {
			continue
		}
		return string(result), nil
	}
	return "", err
}
