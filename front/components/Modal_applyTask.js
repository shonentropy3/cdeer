import { Input, Select, Button, Checkbox, Col, Row } from "antd"
import { useEffect, useState } from "react";

const {TextArea} = Input
const { Option } = Select;
export default function Modal_applyTask (props) {
   
    const { setParams, params, submit, project } = props;


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
        params[type] = e;
        setParams({...params});
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

    return <div className="apply-task">
        <p className="apply-task-top">
            <span className="apply-task-top-text">Sign up for this Task</span>
        </p>
        <div className="apply-task-detail">
            <div className="apply-task-img"></div>
            <div className="apply-task-detail-info">
                <p className="apply-task-detail-title">
                    <span>{project.title}</span>
                </p>
                <p className="apply-task-detail-time">
                    <span className="apply-task-detail-time-ago">
                        <i className="iconfont time-icon">&#xe6c2;</i>
                        Issued 10 hours ago
                    </span>
                    <span className="apply-task-detail-time-cycle">
                        cycle: 
                        <i>{project.period / 86400}days</i>
                    </span>
                </p>
                <p className="apply-task-detail-skill">
                    <span className="apply-task-detail-skill-title">Recruitment type：</span>
                    <span className="apply-task-detail-skill-li">
                        {
                            project.role?.map((e,i)=>(
                                <span key={i}>{e}</span>
                            ))
                        }
                    </span>
                </p>
            </div>
            <div className="apply-task-detail-cost">
                <p>
                    Cost: 
                    <span>{project.budget / 1000000000000000000}ETH</span>
                </p>
            </div>
        </div>

        <div className="apply-task-applyInfo">
            <p className="apply-task-applyInfo-title">Registration information</p>
            <div className="apply-task-applyInfo-priceAndtime">
                <div className="apply-task-applyInfo-price">
                    <p>Give your quotation</p>
                    <Input className="applyPrice" onChange={e => onchange(e.target.value,'valuation')} />
                    <Select className="applyCurrency" defaultValue="1" onChange={(e) => onchange(e,'currency')} disabled >
                        <Option value="1">ETH</Option>
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
            <div className="apply-task-applyInfo-contact">
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
            </div>
            <div className="apply-task-applyInfo-self">
                <p>Self recommendation</p>
                <TextArea className="apply-task-applyInfo-text" rows={4} onChange={e => onchange(e.target.value,'desc')} />
            </div>
            <Button className="apply-task-btn" onClick={() => submit()}>Sign up</Button>
        </div>
    </div>
}

