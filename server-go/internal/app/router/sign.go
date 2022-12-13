package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitSignRouter(Router *gin.RouterGroup) {
	signRouter := Router.Group("sign")
	{
		signRouter.POST("getLoginMessage", api.GetLoginMessage) // 获取登录签名消息
		signRouter.POST("authLoginSign", api.AuthLoginSign)     // 校验登录签名
	}
}
