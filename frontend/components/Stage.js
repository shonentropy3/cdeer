// import { PlusSquareOutlined } from '@ant-design/icons';
import { InputNumber, Button, message } from 'antd';
import { useEffect, useState } from 'react';


export default function Stage(){

    const tokenlist = [
        {title: '以太坊', value: 'ethers'},
        {title: '比特', value: 'bcoin'},
    ]
    const [period,setPeriod] = useState(15)
    const [budget,setBudget] = useState(15)
    let [stageNum,setStageNum] = useState(1)
    let [stage,setStage] = useState([])
    let [token,setToken] = useState('ethers')
    

    const changeStage = (value) => {
        stageNum = value;
        setStageNum(stageNum);
        init()
    };

    const init = () => {
        let arr = []
        for (let i = 0; i < stageNum; i++) {
            arr.push( {stage: i+1, date: 0, price: 0} )
        }
        stage = arr
        setStage([...stage])
    }

    const onChange = (i,value,type) => {
        type === 'date' ? stage[i].date = value : stage[i].price = value;
        setStage([...stage])
    };

    const getToken = (e) => {
        token = e.target.value;
        setToken(token)
    }

    const submit = () => {
        // 遍历确认目前金额&&周期未超标
        let date = 0
        let price = 0
        stage.forEach(ele => {
            date += ele.date;
            price += ele.price;
        })
        if (date > period || price > budget) {
            message.error('设定值超过预设范围!');
            return
        }
        console.log(token,stage);
    }

    useEffect(() => {
        init()
    },[])

    return(
        <div className="Stage">
            <div className="navabr">
                <div className='box'>
                    阶段数目: <InputNumber min={1} max={10} value={stageNum} onChange={changeStage} />
                </div>
                <div className='box'>
                    token:
                    <select name="" id="" onChange={(event) => getToken(event)}>
                        {
                            tokenlist.map((e,i) => <option key={i} value={e.value} >{e.title}</option>)
                        }
                    </select>
                </div>
                <Button type="primary" onClick={submit} >提交</Button>
            </div>
            
            <div className="list">
                {/* {init()} */}
                {
                    stage.map((e,i) => 
                        <div className="li" key={i}>
                            <h2>P{i+1}</h2>
                            <div className="box">
                                周期: <InputNumber min={1} value={e.date} onChange={(event) => onChange(i,event,'date')} />
                            </div>
                            <div className="box">
                                计划金额: <InputNumber min={1} value={e.price} onChange={(event) => onChange(i,event,'price')} />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}