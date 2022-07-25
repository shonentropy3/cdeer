import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import NavigationBar from "../../../components/NavigationBar";
import Stage from '../../../components/Stage';
import getOrderStatus from '../../utils/getOrderStatus';
import { checkWalletIsConnected } from '../../utils/checkWalletIsConnected'

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
    let [demand_id,setDemand_id] = useState(null)
    const container = () => {
        switch (stateNum){
            case 0:
                return <h1>等待需求方确认</h1>
            case 1:
                return <Stage />
            case 2:
                return <h1>3</h1>
            default:
                return <h1>4</h1>
        }
    }

    let [stateNum,setStateNum] = useState(2);
    
    const init = async() => {
        let obj = {
            demand_id: Number(demand_id),
            apply_addr: `${await checkWalletIsConnected()}`
        }
        obj = JSON.stringify(obj)
        stateNum = await getOrderStatus(obj)
        setStateNum(stateNum)
    }

    useEffect(() => {
        demand_id = location.search.replace('?','')
        setDemand_id(demand_id)
        init()
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