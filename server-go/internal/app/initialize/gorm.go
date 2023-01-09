package initialize

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"os"
)

//type MultiChain struct{}

func InitChain() {
	global.MAPDB = make(map[string]*gorm.DB) // 初始化map
	for _, chain := range global.CONFIG.BlockChain {
		db := GormPgSql(chain.Name)
		if db != nil {
			global.MAPDB[chain.Name] = db
			RegisterTables(db) // 初始化表
		}
	}
}

//func (c *MultiChain) Chian(name string) *gorm.DB { return global.DBMAP[name] }

//// Gorm 初始化数据库并产生数据库全局变量
//func Gorm() *gorm.DB {
//	return GormPgSql()
//}

// RegisterTables 注册数据库表专用
func RegisterTables(db *gorm.DB) {
	err := db.AutoMigrate(
		model.Apply{},
		model.Order{},
		model.User{},
		model.TransHash{},
		model.Task{},
		model.Upload{},
		model.Skill{},
		model.Message{},
		model.OrderFlow{},
		model.MessageTmpl{},
	)
	if err != nil {
		global.LOG.Error("register table failed", zap.Error(err))
		os.Exit(0)
	}
	global.LOG.Info("register table success")
}
