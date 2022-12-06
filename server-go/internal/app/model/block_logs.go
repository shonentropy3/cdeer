package model

type BlockLogs struct {
	Id    int   `gorm:"column:id" json:"id" form:"id"`
	Block int64 `gorm:"column:block" json:"block" form:"block"`
}
