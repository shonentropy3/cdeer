package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitCommonRouter(Router *gin.RouterGroup) {
	commonRouter := Router.Group("common")
	{
		commonRouter.POST("upload", api.Upload)           // 上传文件或JSON到IPFS
		commonRouter.POST("uploadImage", api.UploadImage) // 上传图片文件
	}
}
