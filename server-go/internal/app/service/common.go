package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/utils"
	"encoding/json"
	"errors"
	"fmt"
	uuid "github.com/satori/go.uuid"
	"go.uber.org/zap"
	"io"
	"mime/multipart"
	"os"
	"path"
	"strings"
	"time"
)

// UploadFile
// @function: UploadFile
// @description: 上传文件
// @param: header *multipart.FileHeader
// @return: err error, list interface{}, total int64
func UploadFile(header *multipart.FileHeader) (err error, hash string) {
	// 文件大小限制
	fmt.Println(header.Size)
	if header.Size > 1024*1024*20 {
		return errors.New("文件大小超过限制！"), hash
	}
	// 发送请求
	url := fmt.Sprintf("%s/upload/image", global.CONFIG.IPFS.UploadAPI)
	res, err := utils.PostFileRequest(url, header)
	if err != nil {
		return err, hash
	}
	// 解析返回结果
	type Response struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Hash    string `gorm:"column:hash" json:"hash" form:"hash"`
	}
	var resJson Response
	err = json.Unmarshal(res, &resJson)
	if err != nil {
		return err, hash
	}
	if resJson.Status != "1" {
		return errors.New(resJson.Message), hash
	}

	return err, resJson.Hash
}

// UploadJSON
// @function: UploadJSON
// @description: 上传文件
// @param: header *multipart.FileHeader
// @return: err error, list interface{}, total int64
func UploadJSON(data string) (err error, hash string) {
	// 组成请求体
	jsonReq := make(map[string]interface{})
	jsonReq["body"] = data
	// 发送请求
	url := fmt.Sprintf("%s/upload/json", global.CONFIG.IPFS.UploadAPI)
	res, err := utils.PostRequest(url, jsonReq, "application/json")
	if err != nil {
		return err, hash
	}

	// 解析返回结果
	type Response struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Hash    string `gorm:"column:hash" json:"hash" form:"hash"`
	}
	var resJson Response
	err = json.Unmarshal(res, &resJson)
	if err != nil {
		return err, hash
	}
	if resJson.Status != "1" {
		return errors.New(resJson.Message), hash
	}

	return err, resJson.Hash
}

// UploadImage
// @function: UploadImage
// @description: 上传图片到本地
// @param: header *multipart.FileHeader
// @return: err error, list interface{}, total int64
func UploadImage(header *multipart.FileHeader) (file response.UploadImageResponse, err error) {
	// 读取文件后缀
	ext := strings.ToLower(path.Ext(header.Filename))
	// 拼接新文件名
	UUID := uuid.NewV4().String()
	filename := UUID + ext
	now := time.Now()
	director := global.CONFIG.Local.Path + "/" + now.Format("2006/01/")
	// 尝试创建此路径
	mkdirErr := os.MkdirAll(director, os.ModePerm)
	if mkdirErr != nil {
		global.LOG.Error("function os.MkdirAll() Filed", zap.Any("err", mkdirErr.Error()))
		return file, errors.New("function os.MkdirAll() Filed, err:" + mkdirErr.Error())
	}
	// 拼接路径和文件名
	p := director + filename
	f, openError := header.Open() // 读取文件
	if openError != nil {
		global.LOG.Error("function file.Open() Filed", zap.Any("err", openError.Error()))
		return file, errors.New("function file.Open() Filed, err:" + openError.Error())
	}
	defer f.Close() // 创建文件 defer 关闭

	out, createErr := os.Create(p)
	if createErr != nil {
		global.LOG.Error("function os.Create() Filed", zap.Any("err", createErr.Error()))

		return file, errors.New("function os.Create() Filed, err:" + createErr.Error())
	}
	defer out.Close() // 创建文件 defer 关闭

	_, copyErr := io.Copy(out, f) // 传输（拷贝）文件
	if copyErr != nil {
		global.LOG.Error("function io.Copy() Filed", zap.Any("err", copyErr.Error()))
		return file, errors.New("function io.Copy() Filed, err:" + copyErr.Error())
	}
	upload := model.Upload{Url: p, Name: filename, Key: UUID}
	if err = global.DB.Model(&model.Upload{}).Create(&upload).Error; err != nil {
		return file, err
	}
	file.Name = filename
	file.Url = p
	return file, err
}
