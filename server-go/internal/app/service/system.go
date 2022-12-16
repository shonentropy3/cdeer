package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/utils"
	"go.uber.org/zap"
)

func GetServerInfo() (server *utils.Server, err error) {
	var s utils.Server
	s.Os = utils.InitOS()
	if s.Cpu, err = utils.InitCPU(); err != nil {
		global.LOG.Error("func utils.InitCPU() Failed", zap.String("err", err.Error()))
		return &s, err
	}
	if s.Ram, err = utils.InitRAM(); err != nil {
		global.LOG.Error("func utils.InitRAM() Failed", zap.String("err", err.Error()))
		return &s, err
	}
	if s.Disk, err = utils.InitDisk(); err != nil {
		global.LOG.Error("func utils.InitDisk() Failed", zap.String("err", err.Error()))
		return &s, err
	}

	if s.Cache, err = utils.InitCache(); err != nil {
		global.LOG.Error("func utils.InitCache() Failed", zap.String("err", err.Error()))
		return &s, err
	}
	return &s, nil
}
