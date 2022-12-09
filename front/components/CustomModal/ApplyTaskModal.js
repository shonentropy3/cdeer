import { Input, Select, Button, Checkbox, Col, Row, InputNumber } from "antd"
import { useEffect, useState } from "react";
import Computing_time from "../Computing_time";

const {TextArea} = Input
const { Option } = Select;
export default function ApplyTaskModal (props) {
   
    const { setParams, params, submit, project, applyInfo, userContact } = props;

    let [inner,setInner] = useState({
        desc: '', valuation: ''
    });

    let [disabled,setDisabled] = useState({
        telegram: true,
        wechat: true,
        skype: true,
        discord: true,
        phone: true
    })
    let [infoValue,setInfoValue] = useState({
        telegramValue: '',
        wechatValue: '',
        skypeValue: '',
        discordValue: '',
        phoneValue: ''
    })

    const onchange = (e,type) => {
        inner[type] = e;
        setInner({...inner});
    }

    const changeDisabled = (e,title) => {
        disabled[e] = !disabled[e]
        setDisabled({...disabled})
    }

    const valueChange = (e,type) => {
        infoValue[type] = e
        setInfoValue({...infoValue})
    }

    useEffect(()=>{
        params.contact = infoValue;
        setParams({...params});
    },[infoValue])

    useEffect(()=>{
        if(applyInfo.price){
            params.valuation = applyInfo.price / Math.pow(10,18)
            params.desc = applyInfo.desc
            setParams({...params})
        }
        if(userContact){
            params.contact.telegramValue = userContact.telegram;
            params.contact.wechatValue = userContact.wechat;
            params.contact.skypeValue = userContact.skype;
            params.contact.discordValue = userContact.discord;
            params.contact.phoneValue = userContact.phone
            setParams({...params})
        }
    },[])

    return <div className="apply-task">
        <p className="apply-task-top">
            <span className="apply-task-top-text">Sign up for this Task</span>
        </p>
        <div className="apply-detail">
            <div className="detail-img"></div>
            <div className="detail-info">
                <p className="info-title">{project.title}</p>
                <div className="info-content">
                    <div className="bte">
                        <i className="iconfont time-icon">&#xe6c2;</i>
                        <Computing_time create_time={project.created_at} />
                    </div>
                    <p>
                        cycle: {project.period / 24 / 60 / 60}
                    </p>
                </div>
                <p className="info-role">
                    Recruitment type: {
                        project.role.map((e,i) => <span key={i}>{e}</span> )
                    }
                </p>
            </div>  
            <p className="cost">Cost: <span>{project.budget}{project.currency}</span></p>
        </div>
        <div className="apply-task-applyInfo">
            <p className="apply-task-applyInfo-title">Registration information</p>
            <div className="apply-task-applyInfo-priceAndtime">
                <div className="apply-task-applyInfo-price">
                    <p>Give your quotation</p>
                    <InputNumber className="applyPrice" onChange={e => onchange(e, 'valuation')} value={inner.valuation}  keyboard={false} />
                    <Select className="applyCurrency" defaultValue="ETH" disabled >
                        <Option value="ETH">ETH</Option>
                    </Select>
                </div>
                <div className="apply-task-applyInfo-time">
                    <p>Estimated completion time</p>
                    <Input />
                    <Select defaultValue="1" disabled>
                        <Option value="1">DAY</Option>
                    </Select>
                </div>
            </div>
            {/* <div className="apply-task-applyInfo-contact">
                <p>Contact information</p>
                <Checkbox.Group>
                    <Row 
                        justify="cetenr"
                        align="middle"
                        className="clearfix"
                    >
                        <Col className="row">
                            <Checkbox 
                                value="telegram" 
                                onChange={(e)=>changeDisabled(e.target.value, 'telegram')}
                            ><span className="iconfont telegram">&#xec25;</span></Checkbox>
                            <Input 
                                disabled={disabled.telegram} 
                                value={infoValue.telegramValue} 
                                onChange={(e)=>valueChange(e.target.value,"telegramValue")}
                            />
                        </Col>
                        <Col className="row">
                            <Checkbox
                                value="wechat" 
                                onChange={(e)=>changeDisabled(e.target.value, 'wechat')}
                            ><span className="iconfont wechat">&#xec26;</span></Checkbox>
                            <Input 
                                disabled={disabled.wechat} 
                                value={infoValue.wechatValue} 
                                onChange={(e)=>valueChange(e.target.value,"wechatValue")} 
                            />
                        </Col>
                        <Col className="row">
                            <Checkbox 
                                value="skype" 
                                onChange={(e)=>changeDisabled(e.target.value, 'skype')}
                            ><span className="iconfont skype">&#xe882;</span></Checkbox>
                            <Input 
                                disabled={disabled.skype} 
                                value={infoValue.skypeValue}
                                onChange={(e)=>valueChange(e.target.value,"skypeValue")}
                            />
                        </Col>
                        <Col className="row">
                            <Checkbox 
                                value="discord" 
                                onChange={(e)=>changeDisabled(e.target.value, 'discord')}
                            ><span className="iconfont discord">&#xe60b;</span></Checkbox>
                            <Input 
                                disabled={disabled.discord} 
                                value={infoValue.discordValue}
                                onChange={(e)=>valueChange(e.target.value,"discordValue")}
                            />
                        </Col>
                        <Col className="row">
                            <Checkbox 
                                value="phone" 
                                onChange={(e)=>changeDisabled(e.target.value, 'phone')}
                            ><span className="iconfont phone">&#xe8be;</span></Checkbox>
                            <Input 
                                disabled={disabled.phone} 
                                value={infoValue.phoneValue}
                                onChange={(e)=>valueChange(e.target.value,"phoneValue")}
                            />
                        </Col>
                    </Row>
                </Checkbox.Group>
            </div> */}
            <div className="apply-task-applyInfo-self">
                <p>Self recommendation</p>
                <TextArea className="apply-task-applyInfo-text" rows={4} onChange={e => onchange(e.target.value, 'desc')} value={inner.desc} />
            </div>
            <Button className="apply-task-btn" onClick={() => submit(inner)}>Sign up</Button>
        </div>
    </div>
}

