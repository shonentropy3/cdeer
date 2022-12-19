package router

import (
	"code-market-admin/internal/app/api"
	"code-market-admin/internal/app/middleware"
	"github.com/gin-gonic/gin"
)

func InitApplyRouter(Router *gin.RouterGroup) {
	applyRouter := Router.Group("apply")
	applyRouterWithAuth := Router.Group("apply").Use(middleware.JWTAuth())
	{
		applyRouter.GET("getApplyList", api.GetApplyList) // 获取需求里报名详情
		applyRouter.GET("getApply", api.GetApply)         // 分页获取个⼈报名中的项⽬
	}
	{
		applyRouterWithAuth.POST("createApply", api.CreateApply)           // 添加报名信息
		applyRouterWithAuth.POST("updatedApply", api.UpdatedApply)         // 更新报名信息
		applyRouterWithAuth.POST("updatedApplySort", api.UpdatedApplySort) // 更新报名列表排序
		applyRouterWithAuth.POST("deleteApply", api.DeleteApply)           // 取消报名
	}
}
