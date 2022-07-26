// import { PlusSquareOutlined } from '@ant-design/icons';
import { InputNumber, Button, message, notification, Input } from 'antd';
import { useEffect, useState } from 'react';
import { getOrderAmount } from '../controller/order';
import { divideStage } from '../controller/order';

export default function Stage(params){
    
    const { oid } = params;
    const { amoumt } = params;
    const { TextArea } = Input;
    const tokenlist = [
        {title: '以太坊', value: '0x90f79bf6eb2c4f870365e785982e1f101e93b906'},
        {title: '比特', value: 'bcoin'},
    ]
    const [budget,setBudget] = useState(0)
    let [stageNum,setStageNum] = useState(1)
    let [stage,setStage] = useState([])
    let [token,setToken] = useState('0x90f79bf6eb2c4f870365e785982e1f101e93b906')
    

    const changeStage = (value) => {
        stageNum = value;
        setStageNum(stageNum);
        init()
    };

    const init = () => {
        let arr = []
        for (let i = 0; i < stageNum; i++) {
            arr.push( {stage: i+1, date: 1, price: 1, dsc: ''} )
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

    const submit = async() => {

        
        let amounts = [];
        let periods = [];
        let desc = [];
        
        stage.forEach(ele => {
            amounts.push(ele.price);
            periods.push(ele.date);
            desc.push(ele.dsc)
        })

        // 遍历确认目前金额&&周期未超标
        let total = 0;
        amounts.forEach(ele => {
            total += ele
        })
        if (total != budget) {
            notification['error']({
                message: '输入值错误',
                description:'计划金额总值应等于需求方预设总金额!',
                style: {color: 'white'}
              });
            return
        }

        let obj = {
            _orderId: oid,
            _token: token,
            _amounts: amounts,
            _periods: periods,
            _desc: desc
        }
        obj = JSON.stringify(obj)
        await divideStage({proLabel: obj})
        .then(res => {
            if (res == 200) {
                message.success('设置阶段成功')
                setTimeout(() => {
                    history.go(0);
                }, 1000);
            }
        })
    }

    useEffect(() => {
        init()
        setBudget(amoumt)
        
        let task_id = location.search.replace('?','')
        getOrderAmount(task_id)
        .then(res => {
            console.log(res.toString());
        })
        // console.log(task_id);
    },[])

    return(
        <div className="Stage">
            <div className="title">
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
                                <div className="box">
                                    <p>阶段描述:</p> <TextArea showCount maxLength={100} onChange={(event) => onChange(i,event,'dsc')} />
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}