import { useEffect, useState } from "react"
import { CloseCircleTwoTone } from '@ant-design/icons';
import { InputNumber, Button } from 'antd';
import { applyFor } from '../pages/http/api';
import ApplyProject from "../controller/ApplyProject";


export default function Attend(props) {
    
    const { setParent } = props;
    const { pro_id } = props
    let [count,setCount] = useState(null);

    const onChange = (e) => {
        count = e;
        setCount(count);
    }

    //报名申请
    const submit = async() => {
        let obj = {
            demandId: pro_id,
            previewPrice: count,
        }
        obj = JSON.stringify(obj)

        let tradeStatus = false
        await ApplyProject(obj)
        .then(res => {
            console.log('res==>',res);
            obj = JSON.parse(obj)
            obj.hash = res.hash;
            // 这里的地址用的是后端传来的,和前端拿到的有大小写的区别,下周记得改成前端拿
            obj.applyAddr = res.applyAddr;
            obj = JSON.stringify(obj)
            tradeStatus = true
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
        console.log(  );
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