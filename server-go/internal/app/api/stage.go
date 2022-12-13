package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/service"
	"code-market-admin/internal/app/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// CreatedStage
// @Tags StageApi
// @Summary 创建阶段划分
// @accept application/json
// @Produce application/json
// @Router /stage/createdStage [post]
func CreatedStage(c *gin.Context) {
	var stage request.CreatedStageRequest
	_ = c.ShouldBindJSON(&stage)
	// 校验字段
	fmt.Println(stage.Order)
	if err := utils.Verify(stage.Order, utils.CreatedStageVerify); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := service.CreatedStage(stage); err != nil {
		global.LOG.Error("创建失败!", zap.Error(err))
		response.FailWithMessage("创建失败", c)
	} else {
		response.OkWithMessage("创建成功", c)
	}
}
