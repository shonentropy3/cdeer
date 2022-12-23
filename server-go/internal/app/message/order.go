package message

import (
	"bytes"
	"code-market-admin/internal/app/global"
	"code-market-admin/internal/app/model"
	"strings"
	"text/template"
)

//	func TaskCreated(task model.Task) error {
//		Template("TaskCreated", task)
//		return nil
//	}

func Template(status string, variable any, issuer string, worker string) (err error) {
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
		if err = messageSend(issuer, worker, tpl.String()); err != nil {
			return err
		}
		if err = messageSend(worker, issuer, tpl.String()); err != nil {
			return err
		}
		return nil
	}
	// 发送甲方
	if strings.TrimSpace(msgTmpl.Issuer) != "" {
		var tpl bytes.Buffer
		tmpl, err := template.New("tpl").Parse(msgTmpl.Issuer)
		err = tmpl.Execute(&tpl, variable)
		if err != nil {
			return err
		}
		if err = messageSend(worker, issuer, tpl.String()); err != nil {
			return err
		}
		return nil
	}
	// 发送乙方
	if strings.TrimSpace(msgTmpl.Worker) != "" {
		var tpl bytes.Buffer
		tmpl, err := template.New("tpl").Parse(msgTmpl.Worker)
		err = tmpl.Execute(&tpl, variable)
		if err != nil {
			return err
		}
		if err = messageSend(issuer, worker, tpl.String()); err != nil {
			return err
		}
		return nil
	}

	return nil
}

// messageSend 发送消息
func messageSend(form string, to string, msg string) (err error) {
	// 获取收件人
	var sendID uint
	if form != "" {
		if err = global.DB.Model(&model.User{}).Select("id").Where("address = ?", form).First(&sendID).Error; err != nil {
			return err
		}
	}

	// 获取发件人
	var recID uint
	if to != "" {
		if err = global.DB.Model(&model.User{}).Select("id").Where("address = ?", to).First(&recID).Error; err != nil {
			return err
		}
	}
	db := global.DB.Model(&model.Message{})
	message := model.Message{SendID: sendID, RecID: recID, Message: msg}
	return db.Create(&message).Error
}
