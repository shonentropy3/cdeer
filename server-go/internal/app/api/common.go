package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Upload(c *gin.Context) {
	json := c.PostForm("json")

	if json != "" {
		err, hash := service.UploadJSON(json) // 文件上传后拿到文件路径
		if err != nil {
			global.LOG.Error("上传失败!", zap.Error(err))
			response.FailWithMessage("上传失败", c)
			return
		}
		response.OkWithDetailed(response.UploadResponse{Hash: hash}, "上传成功", c)
		return
	} else {
		_, header, err := c.Request.FormFile("file")
		if err != nil {
			global.LOG.Error("接收文件失败!", zap.Error(err))
			response.FailWithMessage("接收文件失败", c)
			return
		}
		err, hash := service.UploadFile(header) // 文件上传后拿到文件路径
		if err != nil {
			global.LOG.Error("上传失败!", zap.Error(err))
			response.FailWithMessage("上传失败", c)
			return
		}
		response.OkWithDetailed(response.UploadResponse{Hash: hash}, "上传成功", c)
	}
}
