package service

import (
	"code-market-admin/internal/app/blockchain"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/utils"
	"errors"
	"fmt"
	"github.com/allegro/bigcache/v3"
	uuid "github.com/satori/go.uuid"
	"strings"
)

// GetLoginMessage 获取登录签名消息
func GetLoginMessage(address string) (err error, loginMessage string) {
	loginMessage = fmt.Sprintf(global.CONFIG.Contract.Signature+"Wallet address:\n%s\n\n", address)
	UUID := uuid.NewV4() // 生成UUID
	// 存到Local Cache里
	if err = global.Cache.Set(UUID.String(), []byte{}); err != nil {
		return err, loginMessage
	}
	loginMessage = fmt.Sprintf(loginMessage+"Nonce:\n%s", UUID)
	return err, loginMessage
}

func AuthLoginSignRequest(req request.AuthLoginSignRequest) (token string, err error) {
	if !blockchain.VerifySig(req.Address, req.Signature, []byte(req.Message)) {
		return token, errors.New("签名校验失败")
	}
	// 获取Nonce
	index := strings.LastIndex(req.Message, "")
	if index == -1 {
		return token, errors.New("nonce获取失败")
	}
	// 校验Nonce
	_, cacheErr := global.Cache.Get(string(req.Message[index:]))
	if cacheErr == bigcache.ErrEntryNotFound {
		return token, errors.New("签名已失效")
	}
	// 验证成功返回JWT
	j := utils.NewJWT()
	claims := j.CreateClaims(utils.BaseClaims{
		Address: req.Address,
	})
	token, err = j.CreateToken(claims)
	if err != nil {
		return token, errors.New("获取token失败")
	}
	//  存入local cache
	if err = global.Cache.Set(req.Address, []byte(token)); err != nil {
		return token, errors.New("保存token失败")
	}
	return token, nil
}
