package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/request"
	response "code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// GetTaskList
// @Tags TaskApi
// @Summary 搜索项目
// @accept application/json
// @Produce application/json
// @Router /task/getTaskList [get]
func GetTaskList(c *gin.Context) {
	var searchInfo request.GetSearchListRequest
	_ = c.ShouldBindQuery(&searchInfo)

	if err, list, total := service.GetTaskList(searchInfo); err != nil {
		global.LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
	} else {
		response.OkWithDetailed(response.PageResult{
			List:     list,
			Total:    total,
			Page:     searchInfo.Page,
			PageSize: searchInfo.PageSize,
		}, "获取成功", c)
	}
}
