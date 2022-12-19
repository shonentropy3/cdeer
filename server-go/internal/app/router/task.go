package router

import (
	"code-market-admin/internal/app/api"
	"code-market-admin/internal/app/middleware"
	"github.com/gin-gonic/gin"
)

func InitTaskRouter(Router *gin.RouterGroup) {
	taskRouter := Router.Group("task")
	taskRouterWithAuth := Router.Group("task").Use(middleware.JWTAuth())
	{
		taskRouter.GET("getTaskList", api.GetTaskList)       // 获取需求列表
		taskRouter.GET("getSillTreeMap", api.GetSillTreeMap) // 获取技能树
	}
	{
		taskRouterWithAuth.POST("createTask", api.CreateTask)               // 创建需求
		taskRouterWithAuth.POST("updatedTask", api.UpdatedTask)             // 更新需求
		taskRouterWithAuth.POST("deleteTask", api.DeleteTask)               // 删除需求
		taskRouterWithAuth.POST("modifyApplySwitch", api.ModifyApplySwitch) // 修改报名开关
	}
}
