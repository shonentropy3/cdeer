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

// GetUserInfo
// @Summary 搜索项目
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
	} else {
		response.OkWithDetailed(userRes, "获取成功", c)
	}
}
