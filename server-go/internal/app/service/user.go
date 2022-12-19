package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	"errors"
	"gorm.io/gorm"
)

// CreateUserInfo
// @function: CreateUserInfo
// @description: 创建用户信息
// @param: createuserInfo request.CreateUserInfoRequest
// @return: err error
func CreateUserInfo(createuserInfo request.CreateUserInfoRequest) (err error) {
	//查找技能要求是否在列表中
	var roleList []int64
	for _, v := range createuserInfo.Role {
		roleList = append(roleList, v)
	}
	var count int64
	if err = global.DB.Model(&model.TaskRole{}).Where("role_num in ?", roleList).Count(&count).Error; err != nil {
		return errors.New("新建失败")
	}
	if int(count) != len(createuserInfo.Role) {
		return errors.New("新建失败")
	}

	if err = global.DB.Model(&model.User{}).Save(&createuserInfo.User).Error; err != nil {
		return err
	}
	return nil
}

// GetUserAvatar
// @function: GetUserAvatar
// @description: 获取个⼈资料(用户名和头像)
// @param: userAvatar request.GetUserInfoRequest
// @return: err error, user model.User
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
// @param: userInfo request.GetUserInfoRequest
// @return: err error, user model.User
func GetUserInfo(userInfo request.GetUserInfoRequest) (err error, user model.User) {
	// 开始事务
	if err = global.DB.Model(&model.User{}).Where("address = ?", userInfo.Address).Find(&user).Error; err != nil {
		return err, user
	}
	return err, user
}

// UpdateUserInfo
// @function: UpdateUserInfo
// @description: 修改个⼈资料
// @param: updateuserInfo request.UpdateUserInfoRequest
// @return: err error
func UpdateUserInfo(updateuserInfo request.UpdateUserInfoRequest) (err error) {
	// 查找技能要求是否在列表中
	var roleList []int64
	for _, v := range updateuserInfo.Role {
		roleList = append(roleList, v)
	}
	var count int64
	if err = global.DB.Model(&model.TaskRole{}).Where("role_num in ?", roleList).Count(&count).Error; err != nil {
		return errors.New("修改失败")
	}
	if int(count) != len(updateuserInfo.Role) {
		return errors.New("修改失败")
	}
	if err = global.DB.Model(&model.User{}).Where("address = ?", updateuserInfo.Address).Updates(&updateuserInfo.User).Error; err != nil {
		return err
	}
	return nil
}

// UnReadMsgCount
// @description: 获取未读消息数量
// @param: userID string
// @return: count int64, err error
func UnReadMsgCount(userID uint) (count int64, err error) {
	err = global.DB.Model(&model.Message{}).Where("status = 0 AND rec_id = ?", userID).Count(&count).Error
	return count, err
}

// UnReadMsg
// @description: 获取未读消息
// @param: userID string
// @return: count int64, err error
func UnReadMsg(userID uint) (list []model.Message, total int64, err error) {
	db := global.DB.Model(&model.Message{})
	db = db.Where("status = 0 AND rec_id = ?", userID)
	err = db.Count(&total).Error
	if err != nil {
		return list, total, err
	}
	err = db.Order("created_at desc").Find(&list).Error
	return list, total, err
}

// ReadMsg
// @description: 阅读信息
// @param: userID string, msgID uint
// @return: err error
func ReadMsg(userID uint, msgID uint) (err error) {
	raw := global.DB.Model(&model.Message{}).Where("rec_id = ? AND id = ?", userID, msgID).Update("status", 1)
	if raw.RowsAffected == 0 {
		return errors.New("修改状态失败")
	}
	return raw.Error
}

// MsgList
// @description: 分页获取消息
// @param: userID string, msgID uint
// @return: err error
func MsgList(searchInfo request.MsgListRequest, userID uint) (list []response.MsgListRespond, total int64, err error) {
	db := global.DB.Model(&model.Message{})
	limit := searchInfo.PageSize
	offset := searchInfo.PageSize * (searchInfo.Page - 1)
	db = db.Where("rec_id = ?", userID)

	if err = db.Count(&total).Error; err != nil {
		return list, total, err
	}
	db = db.Limit(limit).Offset(offset)
	err = db.Select("message.*,\"user\".avatar as avatar").Order("created_at desc").Joins("LEFT JOIN \"user\" ON \"user\".id=message.send_id").Find(&list).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return list, total, err
	}
	return list, total, nil
}
