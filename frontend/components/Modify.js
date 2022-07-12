import { Input, InputNumber, Checkbox, Button } from 'antd';
import { useEffect, useState } from 'react';

export default function Modify(params) {
    const { TextArea } = Input;
    const { data } = params
    const { setParent } = params
    const _data = require("../pages/data/data.json")

    let [role,setRole] = useState([])
    let [pjc,setPjc] = useState([])
    let [input,setInput] = useState([
        {title: '项目名称', type: String, value: ''},
        {title: '项目预算', type: Number, value: ''},
        {title: '项目周期', type: Number, value: ''}
    ])
    let [text,setText] = useState('')
    const onChange = (t,e,i) => {
        if (i === 'role') {
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

    const modify = () => {
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
        const obj = {
            u_address: data,
            title: input[0].value,
            budget: input[1].value,
            period: input[2].value,
            pro_content: text,
            recruiting_role: r,
            pro_type: p
        }
        console.log(input);
        console.log(obj);
    }

    useEffect(()=>{
        console.log(params);
    },[])

    return(
        <div className="Modify">

            {
                input.map((ele,index) => 
                    <div className="box" key={index}>
                        <p>{ele.title}:</p>
                        {
                            ele.type === String ? 
                                <Input onChange={(e) => inner(e,ele)} />
                            :
                                <InputNumber onChange={(e) => inner(e,ele)} defaultValue={100} />
                        }
                    </div>
                )
            }
            <div className="box">
                <p>项目描述:</p><TextArea rows={4} onChange={(e) => textArea(e)} />
            </div>
            <div className="checkbox">
                <p>选择角色:</p>
                {
                    _data.role.map((e,i) => <Checkbox key={i} onChange={(event)=>onChange(event,e,'role')}>{e.name}</Checkbox>)
                }
                
            </div>
            <div className="checkbox">
                <p>选择项目类型:</p>
                {
                    _data.demand.map((e,i) => <Checkbox key={i} onChange={(event)=>onChange(event,e,'pjc')}>{e.name}</Checkbox>)
                }
            </div>
            <div className="btn">
                <Button danger onClick={() => setParent(false)}>取消</Button>
                <Button type="primary" onClick={() => modify()}>确认</Button>
            </div>
            
        </div>
    )
}