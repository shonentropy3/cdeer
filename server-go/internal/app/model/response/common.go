package response

type PageResult struct {
	List     interface{} `json:"list"`
	Total    int64       `json:"total"`
	Page     int         `json:"page"`
	PageSize int         `json:"pageSize"`
}

type UploadResponse struct {
	Hash string `json:"hash"`
}

type UploadImageResponse struct {
	Name string `json:"name" gorm:"size:512;comment:文件名"`  // 文件名
	Url  string `json:"url" gorm:"size:2047;comment:文件地址"` // 文件地址
}
