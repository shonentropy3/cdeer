package model

type TaskRole struct {
	ID      uint   `gorm:"column:id" json:"id" form:"id"`
	RoleNum uint16 `gorm:"column:role_num" json:"role_num" form:"role_num"`
	Role    string `gorm:"column:role" json:"role" form:"role"`
}
