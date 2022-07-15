import { Input, InputNumber, Checkbox, Button } from 'antd';
import { useEffect, useState } from 'react';
import ModifyDemand from '../controller/modifyDemand';
import { modifyDemand } from '../pages/http/api';


export default function Modify(params) {
    const { TextArea } = Input;
    const { data } = params
    const { setParent } = params
    const { detail } = params
    const _data = require("../pages/data/data.json")

    let [role,setRole] = useState([])
    let [pjc,setPjc] = useState([])
    let [roleList,setRolelist] = useState([])
    let [pjcList,setPjclist] = useState([])
    let [input,setInput] = useState([
        {title: '项目名称', type: String, value: detail.title},
        {title: '项目预算', type: Number, value: Number(detail.budget)},
        {title: '项目周期', type: Number, value: detail.period}
    ])
    let [text,setText] = useState(detail.content)
    const onChange = (t,e,i,index) => {
        
        if (i === 'role') {
            roleList[index] = !roleList[index]
            setRolelist([...roleList])
            if (t.target.checked) {
                role.push(e.value)
            }else{
                role.forEach((ele,i) => {
                    if (ele === e.value) {
                        role.splice(i,1)
                    }
                })
            }
            setRole([...role])
        }else{
            pjcList[index] = !pjcList[index]
            setPjclist([...pjcList])
            if (t.target.checked) {
                pjc.push(e.value)
            }else{
                pjc.forEach((ele,i) => {
                    if (ele === e.value) {
                        pjc.splice(i,1)
                    }
                })
            }
            setPjc([...pjc])
        }
    }

    const inner = (event,e) => {
        let value
        if (typeof event == 'number') {
            value = event
        }else{
            value = event.target.value
        }
        
        input.forEach((ele,index) => {
            if (ele.title === e.title) {
                input[index].value = value
                setInput([...input])
            }
        })
    }

    const textArea = (event) => {
        text = event.target.value
        setText(text)
    }

    const modify = async() => {
        let r = '';
        let p = '';
        role.forEach(e => {
            r += `${e},`
        })
        pjc.forEach(e => {
            p += `${e},`
        })
        r = `{${r.substring(0,r.lastIndexOf(','))}}`
        p = `{${p.substring(0,p.lastIndexOf(','))}}`
        console.log("period-----",input[2].value);
        console.log("budget+++++++",input[1].value);
        let obj = {
            u_address: data,
            title: input[0].value,
            budget: input[1].value,
            period: input[2].value,
            pro_content: text,
            recruiting_role: r,
            pro_type: p,
            pro_id: detail.pro_id,
            attachment: detail.attachment
        }

        console.log("obj===>",obj);
        obj = JSON.stringify(obj)
        let tradeStatus = true
        await ModifyDemand(obj)
        .then(res => {
          console.log('res==>',res);
        })
        .catch(err => {
            console.log('err==>',err);
            console.log('交易失败==>');
        })
        
        if (tradeStatus) {
            console.log('交易完成==>');
            modifyDemand({proLabel: obj})
              .then(res => {
                console.log(res);
                cancel()
              })
              .catch(err => {
                console.log(err);
                cancel()
              })
          }
        console.log(input);
        console.log(obj);
    }

    const initCheck = async() => {

        

        pjc = detail.pro_type
        role = detail.role
        setPjc([...pjc])
        setRole([...role])
        _data.role.forEach(ele => {
            let flag = false
            detail.role.forEach(e => {
                 if (ele.value === e) {
                    ele.status = true
                    flag = true
                    return
                }
            })
            flag ? roleList.push(true):roleList.push(false)
            
        })
        _data.demand.forEach(ele => {
            let flag = false
            detail.pro_type.forEach(e => {
                if (ele.value === e) {
                    ele.status = true
                    flag = true
                    return
                }
            })
            flag ? pjcList.push(true):pjcList.push(false)
        })
        setRolelist([...roleList])
        setPjclist([...pjcList])
        console.log(roleList);
    }

    const cancel = () => {
        setParent(false)
    }

 
    useEffect(()=>{
        initCheck()
        
    },[])

    


    return(
        <div className="Modify">
            {
                input.map((ele,index) => 
                    <div className={`box`} key={index}>
                        <p>{ele.title}:</p>
                        {
                            ele.type === String ? 
                                <Input defaultValue={ele.value} onChange={(e) => inner(e,ele)} />
                            :
                                <InputNumber value={ele.value} onChange={(e) => inner(e,ele)} />
                        }
                    </div>
                )
            }
            <div className="box">
                <p>项目描述:</p><TextArea defaultValue={text} rows={4} onChange={(e) => textArea(e)} />
            </div>
            <div className="checkbox">
                <p>选择角色:</p>
                {
                    _data.role.map((e,i) => <Checkbox key={i} checked={roleList[i]} onChange={(event)=>onChange(event,e,'role',i)}>{e.name}</Checkbox>)
                }
                
            </div>
            <div className="checkbox">
                <p>选择项目类型:</p>
                {
                    _data.demand.map((e,i) => <Checkbox key={i} checked={pjcList[i]} onChange={(event)=>onChange(event,e,'pjc',i)}>{e.name}</Checkbox>
                    )
                }
            </div>
            <div className="btn">
                <Button danger onClick={() => cancel()}>取消</Button>
                <Button type="primary" onClick={() => modify()}>确认</Button>
            </div>
            
        </div>
    )
}