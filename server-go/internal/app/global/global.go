package global

import (
	"code-market-admin/internal/app/config"
	"github.com/allegro/bigcache/v3"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"sync/atomic"
	"time"
)

var (
	DB           *gorm.DB      // 数据库链接
	CONFIG       config.Server // 配置信息
	LOG          *zap.Logger
	VIP          *viper.Viper
	TokenCache   *bigcache.BigCache // Token缓存
	JsonCache    *bigcache.BigCache // JSON缓存
	StartTime    time.Time
	Traversed    atomic.Bool               // 任务运行状态
	ContractAddr map[string]common.Address // 合约地址
)
