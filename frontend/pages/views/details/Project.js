import { Steps, Button } from 'antd';
import { useEffect, useState } from 'react';
import NavigationBar from "../../../components/NavigationBar";
import Stage from '../../../components/Stage';
import { useContractsRead } from "../../../controller/index"
import StageWorker from './StageWorker';
import { useAccount } from 'wagmi'

export default function Project_detail(params) {

    const { Step } = Steps;
    const navbar = [
        { label: '我的项目', url: '/views/Myproject'},
        { label: '项目详情', url: '#'}
    ]
    const setpList = [
        {title: '确认开发方', des: '需求方确认开发方'},
        {title: '阶段划分', des: '开发方划分阶段'},
        {title: '确认阶段', des: '需求方确认阶段划分'},
        {title: '创建成功', des: '项目创建成功'},
    ]
    const container = () => {
        switch (stateNum){
            case 0:
                return <h1>等待需求方确认</h1>
            case 1:
                return <Stage oid={oid} amoumt={amoumt} />
            case 2:
                return <Button onClick={() => {setStateNum(1)}}>修改阶段</Button>
            default:
                return <StageWorker />
        }
    }

    let [demand_id,setDemand_id] = useState(null)
    let [stateNum,setStateNum] = useState(1);
    let [oid,setOid] = useState()
    let [account,setAccount] = useState()
    let [amoumt,setAmoumt] = useState()
    const { address } = useAccount()
    const { useOrderContractRead: getOid } = useContractsRead('applyOrderIds',[demand_id, account])
    const { useOrderContractRead: getStage } = useContractsRead('orders',oid)
    
    useEffect(() => {
        if (getOid.data !== undefined) {
            oid = getOid.data.toString();
            setOid(oid)
            if (oid === "0") {
                stateNum = 0
                setStateNum(stateNum)
            }
        }
    },[demand_id])

    useEffect(() => {
        if (getStage.data !== undefined && oid !== "0") {
            switch (getStage.data.checked) {
                case 0:
                    stateNum = 1
                    break;
                case 1:
                    stateNum = 2
                    break;
                default:
                    stateNum = 3
                    break;
            }
            setStateNum(stateNum)
            getStage.data.amount ? amoumt = getStage.data.amount.toString() : '';
            amoumt = amoumt / 1000000000000000000
            setAmoumt(amoumt)
        }
    },[oid])

    useEffect(() => {
        demand_id = location.search.replace('?','')
        setDemand_id(demand_id)
        account = address
        setAccount(account)
    },[])


    return(
        <div className="Project_detail">
            <header></header>
            <NavigationBar data={navbar} />
            <main>
                <div className="content">
                    
                    <div className="nav">
                        <h1>项目详情</h1>
                        <Steps size="small" current={stateNum}>
                            {
                                setpList.map((e,i) => <Step key={i} title={e.title} description={e.des} />)
                            }
                        </Steps>
                    </div>

                    <div className="container">
                        {container()}
                    </div>

                </div>
            </main>
        </div>
    )
}