package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitTaskRouter(Router *gin.RouterGroup) {
	taskRouter := Router.Group("task")
	{
		taskRouter.GET("getSearchList", api.GetTaskList) // 获取项目列表
	}
}
