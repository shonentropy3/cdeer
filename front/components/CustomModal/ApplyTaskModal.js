import { Input, Select, Button, Checkbox, Col, Row, InputNumber } from "antd"
import { useEffect, useState } from "react";
import Computing_time from "../Computing_time";

const {TextArea} = Input
const { Option } = Select;
export default function ApplyTaskModal (props) {
   
    const { setParams, params, submit, project, userContact } = props;

    let [icons, setIcons] = useState([
        { title: 'telegram', value: '' },
        { title: 'wechat', value: '' },
        { title: 'skype', value: '' },
        { title: 'discord', value: '' },
        { title: 'phone', value: '' }
    ])

    let [inner,setInner] = useState({
        desc: '', valuation: ''
    });

    const onchange = (e,type) => {
        inner[type] = e;
        setInner({...inner});
    }

    const changeContact = (i,value) => {
        icons[i].value = value;
        setIcons([...icons]);

        // 赋值 返回params
        let obj = {};
        icons.map(e => {
            obj[e.title] = e.value;
        })
        params = obj;
        setParams({...params});
    }


    useEffect(()=>{
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
            <div className="apply-task-applyInfo-contact">
                <p>Contact information</p>
                <div className="icons">
                    {
                        icons.map((e,i) => 
                            <div className="item" key={i}>
                                <div className="icon"></div>
                                <Input
                                    value={e.value}
                                    onChange={e => changeContact(i,e.target.value)}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="apply-task-applyInfo-self">
                <p>Self recommendation</p>
                <TextArea className="apply-task-applyInfo-text" rows={4} onChange={e => onchange(e.target.value, 'desc')} value={inner.desc} />
            </div>
            <Button className="apply-task-btn" onClick={() => submit(inner)}>Sign up</Button>
        </div>
    </div>
}

