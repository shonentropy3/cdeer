package model

type TaskRoleRelate struct {
	ID     int64 `gorm:"column:id" json:"id" form:"id"`
	TaskID int64 `gorm:"column:task_id" json:"task_id" form:"task_id"`
	RoleID int64 `gorm:"column:role_id" json:"role_id" form:"role_id"`
}
