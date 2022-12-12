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

// CreateUserInfo
// @Summary 创建个人资料
// @accept application/json
// @Produce application/json
// @Router /task/CreateUserInfo [get]
func CreateUserInfo(c *gin.Context) {
	var createuserInfo request.CreateUserInfoRequest
	_ = c.ShouldBindJSON(&createuserInfo)
	// 检验字段
	if err := utils.Verify(createuserInfo.User, utils.CreateUserInfoVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := service.CreateUserInfo(createuserInfo); err != nil {
		global.LOG.Error("创建失败!", zap.Error(err))
		response.FailWithMessage("创建失败", c)
	} else {
		response.OkWithMessage("创建成功", c)
	}
}

// GetUserInfo
// @Summary 获取个人资料(用户名和头像)
// @accept application/json
// @Produce application/json
// @Router /task/getUserInfo [get]
func GetUserAvatar(c *gin.Context) {
	var userAvatar request.GetUserInfoRequest
	_ = c.ShouldBindQuery(&userAvatar)
	// 校验字段
	if err := utils.Verify(userAvatar.User, utils.UserInfoVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err, userRes := service.GetUserAvatar(userAvatar); err != nil {
		global.LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
	} else if userRes.Address == "" {
		response.FailWithMessage("查无此人", c)
	} else {
		response.OkWithDetailed(response.User_avatar{
			Username: userRes.Username,
			Avatar:   userRes.Avatar,
		}, "获取成功", c)
	}
}

// GetUserInfo
// @Summary 获取个人资料
// @accept application/json
// @Produce application/json
// @Router /task/getUserInfo [get]
func GetUserInfo(c *gin.Context) {
	var userInfo request.GetUserInfoRequest
	_ = c.ShouldBindQuery(&userInfo)
	// 校验字段
	if err := utils.Verify(userInfo.User, utils.UserInfoVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err, userRes := service.GetUserInfo(userInfo); err != nil {
		global.LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
	} else if userRes.Address == "" {
		response.FailWithMessage("查无此人", c)
	} else {
		response.OkWithDetailed(userRes, "获取成功", c)
	}
}

// UpdateUserInfo
// @Summary 修改个人资料
// @accept application/json
// @Produce application/json
// @Router /task/UpdateUserInfo [get]
func UpdateUserInfo(c *gin.Context) {
	var updateuserInfo request.UpdateUserInfoRequest
	_ = c.ShouldBindJSON(&updateuserInfo)
	// 校验字段
	if err := utils.Verify(updateuserInfo.User, utils.UpdateUserInfoVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := service.UpdateUserInfo(updateuserInfo); err != nil {
		global.LOG.Error("修改失败!", zap.Error(err))
		response.FailWithMessage("修改失败", c)
	} else {
		response.OkWithMessage("修改成功", c)
	}
}
