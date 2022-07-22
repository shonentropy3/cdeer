// import { PlusSquareOutlined } from '@ant-design/icons';
import { InputNumber, Button, message, notification, Input } from 'antd';
import { useEffect, useState } from 'react';


export default function Stage(){
    
    const { TextArea } = Input;
    const tokenlist = [
        {title: '以太坊', value: 'ethers'},
        {title: '比特', value: 'bcoin'},
    ]
    const [period,setPeriod] = useState(0)
    const [budget,setBudget] = useState(0)
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
            arr.push( {stage: i+1, date: 0, price: 0, dsc: ''} )
        }
        stage = arr
        setStage([...stage])
    }

    const onChange = (i,value,type) => {
        switch (type) {
            case 'date':
                stage[i].date = value
                break;
            case 'price':
                stage[i].price = value
                break;
            default:
                stage[i].dsc = value.target.value
                break;
        }
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
            // message.error('!');
            notification['error']({
                message: '输入值错误',
                description:'设定值超过预设范围!',
                style: {color: 'white'}
              });
            return
        }
        console.log(token,stage);
    }

    useEffect(() => {
        init()
        setPeriod(15)
        setBudget(1500)
    },[])

    return(
        <div className="Stage">
            <div className="title">
                <p>总周期: <span>{period}</span>天</p>
                <p>总金额: <span>{budget}</span></p>
            </div>
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
                            <div className="inner">
                                <h2>P{i+1}</h2>
                                <div className="box">
                                    周期: <InputNumber min={1} value={e.date} onChange={(event) => onChange(i,event,'date')} />
                                </div>
                                <div className="box">
                                    计划金额: <InputNumber min={1} value={e.price} onChange={(event) => onChange(i,event,'price')} />
                                </div>
                            </div>
                            <div className="inner">
                                <p>阶段描述:</p> <TextArea showCount maxLength={100} onChange={(event) => onChange(i,event,'dsc')} />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}