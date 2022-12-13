package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
)

// CreateUserInfo
// @function: CreateUserInfo
// @description: 创建用户信息
// @param:
// @return:
func CreateUserInfo(createuserInfo request.CreateUserInfoRequest) (err error) {
	db := global.DB.Model(&model.User{})
	if err = db.Model(&model.User{}).Create(&createuserInfo.User).Error; err != nil {
		return err
	}
	return err
}

// GetUserAvatar
// @function: GetUserAvatar
// @description: 获取个⼈资料(用户名和头像)
// @param:
// @return:
func GetUserAvatar(userAvatar request.GetUserInfoRequest) (err error, user model.User) {
	db := global.DB.Model(&model.User{})
	if err = db.Where("address = ?", userAvatar.Address).Find(&user).Error; err != nil {
		return err, user
	}
	return err, user
}

// GetUserInfo
// @function: GetUserInfo
// @description: 获取个⼈资料
// @param:
// @return:
func GetUserInfo(userInfo request.GetUserInfoRequest) (err error, user model.User) {
	db := global.DB.Model(&model.User{})
	if err = db.Where("address = ?", userInfo.Address).Find(&user).Error; err != nil {
		return err, user
	}
	return err, user
}

// UpdateUserInfo
// @function: UpdateUserInfo
// @description: 修改个⼈资料
// @param:
// @return:
func UpdateUserInfo(updateuserInfo request.UpdateUserInfoRequest) (err error) {
	db := global.DB.Model(&model.User{})
	if err = db.Model(&model.User{}).Where("address = ?", updateuserInfo.Address).Updates(&updateuserInfo.User).Error; err != nil {
		return err
	}
	return err
}
