package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitTaskRouter(Router *gin.RouterGroup) {
	taskRouter := Router.Group("task")
	{
		taskRouter.GET("getTaskList", api.GetTaskList)  // 获取需求列表
		taskRouter.POST("createTask", api.CreateTask)   // 创建需求
		taskRouter.POST("updatedTask", api.UpdatedTask) // 更新需求
		taskRouter.POST("deleteTask", api.DeleteTask)   // 删除需求
	}
}
