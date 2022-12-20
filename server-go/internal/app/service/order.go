package service

import (
	"code-market-admin/internal/app/blockchain"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/model/request"
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/utils"
	"errors"
	"fmt"
	"github.com/tidwall/sjson"
)

// GetOrderList
// @function: GetOrderList
// @description: 分页获取个⼈进⾏中的项⽬
// @param: searchInfo request.GetOrderListRequest
// @return: err error, list interface{}, total int64
func GetOrderList(searchInfo request.GetOrderListRequest) (err error, list interface{}, total int64) {
	var orderList []response.GetOrderListResponse
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
	// 根据需求ID过滤
	if searchInfo.TaskID != 0 {
		db = db.Where("task_id = ?", searchInfo.TaskID)
	}
	// 根据状态过滤
	db = db.Where("state = ?", searchInfo.State)
	err = db.Count(&total).Error
	if err != nil {
		return err, list, total
	} else {
		db = db.Limit(limit).Offset(offset)
		err = db.Order("created_at desc").Preload("Task").Find(&orderList).Error
	}
	// 根据订单ID过滤 需要获取IPFS 具体内容
	if searchInfo.OrderId != 0 && len(orderList) == 1 {
		url := fmt.Sprintf("http://ipfs.learnblockchain.cn/%s", orderList[0].Attachment)
		orderList[0].StageJson, err = utils.GetRequest(url)
		if err != nil {
			return err, orderList, total
		}
	}
	return err, orderList, total
}

// CreateOrder
// @function: CreateOrder
// @description: 添加任务
// @param: taskReq request.CreateTaskRequest
// @return: err error
func CreateOrder(orderReq request.CreateOrderRequest, address string) (err error) {
	// 保存交易hash
	transHash := model.TransHash{SendAddr: address, EventName: "OrderCreated", Hash: orderReq.Hash}
	if err = SaveHash(transHash); err != nil {
		return errors.New("新建失败")
	}
	return nil
}

// UpdatedStage
// @function: CreatedStage
// @description: 创建阶段划分
// @param: stage request.UpdatedStageRequest
// @return: err error
func UpdatedStage(stage request.UpdatedStageRequest) (err error) {
	if stage.Obj != "" {
		// 查询当前attachment
		var attachment string
		err = global.DB.Model(&model.Order{}).Select("attachment").Where("order_id = ?", stage.OrderId).First(&attachment).Error
		if err != nil {
			return err
		}
		// 写入last字段
		stage.Obj, _ = sjson.Set(stage.Obj, "last", attachment)
		// 上传JSON获取IPFS CID
		err, hashJSON := UploadJSON(stage.Obj)
		if err != nil {
			return err
		}
		// 更新数据
		stage.Attachment = hashJSON
	}
	raw := global.DB.Model(&model.Order{}).Where("order_id = ?", stage.OrderId).Updates(&stage.Order)
	if raw.RowsAffected == 0 {
		return errors.New("创建失败")
	}
	return raw.Error
}

// UpdatedProgress
// @description: 更新阶段状态
// @param: updatedProgress request.UpdatedProgressRequest
// @return:  err error
func UpdatedProgress(updatedProgress request.UpdatedProgressRequest) (err error) {
	err = blockchain.UpdatedProgress(updatedProgress.OrderId)
	return err
}
