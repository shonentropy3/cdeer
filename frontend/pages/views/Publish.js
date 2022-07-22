import { useEffect, useState, useRef } from 'react';

// import { createProject,getHash } from '../http/api';

import { createDemand,getHash } from '../http/api';

import { Input, Form, message, Button, Upload, notification, InputNumber } from 'antd';
import { UploadOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Demand from '../../controller/demand';
import { useRouter } from 'next/router'


// const demand = require('../../../deployments/abi/Demand.json')
// const demandAddr = require('../../../deployments/Demand.json')

function Publish() {
  const _data = require("../data/data.json")
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState(null);

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
              console.log(res);
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
        // createDemand(para,account)

        // console.log("ethereum===>", ethereum);
        //   if (typeof window.ethereum !== 'undefined') {
        //       let addr=await ethereum.request({ method: 'eth_requestAccounts' });//授权连接钱包
        //       console.log('用户钱包地址:',addr[0]);
        //   }else{
        //       console.log('未安装钱包插件！');
        //   }


    }


    // 登陆/下单按钮
    
    const buttonModel = () => {
      if (currentAccount) {
        return <button onClick={mintNftHandler} className='btn login'> Mint NFT </button>
      } else {
        return <button onClick={connectWalletHandler} className='btn connect'> Connect Wallet </button>
      }
    }


    // 角色选择(输出)
    const roleBox = () => {
      return <>
                <p>选择具体角色</p>
                <div className="result">
                  {
                    _data.role.map((item,index)=> <div key={index}>
                      <input type="checkbox" value={item.value}  name="role" onChange={e=>{get_tuan(e)}}/>{item.name}
                    </div> )
                  }
                </div>
            </> 
    }

    // 类型选择(输出)
    const typeBox = () => {
      return(
        <>
                <p>选择您的项目类型（可多选）</p>
                <div className="result">
                  {
                    _data.demand.map((item,index)=> <div className="result" key={index}>
                      <input type="checkbox" value={item.value} name="role" onChange={e=>{get_pjc(e)}}/>{item.name}
                    </div> )
                  }
                </div>
                        
        </> 
        
      )
    }
    // 输入绑定
    let get_account = (e,i,j) =>{
        j ? account[i].value = e : account[i].value = e.target.value;
        account[i].help = ''
        account[i].status = ''
        Set_account([...account])
        // console.log(e);
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
    // 输入数据
    let [account,Set_account] = useState(
        [
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
            
        ]
      )
      // 角色
      let [tuan,Set_tuan] = useState([])
      // 项目类型
      let [pjc,Set_pjc] = useState([])
      // 附件
      let [form_Data,form_DataSet] = useState()


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


    return(
        <div className="publish">
            <div className="box">
                    <h1>发布项目</h1>
                    {
                        account.map((item,index) => <div key={index} className={`inner`}>
                            <div className="title">
                                {item.title}
                            </div>
                            <div className="desc">
                                {
                                    index !== account.length - 1 ? 
                                    <>
                                        <Form.Item
                                            validateStatus={item.status}
                                            help={item.help}
                                            >
                                            {
                                              index > 0 ?  
                                              <InputNumber status={item.status} className={`${'data'+index}`} min={1} onChange={(e)=>{get_account(e,index,'num')}} />
                                              : 
                                              <Input status={item.status} className={`${'data'+index}`} onChange={(e)=>{get_account(e,index)}} />
                                            }
                                            
                                            {index === 1 ? '$' : ''}
                                            {index === 2 ? '天' : ''}
                                        </Form.Item>
                                    </>
                                    :
                                    <>
                                        <Form.Item validateStatus={item.status} hasFeedback help={item.help}>
                                            <Input.TextArea name="" id="" cols="30" rows="10" onChange={(e)=>{get_account(e,index)}} />
                                        </Form.Item>
                                    </>
                                }
                            </div>
                            
                        </div>
                        )
                    }
                    <div className={`upload`}>
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
                    <div className="type">
                    {roleBox()}
                    </div>
                    <div className="type">
                    {typeBox()}
                    </div>
                    {buttonModel()}

            </div>
        </div>
    )
    
}

export default Publish