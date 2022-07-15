import { useEffect, useState } from "react"
import { CloseCircleTwoTone } from '@ant-design/icons';
import { InputNumber, Button } from 'antd';
import { createApply } from "../pages/http/api";

export default function Attend(props) {
    
    const { setParent } = props;
    const { pro_id } = props
    let [count,setCount] = useState(null);

    const onChange = (e) => {
        count = e;
        setCount(count);
    }

    const submit = () => {
        let obj = {
            count: count,
            pro_id: pro_id
        }
        console.log(obj);



        // 入库
        createApply(obj)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
        return
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