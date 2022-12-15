package router

import (
	"code-market-admin/internal/app/api"
	"code-market-admin/internal/app/middleware"
	"github.com/gin-gonic/gin"
)

func InitCommonRouter(Router *gin.RouterGroup) {
	commonRouterWithAuth := Router.Group("common").Use(middleware.JWTAuth())
	{
		commonRouterWithAuth.POST("upload", api.Upload)           // 上传文件或JSON到IPFS
		commonRouterWithAuth.POST("uploadImage", api.UploadImage) // 上传图片文件
	}
}
