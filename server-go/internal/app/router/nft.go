package router

import (
	"code-market-admin/internal/app/api"
	"code-market-admin/internal/app/middleware"
	"github.com/gin-gonic/gin"
)

func InitNftRouter(Router *gin.RouterGroup) {
	nftRouterWithAuth := Router.Group("nft").Use(middleware.JWTAuth())
	{
		nftRouterWithAuth.GET("getnftcache", api.GetNftCache)        // 获取NFTCache
		nftRouterWithAuth.POST("setnftcache", api.SetNftCache)       // 创建NFTCache
		nftRouterWithAuth.POST("updatenftcache", api.UpdateNftCache) // 修改NFTCache
		nftRouterWithAuth.GET("havenft", api.HaveNft)                // 数据库中是否有该账户nft缓存

		nftRouterWithAuth.POST("addCollection", api.AddCollection) // 添加NFT
	}
}
