// import { PlusSquareOutlined } from '@ant-design/icons';
import { InputNumber, Button, message, notification, Input, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { getOrderAmount } from '../controller/order';
import { divideStage } from '../controller/order';
import { useContracts } from '../controller';
import { ethers } from 'ethers';
import { getStagesHash } from '../http/api';
export default function Stage(params){
    const { RangePicker } = DatePicker;
    const { taskInfo } = params;
    const { oid } = params;
    const { amoumt } = params;
    const { TextArea } = Input;
    const { useOrderContractWrite } = useContracts('setStage')
    const { modifyStages } = params;
    const tokenlist = [
        {title: '以太坊', value: '0x0000000000000000000000000000000000000000'},
        {title: '比特', value: '0x0000000000000000000000000000000000000000'},
    ]
    let [budget,setBudget] = useState(0)
    let [stageNum,setStageNum] = useState()
    let [stage,setStage] = useState([])
    let [token,setToken] = useState('0x0000000000000000000000000000000000000000')
    

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
        let stageDetail = {
            orderId: oid,
            stages: [],
            task: {
                id: taskInfo.id,
                title: taskInfo.title,
                desc: taskInfo.desc,
                attachment: taskInfo.attachment,
            },
            last: '', //  jsonhash
            version: '1.0'
        };
        let amounts = [];
        let periods = [];
        let desc = [];
        
        // console.log(stage);
        // return
        stage.forEach(ele => {
            amounts.push(ele.price);
            periods.push(1*24*60*60);
            desc.push(ele.dsc)
            stageDetail.stages.push(
                {
                    milestone: {
                        type: 'raw',
                        content: ele.dsc
                    },
                    delivery: {
                        attachment: '',
                        fileType: '',
                        content: ''
                    }
                }
            )
        })
        getStagesHash({obj: JSON.stringify(stageDetail)})
        .then(res => {
            console.log(res.hash);  // ipfs ==> TODO: 存入链上 && 存入stageDetail.last
        })
        // console.log(stageDetail);
        // return

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

        // 将天转换为秒
        // periods.forEach((e,i) => {
        //     periods[i] = e * 24 * 60 * 60
        // })
        
        let obj = {
            _orderId: oid,
            _token: token,
            _amounts: amounts,
            _periods: periods,
            _desc: desc
        }
        let arr = []
        obj._amounts.forEach(ele => {
            arr.push(ethers.utils.parseEther(`${ele}`))
        });
        useOrderContractWrite.write({
            recklesslySetUnpreparedArgs: [
                oid, 
                token, 
                arr, 
                desc,
                periods
            ]
        })  
    }

    const writeSuccess = () => {
        message.success('设置阶段成功!3秒后自动刷新')
        setTimeout(() => {
            history.go(0);
        }, 3000);
    }

    useEffect(() => {
        if (modifyStages === undefined) {
            return
        }
        if (modifyStages.length !== 0) {
            stageNum = modifyStages.length;
            setStageNum(stageNum)
        }
    },[modifyStages])

    useEffect(() => {
        if (modifyStages === undefined) {
            return
        }
        if (modifyStages.length !== 0 && stage.length !== 0) {
            modifyStages.map((e,i) => {
                stage[i].price = e.price;
                stage[i].dsc = e.dsc;
                setStage([...stage])
            })
        }
    },[stageNum])

    useEffect(() => {
        useOrderContractWrite.isSuccess ? 
            writeSuccess()
            :
            ''
    },[useOrderContractWrite.isSuccess])

    useEffect(() => {
        init()
        budget = amoumt
        setBudget(budget)
    },[amoumt])

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
                <Button disabled={useOrderContractWrite.isLoading} type="primary" onClick={submit} >提交</Button>
            </div>
            
            <div className="list">
                {
                    stage.map((e,i) => 
                        <div className="li" key={i}>
                            <div className="inner">
                                <h2>P{i+1}</h2>
                                <div className="box">
                                    周期: <RangePicker onChange={(date,dateString) => onChange(i, dateString, 'date')}/>
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