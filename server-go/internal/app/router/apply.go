package router

import (
	"code-market-admin/internal/app/api"
	"github.com/gin-gonic/gin"
)

func InitApplyRouter(Router *gin.RouterGroup) {
	applyRouter := Router.Group("apply")
	{
		applyRouter.GET("getApplyList", api.GetApplyList)          // 获取需求里报名详情
		applyRouter.GET("getApply", api.GetApply)                  // 分页获取个⼈报名中的项⽬
		applyRouter.POST("createApply", api.CreateApply)           // 添加报名信息
		applyRouter.POST("updatedApply", api.UpdatedApply)         // 更新报名信息
		applyRouter.POST("updatedApplySort", api.UpdatedApplySort) // 更新报名列表排序

	}
}
