package response

type User_avatar struct {
	Username string `gorm:"column:username" json:"username" form:"username"`
	Avatar   string `gorm:"column:avatar" json:"avatar" form:"avatar"`
}
