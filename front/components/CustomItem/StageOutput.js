import { Button } from "antd";
import { useEffect, useState } from "react";
import { getDate } from "../../utils/getDate";


export default function StageOutput(params) {
    
    const { data, index, edit, remove, isEdit, ongoing, stageIndex, who, updateDelivery, confirmDelivery } = params;
    let [isOpen, setIsOpen] = useState(false);


    const switchStatus = () => {
        if (stageIndex === index) {
            // 正在进行的阶段
            return <div className="status ongoing">Ongoing</div>
        }else if(stageIndex > index) {
            // 已经完成的阶段 
            return <div className="status completed">Completed</div>
        }else{
            // 待开始
            return <div className="status wait">To be started</div>
        }
    }

    const switchBtns = () => {
        if (who === "issuer") {
            // 甲方
            return  <div className="btns">
                    <Button>Delay</Button>
                    <Button>Abort</Button>
                    <Button onClick={() => confirmDelivery()}>Comfirm</Button>
                </div>
        }else{
            // 乙方
            return  <div className="btns">
                    <Button>Delay</Button>
                    <Button>Abort</Button>
                    <Button onClick={() => updateDelivery()}>Submit</Button>
                </div>
        }
    }

    useEffect(() => {
        if (ongoing && (index === stageIndex)) {
            // 正在进行中
            setIsOpen(true)
        }
    },[ongoing])

    return <div className="itemCard">
        <div className="itemCard-nav">
            <p className="nav-index">P{index+1}</p>
            <p className="nav-title">{data.name}</p>
            {
                // 项目正在进行中 ==>
                ongoing && switchStatus()
            }
            {
                (!isEdit || isEdit === "block") &&
                    <div className="operate">
                        <div className="edit" onClick={() => edit(`item-${index+1}`)}></div>
                        <div className="remove" onClick={() => remove(`item-${index+1}`)}></div>
                    </div>
            }
        </div>
        <div className={`itemCard-content ${isOpen ? 'open' : ''}`}>
            <p className="container">
                <span>Delivery duration:</span>
                {data.period}day
            </p>
            <p className="container">
                <span>Delivery date:</span>
                {
                    getDate(
                        new Date().getTime() + (data.deliveryDate * 24 * 60 * 60 * 1000), 'd'
                    )
                }
            </p>
            <p className="container">
                <span>Stage cost:</span>
                {data.amount}
            </p>
            <div className="container">
                <span>Delivery instructions:</span>
                <p>{data.desc}</p>
            </div>
            <div className="arrow" onClick={() => setIsOpen(!isOpen)}></div>
            {   
                //  项目可选按钮
                ongoing && index === stageIndex && switchBtns()
            }
        </div>
    </div>
}