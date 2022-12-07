package service

import (
	"mime/multipart"
)

// Upload
// @function: Upload
// @description: 上传文件到IPFS
// @param: header *multipart.FileHeader
// @return: err error, list interface{}, total int64
func Upload(header *multipart.FileHeader) (err error, hash string) {
	return err, hash
}
