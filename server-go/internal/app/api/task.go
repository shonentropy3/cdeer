package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/request"
	response "code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/service"
	"code-market-admin/internal/app/utils"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// GetTaskList
// @Tags TaskApi
// @Summary 分页获取需求数据
// @accept application/json
// @Produce application/json
// @Router /task/getTaskList [get]
func GetTaskList(c *gin.Context) {
	var searchInfo request.GetTaskListRequest
	_ = c.ShouldBindQuery(&searchInfo)
	// 校验字段
	if err := utils.Verify(searchInfo.PageInfo, utils.PageSizeLimitVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
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

// CreateTask
// @Tags TaskApi
// @Summary 发布需求
// @accept application/json
// @Produce application/json
// @Router /task/createTask [post]
func CreateTask(c *gin.Context) {
	var task request.CreateTaskRequest
	_ = c.ShouldBindJSON(&task)
	// 校验字段
	if err := utils.Verify(task.Task, utils.CreateTaskVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := service.CreateTask(task); err != nil {
		global.LOG.Error("创建失败!", zap.Error(err))
		response.FailWithMessage("创建失败", c)
	} else {
		response.OkWithMessage("创建成功", c)
	}
}

// UpdatedTask
// @Tags TaskApi
// @Summary 更新需求信息
// @accept application/json
// @Produce application/json
// @Param
// @Success
// @Router /task/UpdatedTask [post]
func UpdatedTask(c *gin.Context) {
	var task request.UpdatedTaskRequest
	_ = c.ShouldBindJSON(&task)

	if err := utils.Verify(task.Task, utils.UpdatedTaskVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}

	if err := service.UpdatedTask(task); err != nil {
		global.LOG.Error("更新失败!", zap.Error(err))
		response.FailWithMessage(err.Error(), c)
	} else {
		response.OkWithMessage("更新成功", c)
	}
}

// DeleteTask
// @Tags TaskApi
// @Summary 删除需求
// @accept application/json
// @Produce application/json
// @Param
// @Success
// @Router /task/deleteTask [post]
func DeleteTask(c *gin.Context) {
	var task request.DeleteTaskRequest
	_ = c.ShouldBindJSON(&task)

	if err := utils.Verify(task.Task, utils.DeleteTaskVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}

	if err := service.DeleteTask(task); err != nil {
		global.LOG.Error("删除失败!", zap.Error(err))
		response.FailWithMessage("删除失败", c)
	} else {
		response.OkWithMessage("删除成功", c)
	}
}
