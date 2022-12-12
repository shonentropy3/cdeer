package request

// PageInfo Paging common input parameter structure
type PageInfo struct {
	Page     int `json:"page" form:"page,default=1"`          // 页码
	PageSize int `json:"pageSize" form:"pageSize,default=10"` // 每页大小
}
