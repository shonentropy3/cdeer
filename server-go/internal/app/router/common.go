package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitCommonRouter(Router *gin.RouterGroup) {
	commonRouter := Router.Group("common")
	{
		commonRouter.POST("upload", api.Upload) // 上传en
	}
}
