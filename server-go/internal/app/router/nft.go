package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitNftRouter(Router *gin.RouterGroup) {
	nftRouter := Router.Group("nft")
	{
		nftRouter.GET("getnftcache", api.GetNftCache)        // 获取NFTCache
		nftRouter.POST("setnftcache", api.SetNftCache)       // 创建NFTCache
		nftRouter.POST("updatenftcache", api.UpdateNftCache) // 修改NFTCache
		nftRouter.GET("havenft", api.HaveNft)                // 数据库中是否有该账户nft缓存
	}
}
