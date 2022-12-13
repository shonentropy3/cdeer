package router

import (
	"code-market-admin/internal/app/api"
	"code-market-admin/internal/app/middleware"
	"github.com/gin-gonic/gin"
)

func InitUserRouter(Router *gin.RouterGroup) {
	userRouter := Router.Group("user")
	userRouterWithAuth := Router.Group("user").Use(middleware.JWTAuth())
	{
		userRouter.GET("getUserAvatar", api.GetUserAvatar) // 获取个人信息(用户名和头像)
	}
	{
		userRouterWithAuth.POST("createUserInfo", api.CreateUserInfo) //创建个人信息
		userRouterWithAuth.GET("getUserInfo", api.GetUserInfo)        // 获取个人信息
		userRouterWithAuth.POST("updateUserInfo", api.UpdateUserInfo) // 修改个人信息
	}
}
