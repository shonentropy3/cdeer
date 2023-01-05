package message

import (
	"bytes"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"code-market-admin/internal/app/utils"
	"gorm.io/gorm"
	"strings"
	"text/template"
)

func Template(status string, variable map[string]interface{}, issuer string, worker string, sender string) (err error) {
	issuerInfo, workerInfo, err := getUserInfo(issuer, worker)
	if err != nil {
		return err
	}

	var msgTmpl model.MessageTmpl
	if err = global.DB.Model(&model.MessageTmpl{}).Where("status = ?", status).First(&msgTmpl).Error; err != nil {
		return err
	}
	// 发送通用模版
	if strings.TrimSpace(msgTmpl.Common) != "" {
		var tpl bytes.Buffer
		tmpl, err := template.New("tpl").Parse(msgTmpl.Common)
		err = tmpl.Execute(&tpl, variable)
		if err != nil {
			return err
		}
		// 发送消息
		if err = messageSend(0, workerInfo.ID, tpl.String()); err != nil {
			return err
		}
		if err = messageSend(0, issuerInfo.ID, tpl.String()); err != nil {
			return err
		}
		return nil
	}
	// 发送甲方
	if strings.TrimSpace(msgTmpl.Issuer) != "" && (sender == "" || sender == worker) {
		var tpl bytes.Buffer
		tmpl, err := template.New("tpl").Parse(msgTmpl.Issuer)
		variable = utils.MapPushStruct(variable, []any{workerInfo})
		err = tmpl.Execute(&tpl, variable)
		if err != nil {
			return err
		}
		if err = messageSend(workerInfo.ID, issuerInfo.ID, tpl.String()); err != nil {
			return err
		}
	}
	// 发送乙方
	if strings.TrimSpace(msgTmpl.Worker) != "" && (sender == "" || sender == issuer) {
		var tpl bytes.Buffer
		tmpl, err := template.New("tpl").Parse(msgTmpl.Worker)
		variable = utils.MapPushStruct(variable, []any{issuerInfo})
		err = tmpl.Execute(&tpl, variable)
		if err != nil {
			return err
		}
		if err = messageSend(issuerInfo.ID, workerInfo.ID, tpl.String()); err != nil {
			return err
		}
	}

	return nil
}

// getUserInfo 获取双方用户信息
func getUserInfo(form string, to string) (sendInfo model.User, recInfo model.User, err error) {
	// 获取用户1
	if form != "" {
		if err = global.DB.Model(&model.User{}).Where("address = ?", form).First(&sendInfo).Error; err != nil {
			// 不存在则新增
			if err == gorm.ErrRecordNotFound {
				sendInfo.Address = form
				if err = global.DB.Model(&model.User{}).Save(&sendInfo).Error; err != nil {
					return sendInfo, recInfo, err
				}
			} else {
				return sendInfo, recInfo, err
			}
		}
	}
	if sendInfo.Username == nil && len(sendInfo.Address) > 5 {
		username := sendInfo.Address[:4] + "...." + sendInfo.Address[len(sendInfo.Address)-4:]
		sendInfo.Username = &username
	}

	// 获取用户2
	if to != "" {
		if err = global.DB.Model(&model.User{}).Where("address = ?", to).First(&recInfo).Error; err != nil {
			// 不存在则新增
			if err == gorm.ErrRecordNotFound {
				recInfo.Address = to
				if err = global.DB.Model(&model.User{}).Save(&recInfo).Error; err != nil {
					return sendInfo, recInfo, err
				}
			} else {
				return sendInfo, recInfo, err
			}
		}
	}
	if recInfo.Username == nil && len(recInfo.Address) > 5 {
		username := recInfo.Address[:4] + "...." + recInfo.Address[len(recInfo.Address)-4:]
		recInfo.Username = &username
	}
	return sendInfo, recInfo, nil
}

// messageSend 发送消息
func messageSend(sendID uint, recID uint, msg string) (err error) {
	db := global.DB.Model(&model.Message{})
	message := model.Message{SendID: sendID, RecID: recID, Message: msg}
	return db.Create(&message).Error
}
