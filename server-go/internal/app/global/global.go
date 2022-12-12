package global

import (
	"code-market-admin/internal/app/config"
	"github.com/allegro/bigcache/v3"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var (
	DB           *gorm.DB      // 数据库链接
	CONFIG       config.Server // 配置信息
	LOG          *zap.Logger
	VIP          *viper.Viper
	Cache        *bigcache.BigCache
	Traversed    bool                      // 扫块任务运行状态
	ContractAddr map[string]common.Address // 合约地址
	AddrContract map[common.Address]string // 合约地址
	ContractABI  map[string]abi.ABI        // 合约ABI
)
