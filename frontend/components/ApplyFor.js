import { useEffect, useState } from "react"
import { CloseCircleTwoTone } from '@ant-design/icons';
import { InputNumber, Button, message } from 'antd';
import { applyFor } from '../pages/http/api';
import { ApplyProject } from "../controller/ApplyProject";
import { checkWalletIsConnected } from "../pages/utils/checkWalletIsConnected";
import Order from "../controller/order";

export default function Attend(props) {
    
    const { setParent } = props;
    const { demand_id } = props
    const { data } = props
    let [currentAccount, setCurrentAccount] = useState(null);
    let [count,setCount] = useState(null);

    const onChange = (e) => {
        count = e;
        setCount(count);
    }

    useEffect(() => {
      console.log(demand_id);
    },[])

    
    const confirm = async() => {
      let obj = {
        demandId: Number(data.demand_id),
        applyAddr: data.apply_addr,
        amount: Number(count)
      }

      obj = JSON.stringify(obj)
      await Order({proLabel:obj})
      .then(res => {
          console.log(res);
          setParent(false)
      })
      .catch(err => {
          console.log(err);
      })


    }

    //报名申请
    const submit = async() => {
        if (!demand_id) {
          confirm()
          return
        }
        let obj = {
            demandId: demand_id,
            valuation: count,
        }
        obj = JSON.stringify(obj)
        let tradeStatus = false

        currentAccount = await checkWalletIsConnected()
        setCurrentAccount(currentAccount)
        await ApplyProject(obj)
        .then(res => {
            if (res) {
                if (res.code) {
                  tradeStatus = false
                  message.error('交易失败!');
                }else{
                  
                  tradeStatus = true
                  obj = JSON.parse(obj)
                  obj.hash = res.hash
                  obj.applyAddr = currentAccount;
                  obj = JSON.stringify(obj)
                }
            }
        })
        .catch(err => {
            console.log('err==>',err);
            console.log('交易失败==>');
        })

        if (tradeStatus) {
            console.log('交易完成==>',obj);
            applyFor({proLabel: obj})
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
              })
          }
        setParent(false)
    }


    return(
        <div className="Attend">
            <div className="top">
                {
                  demand_id ? <h2>报名项目</h2> : <h2>确认合作</h2>
                }
                <CloseCircleTwoTone twoToneColor="#b4b4b4" className="icon" onClick={() => setParent(false)} />
            </div>
            <div className="content">
                <div className="box">
                    {
                      demand_id ? <p>估价:</p> : <p>价格:</p>
                    }
                    <InputNumber size="large" min="1" onChange={onChange} />
                </div>
                <div className="box">
                    <Button type="primary" onClick={() => submit()}>提交</Button>
                </div>
            </div>
        </div>
    )
}