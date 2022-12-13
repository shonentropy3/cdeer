package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"errors"
)

// CreateUserInfo
// @function: CreateUserInfo
// @description: 创建用户信息
// @param:
// @return:
func CreateUserInfo(createuserInfo request.CreateUserInfoRequest) (err error) {
	// 开始事务
	tx := global.DB.Begin()
	//查找技能要求是否在列表中
	var roleList []int64
	for _, v := range createuserInfo.Role {
		roleList = append(roleList, v)
	}
	var count int64
	if err = tx.Model(&model.TaskRole{}).Where("role_num in ?", roleList).Count(&count).Error; err != nil {
		tx.Rollback()
		return errors.New("新建失败")
	}
	if int(count) != len(createuserInfo.Role) {
		tx.Rollback()
		return errors.New("新建失败")
	}

	if err = tx.Model(&model.User{}).Create(&createuserInfo.User).Error; err != nil {
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
	// 开始事务
	tx := global.DB.Begin()
	if err = tx.Where("address = ?", userInfo.Address).Find(&user).Error; err != nil {
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
	// 开始事务
	tx := global.DB.Begin()
	// 查找技能要求是否在列表中
	var roleList []int64
	for _, v := range updateuserInfo.Role {
		roleList = append(roleList, v)
	}
	var count int64
	if err = tx.Model(&model.TaskRole{}).Where("role_num in ?", roleList).Count(&count).Error; err != nil {
		tx.Rollback()
		return errors.New("修改失败")
	}
	if int(count) != len(updateuserInfo.Role) {
		tx.Rollback()
		return errors.New("修改失败")
	}

	if err = tx.Model(&model.User{}).Where("address = ?", updateuserInfo.Address).Updates(&updateuserInfo.User).Error; err != nil {
		return err
	}
	return err
}
