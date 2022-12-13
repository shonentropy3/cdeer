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

// GetApplyList
// @Tags ApplyApi
// @Summary 分页获取需求里报名详情
// @accept application/json
// @Produce application/json
// @Router /apply/getApplyList [get]
func GetApplyList(c *gin.Context) {
	var searchInfo request.GetApplyListRequest
	_ = c.ShouldBindQuery(&searchInfo)
	// 校验字段
	if err := utils.Verify(searchInfo.PageInfo, utils.PageSizeLimitVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	// 校验任务ID
	if err := utils.Verify(searchInfo.Apply, utils.GetApplyListVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err, list, total := service.GetApplyList(searchInfo); err != nil {
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

// GetApply
// @Tags ApplyApi
// @Summary 分页获取个⼈报名中的项⽬
// @accept application/json
// @Produce application/json
// @Router /apply/getApply [get]
func GetApply(c *gin.Context) {
	var searchInfo request.GetApplyRequest
	_ = c.ShouldBindQuery(&searchInfo)
	// 校验字段
	if err := utils.Verify(searchInfo.PageInfo, utils.PageSizeLimitVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	// 校验发起人地址
	if err := utils.Verify(searchInfo.Apply, utils.GetApplyVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err, list, total := service.GetApply(searchInfo); err != nil {
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

// CreateApply
// @Tags ApplyApi
// @Summary 添加报名信息
// @accept application/json
// @Produce application/json
// @Router /apply/createApply [post]
func CreateApply(c *gin.Context) {
	var apply request.CreateApplyRequest
	_ = c.ShouldBindJSON(&apply)
	// 校验字段
	if err := utils.Verify(apply.Apply, utils.CreateTaskVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := service.CreateApply(apply); err != nil {
		global.LOG.Error("添加失败!", zap.Error(err))
		response.FailWithMessage("添加失败", c)
	} else {
		response.OkWithMessage("添加成功", c)
	}
}

// UpdatedApply
// @Tags ApplyApi
// @Summary 更新报名信息
// @accept application/json
// @Produce application/json
// @Param
// @Success
// @Router /apply/updateApply [post]
func UpdatedApply(c *gin.Context) {
	var apply request.UpdatedApplyRequest
	_ = c.ShouldBindJSON(&apply)
	if err := utils.Verify(apply.Apply, utils.UpdatedApplyVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := service.UpdatedApply(apply); err != nil {
		global.LOG.Error("更新失败!", zap.Error(err))
		response.FailWithMessage(err.Error(), c)
	} else {
		response.OkWithMessage("更新成功", c)
	}
}

// DeleteApply
// @Tags ApplyApi
// @Summary 删除报名信息
// @accept application/json
// @Produce application/json
// @Param
// @Success
// @Router /apply/deleteApply [post]
func DeleteApply(c *gin.Context) {
	var apply request.DeleteApplyRequest
	_ = c.ShouldBindQuery(&apply)
	if err := utils.Verify(apply.Apply, utils.DeleteApplyVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := service.DeleteApply(apply); err != nil {
		global.LOG.Error("删除失败!", zap.Error(err))
		response.FailWithMessage("删除失败", c)
	} else {
		response.OkWithMessage("删除成功", c)
	}
}

// UpdatedApplySort
// @Tags ApplyApi
// @Summary 更新报名列表排序
// @accept application/json
// @Produce application/json
// @Param
// @Success
// @Router /apply/updateApply [post]
func UpdatedApplySort(c *gin.Context) {
	var apply request.UpdatedApplySortRequest
	_ = c.ShouldBindQuery(&apply)
	if err := utils.Verify(apply.Apply, utils.UpdatedApplySortVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := service.UpdatedApplySort(apply); err != nil {
		global.LOG.Error("更新失败!", zap.Error(err))
		response.FailWithMessage(err.Error(), c)
	} else {
		response.OkWithMessage("更新成功", c)
	}
}
