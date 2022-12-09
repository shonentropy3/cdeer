package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// HaveNft
// @Summary psql中是否有该账户nft缓存
// @accept application/json
// @Produce application/json
// @Router /task/HaveNft [post]
func HaveNft(c *gin.Context) {
	var havenft request.GetNftCacheRequest
	_ = c.ShouldBindQuery(&havenft)
	// 检验字段
	//if err := utils.Verify(setnftcache.Nft, utils.SetNftCacheVerify); err != nil {
	//	response.FailWithMessage(err.Error(), c)
	//	return
	//}
	if err, nftRes := service.GetNftCache(havenft); err != nil {
		global.LOG.Error("查询失败!", zap.Error(err))
		response.FailWithMessage("查询失败", c)
	} else if nftRes != "" {
		response.FailWithDetailed(nftRes, "查询有", c)
	} else {
		response.FailWithDetailed(nftRes, "查询无", c)
	}
}

// SetNftCache
// @Summary 创建NFT缓存
// @accept application/json
// @Produce application/json
// @Router /task/SetNftCache [post]
func SetNftCache(c *gin.Context) {
	var setnftcache request.SetNftCacheRequest
	_ = c.ShouldBindJSON(&setnftcache)
	// 检验字段
	//if err := utils.Verify(setnftcache.Nft, utils.SetNftCacheVerify); err != nil {
	//	response.FailWithMessage(err.Error(), c)
	//	return
	//}
	if err := service.SetNftCache(setnftcache); err != nil {
		global.LOG.Error("创建失败!", zap.Error(err))
		response.FailWithMessage("创建失败", c)
	} else {
		response.OkWithMessage("创建成功", c)
	}
}

// GetNftCache
// @Summary 获取NFT缓存
// @accept application/json
// @Produce application/json
// @Router /task/GetNftCache [get]
func GetNftCache(c *gin.Context) {
	var getnftcache request.GetNftCacheRequest
	_ = c.ShouldBindQuery(&getnftcache)
	// 检验字段
	//if err := utils.Verify(userInfo.User, utils.UserInfoVerify); err != nil {
	//	response.FailWithMessage(err.Error(), c)
	//	return
	//}
	if err, nftRes := service.GetNftCache(getnftcache); err != nil {
		global.LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
	} else {
		response.OkWithDetailed(nftRes, "获取成功", c)
	}
}

// UpdateUserInfo
// @Summary 修改NFT缓存
// @accept application/json
// @Produce application/json
// @Router /task/UpdateUserInfo [post]
func UpdateNftCache(c *gin.Context) {
	var updatenftcache request.UpdateNftCacheRequest
	_ = c.ShouldBindJSON(&updatenftcache)
	// 检验字段
	//if err := utils.Verify(updateuserInfo.User, utils.UpdateUserInfoVerify); err != nil {
	//	response.FailWithMessage(err.Error(), c)
	//	return
	//}
	if err := service.UpdateNftCache(updatenftcache); err != nil {
		global.LOG.Error("修改失败!", zap.Error(err))
		response.FailWithMessage("修改失败", c)
	} else {
		response.OkWithMessage("修改成功", c)
	}
}
