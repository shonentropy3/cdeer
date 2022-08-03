import { useEffect, useState, useRef } from 'react';
import { createDemand,getHash } from '../../http/api';
import { Input, Form, message, Button, Upload, notification, InputNumber } from 'antd';
import { UploadOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Demand } from '../../controller/task';
import { useRouter } from 'next/router'
import { useWeb3React } from "@web3-react/core"
import Checkbox from 'antd/lib/checkbox/Checkbox';


// const demand = require('../../../deployments/abi/Demand.json')
// const demandAddr = require('../../../deployments/Demand.json')

function Publish() {

  const { 
    active, 
    // account, 
    library, 
    connector, 
    activate, 
    deactivate, 
    chainId,
    library:provider } = useWeb3React();
    const _data = require("../../data/data.json")
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState(null);
    let [inner,setInner] = useState(_data.inner)
        // 输入数据
        let [account,Set_account] = useState([
          {
              title: '项目名称',
              value: '',
              status: '',
              help: ''
          },
          {
              title: '项目预算',
              value: '',
              status: '',
              help: ''
          },
          {
              title: '项目周期',
              value: '',
              status: '',
              help: ''
          },
          {
              title: '项目描述',
              value: '',
              status: '',
              help: ''
          }
    ])
      // 角色
      let [tuan,Set_tuan] = useState([])
      // 项目类型
      let [pjc,Set_pjc] = useState([])
      // 附件
      let [form_Data,form_DataSet] = useState()

    useEffect(() => {
      inner[5].list = _data.market_role;
      inner[6].list = _data.pjc;
      setInner([...inner])
    },[])

    const connectWalletHandler = async () => {
        const { ethereum } = window;
        if (!ethereum) {
          alert("Please install Metamask!");
        }
        try {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          console.log("Found an account! Address: ", accounts[0]);
          setCurrentAccount(accounts[0]);
        } catch (err) {
          console.log(err)
        }
    }

    const mintNftHandler = async () => {

        let flag = true
        // 校验一:是否为空
        account.forEach( (e,i) => {
            if (e.value.length === 0) {
                flag = false
                account[i].status = 'error'
                account[i].help = account[i].title+'不能为空!'
            }
            Set_account([...account])
        })
        if (!flag || (tuan.length === 0 || pjc.length === 0)) { 
            message.error('“具体角色” 和 “项目类型” 不可为空!');
            document.documentElement.scrollTop = 0;
            return 
        }
        // 校验二:项目预算校验
        if ( Number(account[1].value) <= 0 ) {
            account[1].status = 'error'
            account[1].help = '请输入大于0的数字'
            Set_account([...account])
            document.documentElement.scrollTop = 0;
            return
        }

        // 校验四:预防xss攻击
        account[0].value = account[0].value.replace(/<|>|\//g,"")
        Set_account([...account])
       
        let data = {
          pro_content: `${account[3].value}`,
          recruiting_role: `'{${tuan}}'`,
          demand_type: `'{${pjc}}'`,
          title: `${account[0].value}`,
          period: Number(account[2].value),
          budget: Number(account[1].value),
          u_address: `'${currentAccount}'`
        }
        let hash = ''
        if (form_Data) {
          await getHash(form_Data)
            .then((res) => {
              hash = res
            })
            .catch(err => {
              console.log(err);
              return err
            })
        }
        data.hash = hash
        data = JSON.stringify(data)
        let para = {"proLabel":data}
        let tradeStatus = true
        // 交易

        
        await Demand(para)
        .then(res => {
          if (res) {
            console.log(res);
            data = JSON.parse(data)
            data.payhash = res.hash
            data = JSON.stringify(data)
            para = {"proLabel":data}
            if (res.code) {
              tradeStatus = false
              message.error('交易失败!');
            }else{
              tradeStatus = true
            }
          }
        })
        // 2、创建项目
        if (tradeStatus) {
          createDemand(para)
            .then(res => {
              if (res.code == '200') {
                message.success('创建成功');
                setTimeout(() => {
                  router.push('/')
                }, 500);
              }else{
                message.error('连接超时');
              }
              
            })
            .catch(err => {
              console.log(err);
              message.error('创建失败');
            })
        }

    }

    // 登陆/下单按钮
    const buttonModel = () => {
      if (currentAccount) {
        return <button onClick={mintNftHandler} className='btn login'> Mint NFT </button>
      } else {
        return <button onClick={connectWalletHandler} className='btn connect'> Connect Wallet </button>
      }
    }

    // 团队角色绑定
    let get_tuan = e => {
      let res = e.target.defaultValue
      for (let i = 0; i < tuan.length; i++) {
        if (res === tuan[i]) {
          tuan.splice(i,1)
          Set_tuan([...tuan])
          return
        }
      }
      tuan.push(res)
      Set_tuan([...tuan])
    }
    let get_pjc = e => {
      let res = e.target.defaultValue
      for (let i = 0; i < pjc.length; i++) {
        if (res === pjc[i]) {
          pjc.splice(i,1)
          Set_pjc([...pjc])
          console.log(pjc);
          return
        }
      }
      pjc.push(res)
      Set_pjc([...pjc])
    }


      // 上传前
      const beforeUpload = (info) => {
        const isLt2M = info.file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
          message.error('Must smaller than 20MB!');
          return false
        }
        return true
      };
      
      // 上传提醒
      const tips = () => {
        notification.config({
          maxCount: 1,
        })
        notification.open({
          message: `最大文件数量不可超过一个!`,
          closeIcon: (
            <></>
          ),
          duration: 5,
          icon: (
            <WarningOutlined
              style={{
                color: 'white'
              }}
            />
          ),
        });
      }


      const upload = async(info) => {
        info.onProgress()
        var formData=new FormData();
        formData.append('files',info.file);
        form_Data = formData
        form_DataSet(form_Data)
        return await new Promise ((resolve,reject)=>{
          resolve(beforeUpload(info))
       })
       .then((res)=>{
          res ? info.onSuccess() : info.onError()
       })
      }

      const handleChange = (info) => {
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          } 
      };

      const print = (e,i) => {
        switch (e.type) {
          case "input":
            return <Input status={e.status} onChange={(event)=>{textChange(event,i)}} />

          case "number":
            return <InputNumber status={e.status} className={`${'data'+i}`}  min={1} onChange={(event)=>{textChange(event,i)}} />

          case "text":
            return <Input.TextArea name="" id="" cols="30" rows="10" onChange={(event)=>{textChange(event,i)}} />

        }
      }

      const textChange = (e,i) => {
        if (!e.target) {
          inner[i].value = e;
          inner[i].help = '';
          inner[i].status = '';
          setInner([...inner]);
          return
        }
        inner[i].value = e.target.value;
        inner[i].help = '';
        inner[i].status = '';
        setInner([...inner]);
      }

      const boxChange = (e,i) => {
        let res = e.target.value

        for (let j = 0; j < inner[i].value.length; j++) {
          if (res === inner[i].value[j]) {
            inner[i].value.splice(j,1)
            setInner([...inner])
            return
          }
        }
        inner[i].value.push(res)
        setInner([...inner])
      }

    return(
        <div className="publish">
            <div className="box">
                    <h1>发布项目</h1>
                    {
                      inner.map((element,index) => {
                        if (element.type) {
                          return  <div key={index} className={`inner`}>
                                    <div className="title">
                                      {element.name}
                                    </div>
                                    <div className="desc">
                                      {
                                        index !== 3 ? 
                                        <Form.Item
                                          validateStatus={element.status}
                                          help={element.help}
                                        >
                                          {print(element,index)}
                                        </Form.Item>
                                        :
                                        <Form.Item validateStatus={element.status} hasFeedback help={element.help}>
                                          {print(element,index)}
                                        </Form.Item>
                                      }
                                    </div>
                                  </div>
                        }
                        else if (element.list) {
                          return  <div key={index} className="type">
                                    <p>{element.name}</p>
                                    <div className="result">
                                    {
                                      _data.pjc.map((e,i)=> {
                                        if (e.value !== null) {
                                          return  <div key={i}>
                                                    <input type="checkbox" value={e.value} onChange={event=>{boxChange(event,index)}}/>{e.name}
                                                  </div>
                                        }
                                      } )
                                    }
                                    </div>
                                  </div>
                        }
                        else{
                          return <div className={`upload`}>
                              <p>相关文档<span>(选填)</span></p>
                              <InfoCircleOutlined className='mr20' onClick={()=>tips()} />
                              <Upload
                                listType="picture"
                                maxCount={1}
                                name="file"
                                onChange={handleChange}
                                customRequest={upload}
                              >
                                <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                              </Upload>
                          
                          </div>
                        }
                      })
                    }

                    {buttonModel()}

            </div>
        </div>
    )
    
}

export default Publish