import { useState,useEffect } from "react"
import { Button, Input,Select,Upload, Checkbox,message } from "antd"
import {FolderAddOutlined} from "@ant-design/icons"
import { useContracts } from "../controller";
import { useAccount } from "wagmi";
import { getHash } from "../http/api/task";
import { modifyDemand } from "../http/api/user";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { BitOperation } from "../utils/BitOperation";


export  function Modal_ModifyTask (params) {
    const { TextArea }  = Input
    const { Dragger } = Upload;
    const {Option} = Select;
    const router = useRouter()

    const {allInfo,taskId} = params
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
    let [demandId,setDemandId] = useState()

    let [formData,setFormData] = useState()
    let [suffix,setSuffix] = useState()

    let [modifyInfo,setModifInfo] = useState({})
    
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
        
        let modifyInfo = {
            demand_id: demandId,
            currency: currency,
            attachment: "",
            budget: budget,
            pro_content: projectDesc,
            period: period,
            recruiting_role: `{${[...projectSkills]}}`,
            demand_type: `{${[...types]}}`,
            title: projectTitle,
            suffix: suffix,
            issuer: account,
            disabled:false,
            payhash:""
        }
        if(formData){
            await getHash(formData)
            .then((res)=>{
                modifyInfo.attachment = res
            })
            .catch(error => {
                console.log(error);
                return error
            })
        }
        setModifInfo({...modifyInfo})
        // console.log(modifyInfo);
        let params = {
            title: modifyInfo.title,
            desc: modifyInfo.pro_content,
            attachment: "",
            currency:modifyInfo.currency,
            budget: modifyInfo.budget,
            period: modifyInfo.period,
            categories: BitOperation([...modifyInfo.demand_type]),
            skills: BitOperation([...modifyInfo.recruiting_role]),
            disabled: false,
            payhash: ""
        }
        console.log(modifyInfo);
        console.log("address===>",account);
        useTaskContractWrite.write({
            recklesslySetUnpreparedArgs: [
                account,
                params,
                {
                    value: ethers.utils.parseEther("1")
                }
            ]
        })
        console.log(useTaskContractWrite);
    }

    const writeSuccess = () => {
        modifyInfo.payhash = useTaskContractWrite.data.hash
        let para = {"proLabel":JSON.stringify(modifyInfo)}
        console.log(para);
        console.log(2);
        modifyDemand(para)
        .then(res => {
            console.log(res.code);
            if(res.code == '200') {
                message.success('修改成功')
                setTimeout(() => {
                    router.push('/issuer/Projects')
                })
            }else{
                message.error('连接超时')
                console.log(res);
            }
        })
        .catch(err => {
            console.log(err);
            message.error('创建失败')
        })
    }


    useEffect(()=>{
        setDemandId(taskId)
        setProjectTitle(allInfo.title)
        setProjectDesc(allInfo.desc)
        setProjectAttrchment(allInfo.attrchment)
        let task_type = allInfo.task_type
        let role = allInfo.role
        setProjectSkills([...role])
        setPeriod(allInfo.period)
        setBudget(allInfo.budget)
        setCurrency(allInfo.apply_switch)
        allInfo.role.map(e => {
            skillss.map(ele => {
                if (e === ele.value){
                    ele.status = true
                }
            })
        })
    },[])

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

    useEffect(()=>{
        console.log(useTaskContractWrite.isSuccess);
    },[useTaskContractWrite.isSuccess])

    useEffect(()=>{
        console.log(useTaskContractWrite.isSuccess);
        useTaskContractWrite.isSuccess ? writeSuccess() : ""
    },[useTaskContractWrite.isSuccess])

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
            <Button style={{width: 472,height:50,marginTop:20}} icon={<FolderAddOutlined />}>上传项目需求文档（Word、Excel、PPT、PDF，20MB以内）</Button>
        </Upload>

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



