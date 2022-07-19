import { useEffect, useState } from "react"
import { CloseCircleTwoTone } from '@ant-design/icons';
import { InputNumber, Button, message } from 'antd';
import { applyFor } from '../pages/http/api';
// import ApplyProject from "../controller/ApplyProject";
import { ApplyProject } from "../controller/ApplyProject";


export default function Attend(props) {
    
    const { setParent } = props;
    const { demand_id } = props
    const { data } = props
    let [count,setCount] = useState(null);
    const [currentAccount, setCurrentAccount] = useState(null);

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
    
        if (!ethereum) {
          console.log("Make sure you have Metamask installed!");
          return;
        } else {
          console.log("Wallet exists! We're ready to go!")
        }
    
        const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account: ", account);
          currentAccount = account 
          setCurrentAccount(currentAccount);
        } else {
          console.log("No authorized account found");
        }
    }

    const onChange = (e) => {
        count = e;
        setCount(count);
    }

    // 确认合作
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

    useEffect(() => {
        checkWalletIsConnected()
    },[])

    return(
        <div className="Attend">
            <div className="top">
                <h2>报名项目</h2>
                <CloseCircleTwoTone twoToneColor="#b4b4b4" className="icon" onClick={() => setParent(false)} />
            </div>
            <div className="content">
                <div className="box">
                    <p>估价:</p>
                    <InputNumber size="large" min="1" onChange={onChange} />
                </div>
                <div className="box">
                    <Button type="primary" onClick={() => submit()}>提交</Button>
                </div>
            </div>
        </div>
    )
}