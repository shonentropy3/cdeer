package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitUserRouter(Router *gin.RouterGroup) {
	userRouter := Router.Group("user")
	{
		userRouter.POST("createUserInfo", api.CreateUserInfo) //创建个人信息
		userRouter.GET("getUserInfo", api.GetUserInfo)        // 获取个人信息
		userRouter.POST("updateUserInfo", api.UpdateUserInfo) // 修改个人信息

	}
}
