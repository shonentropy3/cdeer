import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import NavigationBar from "../../../components/NavigationBar";
import Stage from '../../../components/Stage';
import {getFirstStatus,getSecondStatus} from '../../../controller/getOrdStatus'

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
                return <Stage />
            case 2:
                return <h1>3</h1>
            default:
                return <h1>4</h1>
        }
    }

    const init = async() => {
        let oid = ''
        let obj = {
            demand_id: 9,
            apply_addr: '0x90f79bf6eb2c4f870365e785982e1f101e93b906'
        }
        obj = JSON.stringify(obj)
        // console.log('-=======',getFirstStatus);
        // return
        await getFirstStatus({proLabel: obj})
        .then(res => {
            oid = res.toString()
        })
        .catch(err => {
            console.log(err)
        })
        if(oid === 0){
            stateNum = 0;
            setStateNum(stateNum)
            return
        }

        await getSecondStatus(oid)
        .then(res => {
            console.log("res+++++++++=",res);
            // oid = res.toString()
            
            
        })
        .catch(err => {
            console.log(err)
        })

    }

    let [stateNum,setStateNum] = useState(2);
    

    useEffect(() => {
        // TODO:链上获取相关信息,判断当前状态
        // setStateNum
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