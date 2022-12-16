package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitSystemRouter(Router *gin.RouterGroup) {
	systemRouter := Router.Group("system")
	{
		systemRouter.POST("getServerInfo", api.GetServerInfo)
	}
}
