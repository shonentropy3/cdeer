package global

import (
	"code-market-admin/internal/app/config"
	"github.com/allegro/bigcache/v3"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"sync/atomic"
)

var (
	DB        *gorm.DB      // 数据库链接
	CONFIG    config.Server // 配置信息
	LOG       *zap.Logger
	VIP       *viper.Viper
	Cache     *bigcache.BigCache
	Traversed atomic.Bool // 任务运行状态
)
