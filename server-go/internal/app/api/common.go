package api

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/service"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"path"
	"strings"
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

// UploadImage
// @Tags CommonApi
// @Summary 上传图片文件
// @Router /common/uploadImage [post]
func UploadImage(c *gin.Context) {
	_, header, err := c.Request.FormFile("file")
	if err != nil {
		global.LOG.Error("接收文件失败!", zap.Error(err))
		response.FailWithMessage("接收文件失败", c)
		return
	}
	// 读取文件后缀
	ext := path.Ext(header.Filename)
	ext = strings.ToLower(ext)
	// 限制文件后缀
	if (ext == ".jpg" || ext == ".png" || ext == ".jpeg" || ext == ".gif") == false {
		global.LOG.Error("文件格式不正确", zap.String("ext", ext))
		response.FailWithMessage("文件格式不正确", c)
		return
	}

	file, err := service.UploadImage(header) // 文件上传后拿到文件路径
	if err != nil {
		global.LOG.Error("修改数据库链接失败!", zap.Error(err))
		response.FailWithMessage("修改数据库链接失败", c)
		return
	}
	response.OkWithDetailed(file, "上传成功", c)
}
