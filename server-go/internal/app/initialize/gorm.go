package initialize

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"os"
)

// Gorm 初始化数据库并产生数据库全局变量
func Gorm() *gorm.DB {
	return GormPgSql()
}

// RegisterTables 注册数据库表专用
func RegisterTables(db *gorm.DB) {
	err := db.AutoMigrate(
		model.Nft{},
		model.Apply{},
		model.BlockLog{},
		model.Order{},
		model.User{},
		model.TransHash{},
		model.Task{},
		model.Upload{},
		model.Skill{},
		model.Message{},
		model.OrderFlow{},
	)
	if err != nil {
		global.LOG.Error("register table failed", zap.Error(err))
		os.Exit(0)
	}
	global.LOG.Info("register table success")
}
