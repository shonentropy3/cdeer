package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/service"
	"code-market-admin/internal/app/utils"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// GetOrderList
// @Tags OrderApi
// @Summary 分页获取任务数据
// @accept application/json
// @Produce application/json
// @Router /order/getOrderList [get]
func GetOrderList(c *gin.Context) {
	var searchInfo request.GetOrderListRequest
	_ = c.ShouldBindQuery(&searchInfo)
	// 校验字段
	if searchInfo.Issuer == "" && searchInfo.Worker == "" {
		response.FailWithMessage("参数不能为空!", c)
		return
	}
	if err, list, total := service.GetOrderList(searchInfo); err != nil {
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

// CreateOrder
// @Tags TaskApi
// @Summary 添加任务
// @accept application/json
// @Produce application/json
// @Router /order/createOrder [post]
func CreateOrder(c *gin.Context) {
	var task request.CreateOrderRequest
	_ = c.ShouldBindJSON(&task)
	// 校验字段
	if err := utils.Verify(task.Order, utils.CreateTaskVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := service.CreateOrder(task); err != nil {
		global.LOG.Error("创建失败!", zap.Error(err))
		response.FailWithMessage("创建失败", c)
	} else {
		response.OkWithMessage("创建成功", c)
	}

}