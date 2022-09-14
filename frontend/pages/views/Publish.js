import { useEffect, useState, useRef } from 'react';
import { createDemand,getHash } from '../../http/api';
import { Input, Form, message, Button, Upload, notification, InputNumber, Modal, Cascader } from 'antd';
import { UploadOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router'

import Card from '../../components/Card';

import { ethers } from 'ethers'
import { BitOperation } from '../../utils/BitOperation';

import { useAccount } from 'wagmi'
import { useContracts } from '../../controller/index';


function Publish() {
  

    const _data = require("../../data/data.json")
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { address, connector, isConnected } = useAccount();
    const { useTaskContractWrite } = useContracts('createTask');

    let [inner,setInner] = useState(_data.inner)
    let [suffix,setSuffix] = useState("")
    let [account,setAccount] = useState()
    let [form_Data,form_DataSet] = useState()
    let [params,setParams] = useState({})
    let [currency,setCurrency] = useState()

    useEffect(() => {
      inner[5].list = _data.market_role;
      inner[6].list = _data.pjc;
      setInner([...inner])
    },[])

    const options = [
      {
        value: '1',
        label: 'ETH'
      },
      {
        value: '2',
        label: 'BTC'
      }
    ]

    const changeCurrency = (e) => {
      currency = e[0] - 0;
      setCurrency(currency);
    }

    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const mintNftHandler = async () => {
        let flag = true
        // 校验一:是否为空
        console.log(ethers.utils.parseEther("1").toString());
        inner.map((e,i) => {
          if (e.value.length === 0 && i < 4) {
            flag = false
            inner[i].status = 'error'
            inner[i].help = inner[i].name+'不能为空!'
          }
          if (e.value.length === 0 && i > 4) {
            console.log(e.value);
            flag = false
            message.error('“具体角色” 和 “项目类型” 不可为空!');
            document.documentElement.scrollTop = 0;
            return
          }
        })
        inner[0].value = inner[0].value.replace(/<|>|\//g,"");
        inner[3].value = inner[3].value.replace(/<|>|\//g,"");
        setInner([...inner])

        if (!flag) {
          return
        }
        let role = '';
        let pjc = '';
        inner[5].value.map((e,i) => {
          if (inner[5].value.length - 1 !== i) {
            role += e+','
            return
          }
          role += e
        })
        inner[6].value.map((e,i) => {
          if (inner[6].value.length - 1 !== i) {
            pjc += e+','
            return
          }
          pjc += e
        })
        
        params = {
          pro_content: `${inner[3].value}`,
          recruiting_role: `'{${role}}'`,
          demand_type: `'{${pjc}}'`,
          title: `${inner[0].value}`,
          period: Number(inner[2].value),
          budget: Number(inner[1].value) * 100,
          u_address: `${account}`,
          categories: BitOperation(inner[6].index),
          skills: BitOperation(inner[5].index),
          suffix: suffix,
          hash: '',
          payhash: '',
        }
        if (form_Data) {
          await getHash(form_Data)
            .then((res) => {
              params.hash = res
            })
            .catch(err => {
              console.log(err);
              return err
            })
        }
        setParams({...params})
        let tradeStatus = true

        // 交易
        useTaskContractWrite.write({
          recklesslySetUnpreparedArgs: [
            account,
            {
              title: params.title,
              desc: params.pro_content,
              attachment: params.hash,
              currency: 1,  //  币种,x10000,保留四位小数,前端只展示两位小数
              budget: params.budget,
              period: params.period * 24 * 60 * 60,
              categories: params.categories,
              skills: params.skills,  //  原role,职业为1,2,3...整数型
            },
            {
                value: ethers.utils.parseEther("1")
            }
          ]
        })
    }

    const writeSuccess = () => {
      params.payhash = useTaskContractWrite.data.hash;
      let para= {"proLabel": JSON.stringify(params)}
      createDemand(para)
            .then(res => {
              console.log(res.code);
              if (res.code == '200') {
                message.success('创建成功');
                setTimeout(() => {
                  router.push('/')
                }, 500);
              }else{
                // console.log(res);
                message.error('连接超时');
              }
            })
            .catch(err => {
              console.log(err);
              message.error('创建失败');
            })
    }

    useEffect(() => {
      useTaskContractWrite.isSuccess ? 
        writeSuccess()
        :
        ''
    },[useTaskContractWrite.isSuccess])

    // 登陆/下单按钮
    const buttonModel = () => {
      if (account !== undefined) {
        return <button onClick={mintNftHandler} className='btn login'> Mint NFT </button>
      } else {
        return <button onClick={() => showModal()} className='btn connect'> Connect Wallet </button>
      }
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
        suffix = info.file.name;
        setSuffix(suffix);
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          } 
      }

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
        if (!e) {
          return
        }
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
            indexValue(res,i)
            return
          }
        }
        inner[i].value.push(res)
        setInner([...inner])
        indexValue(res,i)
      }

      const indexValue = (res,i) => {
        let arr = []
        inner[i].list.forEach((ele,index) => {
          if (index === 0) {
            return
          }
          let flag = false
          inner[i].value.forEach((e,i) => {
               if (ele.value === e) {
                  ele.status = true
                  flag = true
                  return
              }
          })
          flag ? arr.push(index):''
      })
      inner[i].index = arr
      }

      useEffect(() => {
        if (isConnected) {
          account = address;
          setAccount(account)
        }
    },[isConnected])

    return(
      <>
        <Modal title="" className='Mask_connect' visible={isModalVisible} footer={null} onCancel={handleCancel}>

          <Card cancel={handleCancel}></Card>

        </Modal>
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
                                      element.title === 'task_type' ? 
                                      _data.pjc.map((e,i)=> {
                                        if (e.value !== null) {
                                          return  <div key={i}>
                                                    <input type="checkbox" value={e.value} onChange={event=>{boxChange(event,index)}}/>{e.name}
                                                  </div>
                                        }
                                      } )
                                      :
                                      _data.market_role.map((e,i)=> {
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
                          return  <div key={index} className={`upload`}>
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
                    <div className="currency">
                            币种<Cascader options={options} onChange={(e) => changeCurrency(e)} placeholder="Please select currency" />
                          </div>

                    {buttonModel()}

            </div>
        </div>
        </>
    )
    
}

export default Publish