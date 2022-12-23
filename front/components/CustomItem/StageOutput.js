import { Button } from "antd";
import { useEffect, useState } from "react";
import { getDate } from "../../utils/GetDate";


export default function StageOutput(params) {
    
    const { data, index, edit, remove, isEdit, ongoing, stageIndex, who, updateDelivery, confirmDelivery, updateProlong, confirmProlong, rejectProlong, confirmAppend, rejectAppend, setActiveIndex, status, sign_address, address, Order, loading, withdraw, abort } = params;
    let [isOpen, setIsOpen] = useState(false);
    let [detail, setDetail] = useState();
    let [last, setLast] = useState(false);

    let [delevery, setDelevery] = useState();
    // 延长
    const checkProlong = () => {
        setActiveIndex(index);
        updateProlong(true);
    }

    // 交付
    const checkDelivery = () => {
        setActiveIndex(index);
        updateDelivery(true);
    }

    const switchStatus = () => {
        if (stageIndex === index && data.status === 0) {
            // 正在进行的阶段
            return <div className="status ongoing">Ongoing</div>
        }else if(stageIndex > index || data.status === 1 || data.status === 3) {
            // 已经完成的阶段 
            return <div className="status completed">Completed</div>
        }else if(data.status === 2){
            // 已经完成的阶段 
            return <div className="status abort">Abort</div>
        }else{
            // 待开始
            return <div className="status wait">To be started</div>
        }
    }

    const handle = () => {
        return <>
            <div className="content">
                <div className="icon"></div>
                <div className="handle">
                    <p>Party A applies for {Order.last_stages.period[stageIndex] - Order.stages.period[stageIndex]} days extension.</p>
                    <div className="date">
                        <span className="old">
                        {
                            getDate(
                                new Date().getTime() + (Order.stages.period[stageIndex] * 24 * 60 * 60 * 1000), 'd'
                            )
                        }
                        </span>
                        <div className="icon"></div>
                        <span className="new">
                        {
                            getDate(
                                new Date().getTime() + (Order.last_stages.period[stageIndex] * 24 * 60 * 60 * 1000), 'd'
                            )
                        }
                        </span>
                    </div>
                </div>
            </div>
            <div className="btns">
                <Button disabled={loading} className="abort" onClick={() => rejectProlong()}>Refuse</Button>
                <Button loading={loading} className="permit" onClick={() => confirmProlong()}>Agree</Button>
            </div>
        </>
    }

    // issuer判断
    const isEventIssuer = () => {
        if (status === "WaitProlongAgree") {
            return <div className="event">
                {/* 是否是本人发的申请 */}
                {
                    sign_address === address ? 
                    <>
                    <div className="content">
                        <div className="icon"></div>
                        <p className="wait">You submitted the Application for Extension and waited for Party Bs consent.</p>
                    </div>
                    <div className="btns">
                        <Button loading={loading} className="abort" onClick={() => abort()}>Abort</Button>
                        <Button className="permit" loading={loading} onClick={() => confirmDelivery()}>Comfirm</Button>
                    </div>
                    </>
                    :
                    handle()
                }
            </div>
        }else{
            return <div className="btns">
                <Button className="delay" onClick={() => checkProlong()}>Delay</Button>
                <Button loading={loading} className="abort" onClick={() => abort()}>Abort</Button>
                <Button className="permit" loading={loading} onClick={() => confirmDelivery()}>Comfirm</Button>
            </div>
        }
    }

    const isEventWorker = () => {
        if (status === "WaitProlongAgree") {
            return <div className="event">
                {/* 是否是本人发的申请 */}
                {
                    sign_address === address ? 
                    <>
                    <div className="content">
                        <div className="icon"></div>
                        <p className="wait">You submitted the Application for Extension and waited for Party Bs consent.</p>
                    </div>
                    <div className="btns">
                        <Button loading={loading} className="abort" onClick={() => abort()}>Abort</Button>
                        <Button className="permit" onClick={() => checkDelivery()}>
                            {
                                Order.stage_json.stages[index].delivery.attachment ? "Resubmit" : "Submit"
                            }
                        </Button>
                    </div>
                    </>
                    :
                    handle()
                }
            </div>
        }else{
            return <div className="btns">
                <Button className="delay" onClick={() => checkProlong()}>Delay</Button>
                <Button loading={loading} className="abort" onClick={() => abort()}>Abort</Button>
                <Button className="permit" onClick={() => checkDelivery()}>
                    {
                        Order.stage_json.stages[index].delivery.attachment ? "Resubmit" : "Submit"
                    }
                </Button>
            </div>
        }
    }

    const switchBtns = () => {
            if (who === "issuer") {
                // 甲方
                return isEventIssuer()
            }else{
                // 乙方
                return isEventWorker()
            }
    }

    const switchAppendBtns = () => {
        if (address === Order.sign_address) {
            return <div className="event">
                    <div className="content">
                        <div className="icon"></div>
                        <p className="wait">You submitted the Application for Extension and waited for Party Bs consent.</p>
                    </div>
            </div>
        }else{
            // 同意阶段新增
            return <div className="event">
                    <div className="content">
                        <div className="icon"></div>
                        <p className="wait">You submitted the Application for Extension and waited for Party Bs consent.</p>
                    </div>
                    <div className="btns">
                        <Button disabled={loading} className="abort" onClick={() => rejectAppend()}>Refuse</Button>
                        <Button loading={loading} className="permit" onClick={() => confirmAppend()}>Agree</Button>
                    </div>
            </div>
        }
    }

    const submitBox = () => {
        if (who === "issuer") {
            return "The developer submitted"
        }else{
            return "You submitted"
        }
    }

    useEffect(() => {
        if (ongoing && (index === stageIndex)) {
            // 正在进行中
            setIsOpen(true)
        }
    },[ongoing])

    useEffect(() => {
        if (data && !detail) {
            detail = data;
            setDetail({...detail});
        }
    },[data])

    useEffect(() => {
        // 新增阶段
        if (index === Order?.last_stage_json?.stages?.length) {
            setIsOpen(true);
            setLast(true);
        }
        // 初始化交付数据 || 已完成
        if (Order?.stage_json.stages[index].delivery.attachment) {
            // 乙方交付过当前阶段
            delevery = Order.stage_json.stages[index].delivery;
            setDelevery({...delevery})
        }
    },[])

    return <div className="itemCard">
        <div className="itemCard-nav">
            {
                !last ? 
                <p className="nav-index">P{index+1}</p>
                :
                <p className="new-nav-index">New stage</p>
            }
            
            <p className="nav-title">{detail?.name}</p>
            {
                // 项目正在进行中 ==>
                ongoing && !last && switchStatus()
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
                {detail?.period}day
            </p>
            <p className="container">
                <span>Delivery date:</span>
                {
                    getDate(
                        new Date().getTime() + (detail?.deliveryDate * 24 * 60 * 60 * 1000), 'd'
                    )
                }
            </p>
            <p className="container">
                <span>Stage cost:</span>
                {detail?.amount}
            </p>
            <div className="container">
                <span>Delivery instructions:</span>
                <p>{detail?.desc}</p>
            </div>
            <div className="arrow" onClick={() => setIsOpen(!isOpen)}></div>
            {
                // 是否交付过
                delevery && 
                <div className="delivery">
                    <p className="delivery-title">{submitBox()}</p>
                    <div className="delivery-content">
                        {/* 是否上传了文件 */}
                        {
                            delevery.attachment && 
                            <div className="item">
                                <span>File: </span>
                                <a 
                                href={`${process.env.NEXT_PUBLIC_DEVELOPMENT_FILE}/${delevery.attachment}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                >
                                    {delevery.fileType}
                                </a>
                            </div>
                        }
                        <div className="item">
                            <span>Description: </span>
                            <div className="content">
                                {delevery.content}
                            </div>
                        </div>
                    </div>
                </div>
            }
            {   
                //  项目可选按钮
                ongoing && index === stageIndex && data.status === 0 && switchBtns()
            }
            {
                // 同意、拒绝 新增
                last &&
                switchAppendBtns()
            }
            {
                // 判断当前阶段是否已经完成
                stageIndex > index && who === "worker" &&
                <div className="event">
                    <div className="content">
                        <div className="icon"></div>
                        <p className="wait" style={{color: "#1F1E2E"}}>The demander has paid the P{index+1} fee, go to withdraw</p>
                    </div> 
                    <div className="btns">
                        <Button style={{width: "auto"}} loading={loading} className="permit" onClick={() => withdraw()}>Withdraw money</Button>
                    </div>
                </div>
            }
        </div>
    </div>
}