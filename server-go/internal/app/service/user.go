package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
)

// GetUserInfo
// @function: GetUserInfo
// @description: 获取个⼈资料
// @param:
// @return:
func GetUserInfo(userInfo request.GetUserInfoRequest) (err error, user model.User) {
	db := global.DB.Model(&model.User{})
	if err = db.Where("address = ?", userInfo.Address).Error; err != nil {
		return err, user
	}
	db.Where("address = ?", userInfo.Address).Find(&user)
	return err, user
}

// updateUserInfo
// @function: updateUserInfo
// @description: 修改个⼈资料
// @param:
// @return:
func UpdateUserInfo() {

}
