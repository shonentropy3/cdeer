package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/request"
	response "code-market-admin/internal/app/model/respond"
	"code-market-admin/internal/app/service"
	"fmt"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// GetSearchList
// @Tags TaskApi
// @Summary 搜索项目
// @accept application/json
// @Produce application/json
// @Router /task/getSearchList [get]
func GetSearchList(c *gin.Context) {
	var pageInfo request.GetSearchListRequest
	_ = c.ShouldBindQuery(&pageInfo)
	fmt.Println(pageInfo)
	if err, list, total := service.GetSearchList(pageInfo.Tasks, pageInfo.PageInfo); err != nil {
		global.LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
	} else {
		response.OkWithDetailed(response.PageResult{
			List:     list,
			Total:    total,
			Page:     pageInfo.Page,
			PageSize: pageInfo.PageSize,
		}, "获取成功", c)
	}
}
