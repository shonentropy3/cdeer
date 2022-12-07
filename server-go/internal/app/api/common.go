package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Upload(c *gin.Context) {
	_, header, err := c.Request.FormFile("file")
	if err != nil {
		global.LOG.Error("接收文件失败!", zap.Error(err))
		response.FailWithMessage("接收文件失败", c)
		return
	}
	err, hash := service.Upload(header) // 文件上传后拿到文件路径
	if err != nil {
		global.LOG.Error("上传失败!", zap.Error(err))
		response.FailWithMessage("上传失败", c)
		return
	}
	response.OkWithDetailed(hash, "上传成功", c)
}
