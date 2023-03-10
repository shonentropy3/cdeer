import { Input, Select, Button, Checkbox, Col, Row, InputNumber, Modal } from "antd"
import { useEffect, useState } from "react";
import Computing_time from "../Computing_time";
import Image from "next/image"

const {TextArea} = Input
const { Option } = Select;
function ApplyTaskModal (props) {
   
    const { open, onCancel, submit, project, userContact, setUserContact, applyInfo, applyLoading } = props;

    let [icons, setIcons] = useState([
        { title: 'telegram', value: '', icon: "/icon/telegram.png" },
        { title: 'wechat', value: '', icon: "/icon/wechat.png" },
        { title: 'skype', value: '', icon: "/icon/skype.png" },
        { title: 'discord', value: '', icon: "/icon/discord.png" },
        { title: 'phone', value: '', icon: "/icon/whatsapp.png" }
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
        userContact = obj;
        setUserContact({...userContact});
    }

    useEffect(() => {
        for (const i in userContact) {
            icons.map(e => {
                if (i === e.title) {
                    e.value = userContact[i]
                }
            })
        }
        setIcons([...icons]);
        // icons.map(e => {

        // })
    },[])

    useEffect(()=>{
        if (applyInfo?.ID) {
            inner.desc = applyInfo.desc;
            inner.valuation = applyInfo.price / Math.pow(10,18)
            setInner({...inner})
        }
    },[applyInfo])


    return <Modal
            footer={null}
            open={open}
            onCancel={onCancel}
            className="modal-apply-task"
        >
            <div className="apply-task">
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
                    <InputNumber min={0} className="applyPrice" onChange={e => onchange(e, 'valuation')} value={inner.valuation}  keyboard={false} />
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
                                <div className="icon">
                                    <Image src={e.icon} width={38} height={38} />
                                </div>
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
            <Button loading={applyLoading} className="apply-task-btn" onClick={() => submit(inner)}>Sign up</Button>
        </div>
    </div>
    
    </Modal>
}
export default ApplyTaskModal;
