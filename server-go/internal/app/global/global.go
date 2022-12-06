package global

import (
	"code-market-admin/internal/app/config"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var (
	DB     *gorm.DB
	CONFIG config.Server
	LOG    *zap.Logger
	VIP    *viper.Viper
)
