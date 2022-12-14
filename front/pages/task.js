import { Button, Empty, Input, message, Modal, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { deform_Count, deform_Skills } from "../utils/Deform";
import { useContracts } from "../controller";
import { ethers } from "ethers";
import { applyFor,cancelApply } from "../http/api/apply";
import TaskItem from "../components/CustomItem/taskItem";

import qs from 'querystring';
import withAuth from "./middleware";
import { searchTask } from "../http/_api/public";
import { getApplyList } from "../http/_api/task";

function Task() {

    const {TextArea} = Input
    const {Option} = Select
    const {useTaskContractWrite: Task} = useContracts("applyFor")
    const {useTaskContractWrite: celTask} = useContracts("cancelApply")
    
    let [who,setWho] = useState();
    let [selectData,setSelectData] = useState([])
    let [selectBar,setSelectBar] = useState('')
    let [isModal,setIsModal] = useState(false)
    let [pageConfig,setPageConfig] = useState({
        page: 1, pageSize: 5, total: 1
    })
    const sidbar = {
        issuer: [
            {title: 'Published items', value: 'tasks'},
            {title: 'Developping', value: 'developping'},
            {title: 'Finished', value: 'developend'},
        ],
        worker: [
            {title: 'Enrolling', value: 'apply'},
            {title: 'Developping', value: 'developping'},
            {title: 'Finished', value: 'developend'},
        ] 
    };
    

    let [modalInfo,setModaInfo] = useState({ contactName: 'telegram' })
    let [cancelInfo,setCancelInfo] = useState({})
    
    const router = useRouter()
    const { address } = useAccount();

    const changeItem = value => {
        router.push(`/task/?w=${who}&bar=${value}`)
    }


    const changeModal = (type,e) => {
        modalInfo[type] = e
        setModaInfo({...modalInfo})
        setIsModal(true)
    }

    const onchange = (e,type) => {
        modalInfo[type] = e
        setModaInfo({...modalInfo})
        console.log(modalInfo);
    }

    const cancelApplys = (type,e) => {
        cancelInfo[type] = e
        setCancelInfo({...cancelInfo})
        celTask.write({
            recklesslySetUnpreparedArgs:[
                Number(cancelInfo.taskId)
            ] 
        })
    }

    const celSuccess = () => {
        let data = {
            applyAddr: address,
            demandId: cancelInfo.taskId,
            hash: celTask.data.hash
        }
        cancelApply(data)
        .then(res => {
            message.success('取消报名成功')
        })
        .catch(err => {
            console.log(err);
        })
    }

    const modifyApply = () => {
        Task.write({
            recklesslySetUnpreparedArgs:[
                address,
                Number(modalInfo.demandId),
                ethers.utils.parseEther(`${modalInfo.valuation}`)
            ]
        })
    }

    const writeSuccess = () => {
        modalInfo.address = address;
        modalInfo.hash = Task.data.hash;
        applyFor({proLabel: JSON.stringify(modalInfo)})
        .then(res => {
            message.success('修改成功')
            setTimeout(() => {
                history.go(0);
            }, 500);
        })
        .catch(err=>{
            console.log(err);
        })
    }
// getApplyList 

    const init = () => {
        const { w, bar } = qs.parse(location.search.slice(1));
        who = w;
        setWho(who);

        selectBar = bar ? bar : sidbar[who][0].value;
        setSelectBar(selectBar)

        selectData = [];
        setSelectData([...selectData]);
    }

    // 获取发布的需求
    const getTasks = () => {
        searchTask({...pageConfig, issuer: address})
        .then(res => {
            if (res.code === 0) {
                pageConfig.total = res.data.total;
                setPageConfig({...pageConfig});
                selectData = res.data.list ? res.data.list : [];
                selectData.map(e => {
                    e.role = deform_Skills(e?.role || []);
                    e.budget = deform_Count(e.budget, e.currency)
                    console.log(e.role);
                })
                setSelectData([...selectData]);
            }
        })
    }

    // 获取报名的需求
    const getApplys = () => {
        getApplyList({
            ...pageConfig,
            apply_addr: address
        })
        .then(res => {
            const data = res.data.list;
            let arr = [];
            data.map(e => {
                e.task.role = deform_Skills(e.task.role);
                e.task.budget = deform_Count(e.task.budget, e.task.currency);
                arr.push(e.task);
            })
            selectData = arr;
            setSelectData([...selectData]);
        })
    }

    useEffect(()=>{
        Task.isSuccess ?
        writeSuccess()
        :
        ""
    },[Task.isSuccess])

    useEffect(()=>{
        celTask.isSuccess ?
        celSuccess() : ""
    },[celTask.isSuccess])


    useEffect(() => {
        // 根据选择的侧边栏显示右侧数据
        switch (selectBar) {
            case 'tasks':
                getTasks();
                break;
            case 'developping':
                console.log('查询进行中的');
                break;       
            case 'developend':
                console.log('查询结束的');
                break;
            case 'apply':
                getApplys();
                break;
            default:
                break;
        }
    },[selectBar, pageConfig.page])

    useEffect(() => {
        init()
    },[router])

    return (
        <div className="Userprojects">
            <div className="sidbar">
                {
                    who &&
                    sidbar[who].map((e,i) => 
                        <div
                            key={i} 
                            className={`li ${selectBar === e.value ? 'active':''}`}
                            onClick={() => changeItem(e.value)}
                            >
                            <p>
                                {e.title}
                                <span className="point" ></span>
                            </p>
                        </div>)
                }
            </div>
            <div className="content">
                <TaskItem taskList={selectData} select={selectBar} />
                {
                    selectData.length > 0 &&
                    <Pagination
                        className='item-pagination' 
                        pageSize={pageConfig.pageSize} 
                        current={pageConfig.page}
                        total={pageConfig.total}
                        onChange={(e) => {pageConfig.page = e, setPageConfig({...pageConfig})}}
                    />
                }
            </div>
            <Modal 
                open={isModal}
                onCancel={() => {setIsModal(false)}}
                footer={null}              
            >
                <p>报名信息</p>
                <p>你的报价</p>
                <Input onChange={(e) => onchange(e.target.value,"valuation")} />
                <Select defaultValue="1" disabled >
                    <Option value="1">ETH</Option>
                </Select>
                <p>自我推荐</p>
                <TextArea rows={4} onChange={(e) => onchange(e.target.value,"desc")}></TextArea>
                <p>联系方式</p>
                <Select defaultValue="telegram" onChange={(e) => onchange(e,'contactName')} >
                    <Option value="telegram">telegram</Option>
                    <Option value="wechat">wechat</Option>
                    <Option value="skype">skype</Option>
                </Select>
                <Input className="applyPrice" onChange={e => onchange(e.target.value,'contactValue')} />
                <Button onClick={()=>modifyApply()}>确认修改</Button>
            </Modal>   
        </div>
    )
}

export default withAuth(Task);