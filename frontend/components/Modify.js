import { Input, InputNumber, Checkbox, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { ModifyDemand } from '../controller/task';
import { modifyDemand } from '../http/api';
import { BitOperation } from '../utils/BitOperation';


export default function Modify(params) {
    const { TextArea } = Input;
    const { data } = params
    const { setParent } = params
    const { detail } = params
    const _data = require("../data/data.json")

    let [role,setRole] = useState([])
    let [pjc,setPjc] = useState([])
    let [roleList,setRolelist] = useState([])
    let [pjcList,setPjclist] = useState([])
    let [input,setInput] = useState([
        {title: '项目名称', type: String, value: detail.title},
        {title: '项目预算', type: Number, value: Number(detail.budget)},
        {title: '项目周期', type: Number, value: detail.period}
    ])
    let [text,setText] = useState(detail.desc)

    const change = (arr,index,set,element,list,checked) => {
        arr[index] = !arr[index];
        set([...arr]);
        if (checked.target.checked) {
            list.push(element.value)
        }else{
            list.forEach((ele,i) => {
                ele === element.value ? list.splice(i,1) : ''
            })
        }
    }

    const onChange = (t,e,i,index) => {
        i === 'role' ? 
            change(roleList,index,setRolelist,e,role,t) 
            : 
            change(pjcList,index,setPjclist,e,pjc,t)
    }

    const inner = (event,e) => {
        let value
        typeof event == 'number' ? 
            value = event
            :
            value = event.target.value
        
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

        console.log(roleList, pjcList);
        let skills = [];
        let categories = [];
        roleList.forEach((e,i) => {
            e ? skills.push(i) : ""
        });
        pjcList.forEach((e,i) => {
            e ? categories.push(i) : ""
        });
        let obj = {
            u_address: detail.issuer,
            title: input[0].value,
            budget: input[1].value,
            period: Number(input[2].value) * 24 * 60 * 60,
            pro_content: text,
            recruiting_role: r,
            demand_type: p,
            demand_id: detail.id,
            attachment: detail.attachment,
            skills: BitOperation(skills),
            categories: BitOperation(categories)
        }
        obj = JSON.stringify(obj)
        let tradeStatus = false
        await ModifyDemand(obj)
        .then(res => {
          if (res) {
            if (res.code) {
              tradeStatus = false
              message.error('交易失败!');
            }else{
              tradeStatus = true
            }
          }
        })
        .catch(err => {
            console.log('err==>',err);
        })

        if (tradeStatus) {
            modifyDemand({proLabel: obj})
              .then(res => {
                cancel()
                message.success('修改成功');
                setTimeout(() => {
                    window.location.reload()
                }, 500);
              })
              .catch(err => {
                console.log(err);
                cancel()
                message.error('修改失败');
              })
          }
    }

    const Check = (arr, list, check, set) => {
        arr.forEach((ele,index) => {
            let flag = false;
            list.forEach((e,i) => {
                if (ele.value === e) {
                    ele.status = true
                    flag = true
                    return
                }
            })
            flag ? check.push(true): check.push(false)
        })
        set([...check])
    }

    const initCheck = async() => {
        pjc = detail.task_type
        role = detail.role
        setPjc([...pjc])
        setRole([...role])

        Check(_data.market_role, detail.role, roleList, setRolelist);
        Check(_data.pjc, detail.task_type, pjcList, setPjclist);


    }

    const cancel = () => {
        setParent(false)
    }

 
    useEffect(()=>{
        roleList = [];
        pjcList = [];
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
                    _data.market_role.map((e,i) => {
                        if (i > 0) {
                            return <Checkbox key={i} checked={roleList[i]} onChange={(event)=>onChange(event,e,'role',i)}>{e.name}</Checkbox>
                        }
                    })
                }
                
            </div>
            <div className="checkbox">
                <p>选择项目类型:</p>
                {
                    _data.pjc.map((e,i) => {
                        if (i > 0) {
                            return <Checkbox key={i} checked={pjcList[i]} onChange={(event)=>onChange(event,e,'pjc',i)}>{e.name}</Checkbox>
                        }
                    })
                }
            </div>
            <div className="btn">
                <Button danger onClick={() => cancel()}>取消</Button>
                <Button type="primary" onClick={() => modify()}>确认</Button>
            </div>
            
        </div>
    )
}