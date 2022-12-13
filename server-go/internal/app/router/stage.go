package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitStageRouter(Router *gin.RouterGroup) {
	signRouter := Router.Group("stage")
	{
		signRouter.POST("createdStage", api.CreatedStage) // 创建阶段划分
	}
}
