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
	"github.com/tidwall/gjson"
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
	if searchInfo.OrderId != 0 && len(orderList) == 1 && orderList[0].Attachment != "" {
		url := fmt.Sprintf("http://ipfs.learnblockchain.cn/%s", orderList[0].Attachment)
		orderList[0].StageJson, err = utils.GetRequest(url)
		if err != nil {
			return err, orderList, total
		}
		// WaitProlongAgree 状态需要 返回原始数据
		if orderList[0].Status == "WaitProlongAgree" || orderList[0].Status == "WaitAppendAgree" {
			global.DB.Model(&model.OrderFlow{}).Select("stages").Where("order_id = ? AND status = 'IssuerAgreeStage' AND del = 0", orderList[0].OrderId).Order("level desc").First(&orderList[0].LastStages)
		}
		// WaitAppendAgree 状态需要 返回原始数据
		if orderList[0].Status == "WaitAppendAgree" {
			global.DB.Model(&model.OrderFlow{}).Select("obj").Where("order_id = ? AND status = 'IssuerAgreeStage' AND del = 0", orderList[0].OrderId).Order("level desc").First(&orderList[0].LastStageJson)
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
// @description: 更新阶段划分
// @param: stage request.UpdatedStageRequest
// @return: err error
func UpdatedStage(stage request.UpdatedStageRequest, address string) (err error) {
	// TODO: 权限控制
	// 保存交易Hash
	runBool, err := storeHash(stage.Hash, stage.Status, address)
	if err != nil {
		return err
	}
	if runBool {
		return nil
	}
	// 查询当前记录
	var order model.Order
	if err = global.DB.Model(&model.Order{}).Where("order_id = ?", stage.OrderId).First(&order).Error; err != nil {
		return err
	}
	// 查询level
	var level uint
	if err = global.DB.Model(&model.OrderFlow{}).Select("level").Where("order_id = ?", stage.OrderId).Order("level desc").First(&level).Error; err != nil {
		return err
	}
	// 查询日志记录
	var orderFlowTop model.OrderFlow
	if err = global.DB.Model(&model.OrderFlow{}).Where("order_id = ? AND del = 0", stage.OrderId).Order("level desc").First(&orderFlowTop).Error; err != nil {
		return err
	}
	// 状态流转 校验正确性
	if stage.Status != "WaitWorkerStage" && order.Status != stage.Status {
		err = statusValid(order.Status, stage.Status, stage)
		if err != nil {
			return err
		}
	}
	// rollback操作
	err, okRun := rollbackStatus(order.Status, stage.Status, stage)
	if err != nil {
		return err
	}
	if okRun {
		return nil
	}
	// 需要更新Obj
	if stage.Obj != "" && gjson.Get(orderFlowTop.Obj, "stages").String() != gjson.Get(stage.Obj, "stages").String() {
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
	} else {
		fmt.Println("相同不需操作")
	}
	// 更新Order表
	raw := global.DB.Model(&model.Order{}).Where("order_id = ?", stage.OrderId).Updates(&stage.Order)
	if raw.RowsAffected == 0 || raw.Error != nil {
		return errors.New("创建失败")
	}
	// 插入日志表
	orderFlow := model.OrderFlow{OrderId: stage.OrderId, Signature: stage.Signature, SignAddress: stage.SignAddress, SignNonce: stage.SignNonce}
	orderFlow.Level = orderFlowTop.Level + 1 // 节点
	orderFlow.Status = stage.Status          // 阶段状态
	orderFlow.Operator = address             // 操作人
	orderFlow.Obj = stage.Obj                // 阶段详情交付物JSON
	orderFlow.Stages = stage.Stages          // 阶段划分JSON
	orderFlow.Attachment = stage.Attachment  // JSON IPFS
	if stage.Attachment == "" {
		orderFlow.Attachment = orderFlowTop.Attachment // JSON IPFS
	}
	if err = global.DB.Model(&model.OrderFlow{}).Create(&orderFlow).Error; err != nil {
		return err
	}

	return nil
}

func rollbackStatus(old string, new string, stage request.UpdatedStageRequest) (err error, okRun bool) {
	statusMap := map[string][]string{"WaitProlongAgree": {"DisagreeProlong", "IssuerAgreeStage"}, "WaitAppendAgree": {"DisagreeAppend", "IssuerAgreeStage"}}
	// 校验阶段状态流转
	status, ok := statusMap[old]
	if !ok {
		return nil, okRun
	}
	if utils.SliceIsExist(status, new) {
		rollMap := map[string]string{"DisagreeProlong": "IssuerAgreeStage", "DisagreeAppend": "IssuerAgreeStage"}
		rollStatus, ok := rollMap[new]
		if !ok {
			return nil, okRun
		}
		// 获取回滚信息
		var orderFlow model.OrderFlow
		err = global.DB.Model(&model.OrderFlow{}).Where("order_id = ? AND status = ? AND del = 0", stage.OrderId, rollStatus).Order("level desc").First(&orderFlow).Error
		if err != nil {
			return err, okRun
		}
		// 回滚操作
		order := map[string]interface{}{"attachment": orderFlow.Attachment, "stages": orderFlow.Stages, "Status": orderFlow.Status, "signature": orderFlow.Signature, "sign_address": orderFlow.SignAddress, "sign_nonce": orderFlow.SignNonce}
		raw := global.DB.Model(&model.Order{}).Where("order_id = ?", stage.OrderId).Updates(&order)
		if raw.RowsAffected == 0 {
			return errors.New("回滚失败"), okRun
		}
		if raw.Error != nil {
			return err, okRun
		}
		// 删除过程信息
		if err = global.DB.Model(&model.OrderFlow{}).Where("order_id = ? AND level > ?", stage.OrderId, orderFlow.Level).Update("del", 1).Error; err != nil {
			return err, okRun
		}
		return nil, true
	}
	return nil, okRun
}

// statusValid 校验阶段状态流转
func statusValid(old string, new string, stage request.UpdatedStageRequest) (err error) {
	// 状态正确性
	if !utils.SliceIsExist([]string{"WaitWorkerStage", "WaitIssuerAgree", "IssuerAgreeStage", "WaitWorkerConfirmStage", "WorkerAgreeStage", "WaitProlongAgree", "AgreeProlong", "DisagreeProlong", "WaitAppendAgree", "AgreeAppend", "DisagreeAppend"}, new) {
		return errors.New("状态错误")
	}
	// 需要验证链上状态
	if utils.SliceIsExist([]string{"AgreeProlong", "AgreeAppend"}, new) && stage.Hash == "" {
		return errors.New("hash不能为空")
	}
	statusMap := map[string][]string{"WaitWorkerStage": {"WaitIssuerAgree"}, "WaitIssuerAgree": {"IssuerAgreeStage", "WaitWorkerConfirmStage"}, "WaitWorkerConfirmStage": {"WorkerAgreeStage", "WaitIssuerAgree"}, "WorkerAgreeStage": {"IssuerAgreeStage"}, "IssuerAgreeStage": {"WaitProlongAgree", "WaitAppendAgree", "AbortOrder"}, "WaitProlongAgree": {"AgreeProlong", "DisagreeProlong", "IssuerAgreeStage"}, "WaitAppendAgree": {"AgreeAppend", "DisagreeAppend", "IssuerAgreeStage"}}
	// 校验阶段状态流转
	status, ok := statusMap[old]
	if !ok {
		return errors.New("状态流转不存在")
	}
	if !utils.SliceIsExist(status, new) {
		return errors.New("状态流转错误")
	}
	return nil
}

func storeHash(hash string, status string, address string) (runBool bool, err error) {
	if hash == "" {
		return runBool, nil
	}
	if status == "AgreeProlong" {
		runBool = true
		transHash := model.TransHash{SendAddr: address, EventName: "ProlongStage", Hash: hash}
		if err = SaveHash(transHash); err != nil {
			return runBool, errors.New("操作失败")
		}
	} else if status == "AgreeAppend" {
		runBool = true
		transHash := model.TransHash{SendAddr: address, EventName: "AppendStage", Hash: hash}
		if err = SaveHash(transHash); err != nil {
			return runBool, errors.New("操作失败")
		}
	}
	return runBool, nil
}

// UpdatedProgress
// @description: 更新阶段状态
// @param: updatedProgress request.UpdatedProgressRequest
// @return:  err error
func UpdatedProgress(updatedProgress request.UpdatedProgressRequest) (err error) {
	err = blockchain.UpdatedProgress(updatedProgress.OrderId)
	return err
}
