package model

type BlockLog struct {
	ID    uint `gorm:"column:id;primarykey" json:"id" form:"id"`
	Block uint `gorm:"column:block" json:"block" form:"block"`
}
