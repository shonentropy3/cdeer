package model

type Skill struct {
	ID       uint     `gorm:"primarykey" json:"id" form:"id"`      // 主键ID
	ParentId uint     `json:"parentId" gorm:"comment:父菜单ID"`       // 父菜单ID
	Zh       string   `json:"zh" gorm:"zh"`                        // 中文名称
	En       string   `json:"en" gorm:"en"`                        // 英文名称
	Sort     int16    `gorm:"column:sort;default:0" json:"sort"`   //排序
	Index    uint8    `gorm:"column:index;default:0" json:"index"` // 链上索引
	Children []*Skill `json:"children" gorm:"-"`
}
