package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitOrderRouter(Router *gin.RouterGroup) {
	orderRouter := Router.Group("order")
	{
		orderRouter.GET("getOrderList", api.GetOrderList) // 获取任务列表
	}
}
