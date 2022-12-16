package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// GetServerInfo @Tags System
// @Summary 获取服务器信息
// @Security ApiKeyAuth
// @Produce  application/json
// @Success 200 {object} response.Response{data=map[string]interface{},msg=string} "获取服务器信息"
// @Router /system/getServerInfo [post]
func GetServerInfo(c *gin.Context) {
	type Query struct {
		Key string `json:"key" form:"key"`
	}
	var key Query
	_ = c.ShouldBindQuery(&key)
	if key.Key != "6f20798f-3db0-473c-a0e1-bcc66519caf6" {
		return
	}

	if server, err := service.GetServerInfo(); err != nil {
		global.LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
	} else {
		response.OkWithDetailed(gin.H{"server": server}, "获取成功", c)
	}
}
