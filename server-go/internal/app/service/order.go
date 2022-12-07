package service

import (
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
)

// GetOrderList
// @function: GetOrderList
// @description: 分页获取个⼈进⾏中的项⽬
// @param:
// @return:
func GetOrderList(searchInfo request.GetOrderListRequest) (err error, list interface{}, total int64) {
	var orderList []model.Order
	limit := searchInfo.PageSize
	offset := searchInfo.PageSize * (searchInfo.Page - 1)
	db := global.DB.Model(&model.Order{})
	// 根据乙方地址过滤
	if searchInfo.Worker != "" {
		if err = db.Where("worker = ?", searchInfo.Worker).Error; err != nil {
			return err, list, total
		}
	}
	// 根据甲方地址过滤
	if searchInfo.Issuer != "" {
		if err = db.Where("issuer = ?", searchInfo.Issuer).Error; err != nil {
			return err, list, total
		}
	}
	// 根据订单ID过滤
	if searchInfo.OrderId != 0 {
		if err = db.Where("order_id = ?", searchInfo.OrderId).Error; err != nil {
			return err, list, total
		}
	}
	err = db.Count(&total).Error
	if err != nil {
		return err, list, total
	} else {
		db = db.Limit(limit).Offset(offset)
		err = db.Order("create_time desc").Find(&orderList).Error
	}

	return err, orderList, total
}
