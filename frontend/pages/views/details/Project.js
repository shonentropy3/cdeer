import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import NavigationBar from "../../../components/NavigationBar";



export default function Project_detail(params) {
    const { Step } = Steps;
    const navbar = [
        { label: '我的项目', url: '/views/Myproject'},
        { label: '项目详情', url: ''}
    ]
    let [stateNum,setStateNum] = useState(0);


    useEffect(() => {
        // TODO:链上获取相关信息,判断当前状态
        // setStateNum

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
                            <Step title="确认阶段" description="需求方确认开发方" />
                            <Step title="确认价格" description="开发方确认价格" />
                            <Step title="阶段划分" description="开发方划分阶段" />
                            <Step title="确认阶段" description="需求方确认阶段划分" />
                            <Step title="创建成功" description="项目创建成功" />
                        </Steps>
                    </div>

                    <div className="container">
                        
                    </div>

                </div>
            </main>
        </div>
    )
}