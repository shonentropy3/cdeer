package service

import (
	"code-market-admin/internal/app/utils"
	"fmt"
	"mime/multipart"
)

// Upload
// @function: Upload
// @description: 上传文件到IPFS
// @param: header *multipart.FileHeader
// @return: err error, list interface{}, total int64
func Upload(header *multipart.FileHeader) (err error, hash string) {
	res, err := utils.PostFileRequest("http://47.242.152.213:3022/v1/upload/json", data.Read())
	if err != nil {
		return err, hash
	}

	fmt.Println(string(res))
	return err, hash
}
