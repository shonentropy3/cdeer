import { Button, Empty, Input, message, Modal, Pagination, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { deform_Count, deform_Skills } from "../../utils/Deform";
import { useContracts } from "../../controller";
import { ethers } from "ethers";
import { applyFor,cancelApply } from "../../http/api/apply";
import TaskItem from "../../components/CustomItem/TaskItem";

import qs from 'querystring';
import { hashPending, searchTask } from "../../http/_api/public";
import { Modal_ModifyTask } from "../../components/Modal_modifyTask.js";
import { getApplyList } from "../../http/_api/task";
import { getOrderFinish, getOrderList } from "../../http/_api/order";
import { useRequest } from "ahooks";

function Userprojects() {

    const {TextArea} = Input
    const {Option} = Select
    const {useTaskContractWrite: Task} = useContracts("applyFor")
    const {useTaskContractWrite: celTask} = useContracts("cancelApply")
    
    let [who,setWho] = useState();
    let [selectData,setSelectData] = useState([])
    let [selectBar,setSelectBar] = useState('')
    let [isModal,setIsModal] = useState(false)
    let [showModifyTaskModal,setShowModifyTaskModal] = useState(false)
    let [pageConfig,setPageConfig] = useState({
        page: 1, pageSize: 3, total: 1
    })
    let [isLoading,setIsLoading] = useState(false);
    let [skeletonHash, setSkeletonHash] = useState();

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
    let [changeTaskInfo,setChangeTaskInfo] = useState()
    
    const router = useRouter()
    const { address } = useAccount();

    // ??????
    let polling = useRef();

    const awaitRun = async() => {
        polling.current = setInterval(() => {
            hashPending({hash: skeletonHash?.hash})
            .then(res => {
                if (res.code === 0 && res.data === 2) {
                    // ????????????
                    clearInterval(polling.current);
                    let arr = router.asPath.split('&');
                    let href = arr[0] + "&" + arr[1];
                    router.push(href);
                }
            })
        }, 1000);
    }

    const changeItem = value => {
        router.push(`/user/projects?w=${who}&bar=${value}`)
    }

    const changeModal = (type,e) => {
        modalInfo[type] = e
        setModaInfo({...modalInfo})
        setIsModal(true)
    }

    const onchange = (e,type) => {
        modalInfo[type] = e
        setModaInfo({...modalInfo})
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
            message.success('??????????????????')
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
            message.success('????????????')
            setTimeout(() => {
                history.go(0);
            }, 500);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const init = () => {
        const { w, bar, hash } = qs.parse(location.search.slice(1));
        // ????????????????????? ==> bar 
        skeletonHash = {hash: hash, bar: bar};
        setSkeletonHash({...skeletonHash});
        if (w) {
            who = w;
            setWho(who);
                
            if (selectBar !== bar){
                selectData = [];
                setSelectData([...selectData]);
            }
            selectBar = bar ? bar : sidbar[who][0].value;
            setSelectBar(selectBar)
    
            pageConfig.page = 1;
            setPageConfig({...pageConfig});
        }
    }

    // ?????????????????????
    const getTasks = () => {
        searchTask({...pageConfig, issuer: address})
        .then(res => {
            if (res.code === 0) {
                pageConfig.total = res.data.total;
                setPageConfig({...pageConfig});
                selectData = res.data.list ? res.data.list : [];
                selectData.map(e => {
                    e.role = deform_Skills(e?.role || []);
                    // e.budget = deform_Count(e.budget, e.currency)
                    e.budget = e.budget / Math.pow(10,18)
                })
                setSelectData([...selectData]);
            }
        })
    }

    // ?????????????????????
    const getApplys = () => {
        getApplyList({
            ...pageConfig,
            apply_addr: address
        })
        .then(res => {
            const data = res.data.list;
            let arr = [];
            pageConfig.total = res.data.total;
            setPageConfig({...pageConfig});
            data.map(e => {
                e.task.role = deform_Skills(e.task.role);
                e.task.budget = deform_Count(e.task.budget, e.task.currency);
                arr.push(e.task);
            })
            selectData = arr;
            setSelectData([...selectData]);
        })
    }

    // ????????????????????????????????????
    const getDevelopping = (who) => {
        let obj = {...pageConfig, state: 0};
        obj[who] = address;
        getOrderList(obj)
        .then(res => {
            if (res.code === 0) {
                pageConfig.total = res.data.total;
                setPageConfig({...pageConfig});
                selectData = res.data.list ? res.data.list : [];
                selectData.map(e => {
                    e.task.role = deform_Skills(e.task?.role || []);
                    e.task.budget = deform_Count(e.task.budget, e.task.currency)
                })
                setSelectData([...selectData]);
            }
        })
    }

    // ?????????????????????
    const getDevelopend = (who) => {
        let obj = {...pageConfig};
        obj[who] = address;
        getOrderFinish(obj)
        .then(res => {
            if (res.code === 0) {
                pageConfig.total = res.data.total;
                setPageConfig({...pageConfig});
                selectData = res.data.list ? res.data.list : [];
                selectData.map(e => {
                    e.task.role = deform_Skills(e.task?.role || []);
                    e.task.budget = deform_Count(e.task.budget, e.task.currency)
                })
                setSelectData([...selectData]);
            }
        })
    }

    const getData = () => {
        const { w } = qs.parse(location.search.slice(1));
        switch (selectBar) {
            case 'tasks':
                getTasks();
                break;
            case 'developping':
                getDevelopping(w);
                break;       
            case 'developend':
                getDevelopend(w);
                break;
            case 'apply':
                getApplys();
                break;
            default:
                break;
        }
    }

    // ???????????????
    useEffect(() => {
        if (skeletonHash?.hash) {
            awaitRun()
        }
    },[skeletonHash?.hash])

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
        getData()
    },[selectBar, pageConfig.page])

    useEffect(() => {
        init()
        getData()
    },[router])

    return (
        <div className="Userprojects">
            <div className="Userprojects-content">
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
                                </p>
                            </div>)
                    }
                </div>
                <div className="content">
                    <TaskItem 
                        taskList={selectData} 
                        select={selectBar} 
                        who={who} 
                        skeletonHash={skeletonHash}
                        taskModal={setShowModifyTaskModal} 
                        taskInfo={changeTaskInfo} 
                        setTaskInfo={setChangeTaskInfo} 
                        isLoading={isLoading} 
                    />
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
            </div>
            <Modal 
                open={isModal}
                onCancel={() => {setIsModal(false)}}
                footer={null}              
            >
                <p>????????????</p>
                <p>????????????</p>
                <Input onChange={(e) => onchange(e.target.value,"valuation")} />
                <Select defaultValue="1" disabled >
                    <Option value="1">ETH</Option>
                </Select>
                <p>????????????</p>
                <TextArea rows={4} onChange={(e) => onchange(e.target.value,"desc")}></TextArea>
                <p>????????????</p>
                <Select defaultValue="telegram" onChange={(e) => onchange(e,'contactName')} >
                    <Option value="telegram">telegram</Option>
                    <Option value="wechat">wechat</Option>
                    <Option value="skype">skype</Option>
                </Select>
                <Input className="applyPrice" onChange={e => onchange(e.target.value,'contactValue')} />
                <Button onClick={()=>modifyApply()}>????????????</Button>
            </Modal>
            <Modal_ModifyTask 
                taskData={selectData} 
                showModifyTaskModal={showModifyTaskModal} 
                setShowModal={setShowModifyTaskModal}
                taskInfo={changeTaskInfo}
                setTaskInfo={setChangeTaskInfo}
                setIsLoading={setIsLoading}
            />
        </div>
    )
}

export default Userprojects;