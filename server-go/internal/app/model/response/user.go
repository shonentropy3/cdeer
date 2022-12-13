package response

type UserAvatar struct {
	Address  string `gorm:"column:address" json:"address" form:"address"`
	Username string `gorm:"column:username" json:"username" form:"username"`
	Avatar   string `gorm:"column:avatar" json:"avatar" form:"avatar"`
}
