package model

type TaskRoleRelate struct {
	ID     uint `gorm:"column:id;primarykey" json:"id" form:"id"`
	TaskID uint `gorm:"column:task_id" json:"task_id" form:"task_id"`
	RoleID uint `gorm:"column:role_id" json:"role_id" form:"role_id"`
}
