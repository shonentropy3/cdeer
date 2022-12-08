package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitApplyRouter(Router *gin.RouterGroup) {
	applyRouter := Router.Group("apply")
	{
		applyRouter.GET("getApplyList", api.GetApplyList) // 获取个⼈报名中的项⽬
	}
}
