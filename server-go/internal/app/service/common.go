package service

import (
	"code-market-admin/internal/app/utils"
	"encoding/json"
	"errors"
	"fmt"
	"mime/multipart"
)

// UploadFile
// @function: UploadFile
// @description: 上传文件
// @param: header *multipart.FileHeader
// @return: err error, list interface{}, total int64
func UploadFile(header *multipart.FileHeader) (err error, hash string) {
	res, err := utils.PostFileRequest("http://47.242.152.213:3022/v1/upload/image", header)
	if err != nil {
		return err, hash
	}

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
	jsonReq := make(map[string]interface{})
	jsonReq["body"] = data
	res, err := utils.PostRequest("http://47.242.152.213:3022/v1/upload/json", jsonReq, "application/json")
	if err != nil {
		return err, hash
	}
	fmt.Println(string(res))
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
