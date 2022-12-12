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
		db = db.Where("worker = ?", searchInfo.Worker)
	}
	// 根据甲方地址过滤
	if searchInfo.Issuer != "" {
		db = db.Where("issuer = ?", searchInfo.Issuer)
	}
	// 根据订单ID过滤
	if searchInfo.OrderId != 0 {
		db = db.Where("order_id = ?", searchInfo.OrderId)
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
