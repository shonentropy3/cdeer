import { useState,useEffect } from "react"
import { Button, Input,Select,Upload, Checkbox,message } from "antd"
import {FolderAddOutlined} from "@ant-design/icons"
import { useContracts } from "../controller";
import { useAccount } from "wagmi";
import { getHash } from "../http/api";


export  function Modal_ModifyTask (params) {
    const { TextArea }  = Input
    const { Dragger } = Upload;
    const {Option} = Select;

    const {allInfo} = params
    const {address,isConnected } = useAccount()

    const { useTaskContractWrite } = useContracts("modifyTask")

    let [account,setAccount] = useState()
    
    let [budget,setBudget] = useState("")
    let [projectTitle,setProjectTitle] = useState()
    let [projectDesc,setProjectDesc] = useState()
    let [projectAttrchment,setProjectAttrchment] = useState("")
    let [types,setTypes] = useState([])
    let [projectSkills,setProjectSkills] = useState([])
    let [period,setPeriod] = useState()
    let [currency,setCurrency] = useState()
    let [buttonType,setButtonType] = useState("text")

    let [formData,setFormData] = useState()
    let [suffix,setSuffix] = useState()
    
    let [projectType,setProjectType] = useState(
        [
            {title: 'solidity', status: false, buttonType:"text", value: '201'},
            {title: 'javascript', status: false, buttonType:"text", value: '202'},
            {title: 'python', status: false, buttonType:"text", value: '203'},
            {title: 'Go', status: false, buttonType:"text", value: '204'},
            {title: 'C/C++', status: false, buttonType:"text", value: '205'},
            {title: 'Android', status: false, buttonType:"text", value: '206'},
            {title: 'HTML/CSS', status: false, buttonType:"text", value: '207'},
            {title: 'IOS', status: false, buttonType:"text", value: '208'},
        ]
    )
    let [skillss,setSkillss] = useState(
        [
            {title: 'solidity', status: false, buttonType:"text", value: '101'},
            {title: 'javascript', status: false, buttonType:"text", value: '102'},
            {title: 'python', status: false, buttonType:"text", value: '103'},
            {title: 'Go', status: false, buttonType:"text", value: '104'},
            {title: 'C/C++', status: false, buttonType:"text", value: '105'},
            {title: 'Android', status: false, buttonType:"text", value: '106'},
            {title: 'HTML/CSS', status: false, buttonType:"text", value: '107'},
            {title: 'IOS', status: false, buttonType:"text", value: '108'},
        ]
    )

    const beforeUpload = (info) => {
        const isLt2M = info.file.size / 1024 / 1024 < 20
        if(!isLt2M){
            message.error('Must smaller than 20MB!')
            return false
        }
        return true
    }


    const upload = async (info)=>{
        var form_Data = new FormData()
        form_Data.append('files',info.file)
        formData = form_Data
        setFormData(formData)
        return await new Promise((resolve,reject)=>{
            resolve(beforeUpload(info))
        })
        .then((res)=>{
            res?info.onSuccess(): info.onError()
        })
    }

    const uploadChange = (info)=>{
        suffix = info.file.name;
        setSuffix(suffix)
        if(info.file.status === 'done'){
            message.success(`${info.file.name} file uploaded successfully.`)
        }else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
    }


    const checkType = (e,i)=>{

        // console.log(e);
        let arr = []
        projectType.map(ele => {
            if(ele.status){
                arr.push(ele)
            }
        })
        console.log(arr.length);
        if(arr.length < 6){
            e.status = !e.status;
            setProjectType([...projectType]);
        }else{
            e.status = false
            setProjectType([...projectType]);
        }

    }

    const checkSkill = (e,i)=>{

        let arr = []
        skillss.map(ele => {
            if(ele.status){
                arr.push(ele)
            }
        })
        if(arr.length < 6){
            e.status = !e.status
            setSkillss([...skillss])
        }else{
            e.status = false
            setSkillss([...skillss])
        }
    }

    const modifyHandler = async ()=>{
        if(formData){
            await getHash(formData)
            .then((res)=>{
                setProjectAttrchment(res)
            })
            .catch(error => {
                console.log(error);
                // return error
            })
        }

        let modifyInfo = {
            currency: currency,
            attachment: projectAttrchment,
            budget: budget,
            desc: projectDesc,
            period: period,
            skills: [...projectSkills],
            categories: [...types],
            title: projectTitle,
            u_address: account,
            disabled:true,
        }
        console.log(modifyInfo);
        // useTaskContractWrite.write({
        //     recklesslySetUnpreparedArgs: [
                
        //     ]
        // })
    }


    useEffect(()=>{
        setProjectTitle(allInfo.title)
        setProjectDesc(allInfo.desc)
        setProjectAttrchment(allInfo.attrchment)
        let task_type = allInfo.task_type
        let role = allInfo.role
        setTypes([...task_type])
        setProjectSkills([...role])
        setPeriod(allInfo.period)
        setBudget(allInfo.budget)
        setCurrency(allInfo.apply_switch)
        allInfo.task_type.map(e => {
            projectType.map(ele => {
                if (e === ele.value) {
                    ele.status = true
                }
            })
        })
        allInfo.role.map(e => {
            skillss.map(ele => {
                if (e === ele.value){
                    ele.status = true
                }
            })
        })
        // setProjectType([...task_type])
        // setProjectSkills([...allInfo])
    },[])

    useEffect(() => {
        let arr = [];
        projectType.map(e =>{
            if (e.status && arr.length < 6) {
                arr.push(e.value);
            }
        })
        types = arr;
        setTypes([...types])
        console.log(types);
        
    },[projectType])

    useEffect(() => {
        let arr = []
        skillss.map(e => {
            if(e.status && arr.length < 6) {
                arr.push(e.value)
            }
        })
        projectSkills = arr
        console.log("ski ===>",projectSkills);
        setProjectSkills([...projectSkills])
    },[skillss])

    useEffect(()=>{
        if (isConnected) {
            account = address;
            setAccount(account)
        }
    },[isConnected])

    return <div className="Modal_modifyTask">
        <p className="project-title">项目名称</p>
        <Input value={projectTitle} onChange={(e)=>setProjectTitle(e.target.value)} />
        <p style={{marginTop:20}}>项目描述</p>
        <TextArea
            value={projectDesc}
            onChange={(e)=>setProjectDesc(e.target.value)}
        ></TextArea>


        <Upload
            listType="picture"
            maxCount={1}
            name="file"
            onChange={uploadChange}
            customRequest={upload}
        >
            <Button icon={<FolderAddOutlined />}>上传项目需求文档（Word、Excel、PPT、PDF、图像、视频，20MB以内）</Button>
        </Upload>
        <p style={{marginTop:20}}>项目类型(最多六个)</p>
        {

            projectType.map((e,i)=>
                <Button 
                    key={i} 
                    type={e.status ? 'primary':'text'}
                    onClick={()=>checkType(e,i)}
                    style={{marginBottom:10,marginRight:10}}
                >
                    {e.title}
                </Button>
            )

        }

        <p style={{marginTop:20}}>技能要求(最多六个)</p>
        {
            skillss.map((e,i)=>
                <Button 
                    style={{marginBottom:10,marginRight:10}}
                    type={e.status ? 'primary':'text'} 
                    key={i}
                    onClick={()=>checkSkill(e,i)}
                >
                    {e.title}
                </Button>

            )
        }
        <p style={{marginTop:20}}>项目预算</p>
        <input 
            value={budget} 
            onChange={(e)=>(setBudget(e.target.value))}
            style={{width:350}} />
        <Select 
            style={{width:100}}
            value={currency}
            onChange={(e)=>{setCurrency(e)}}
            defaultValue={currency}>
            <Option value={1}>ETH</Option>
            <Option value={2}>BTC</Option>
        </Select>
        <p style={{marginTop:20}}>项目周期</p>
        <Select 
            style={{width:450}}
            value={(period/24/60/60).toString()}
            onChange={(e)=>{setPeriod((e*24*60*60).toString())}}
            // defaultValue={(period/24/60/60).toString()}
            defaultValue={3}
        >
            <Option value="0">预计周期</Option>
            <Option value="3">3天</Option>
            <Option value="7">1周</Option>
            <Option value="21">3周</Option>
            <Option value="30">1个月</Option>
            <Option value="60">2个月</Option>
        </Select>
        <Button 
        type="primary" 
        style={{
            width:450,
            height:50,
            marginTop:20,
            fontSize:18
        }}
        onClick={modifyHandler}
        >
            确认修改
        </Button>
    </div>
}



