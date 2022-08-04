import { useEffect, useState, useRef } from 'react';
import { createDemand,getHash } from '../../http/api';
import { Input, Form, message, Button, Upload, notification, InputNumber, Modal } from 'antd';
import { UploadOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Demand } from '../../controller/task';
import { useRouter } from 'next/router'
import { useWeb3React } from "@web3-react/core"
import { connectors } from '../../utils/connectors';
import task from '../../../deployments/abi/Task.json'
import taskAddr from '../../contracts/deployments/Task.json'
import hello from '../../../deployments/abi/Hello.json'
import helloAddr from '../../contracts/deployments/Hello.json'

import { ethers } from 'ethers'

// import useProvider//

function Publish() {

  const { 
    active, 
    account, 
    activate, 
    library,
    library: provider } = useWeb3React();
    const _data = require("../../data/data.json")
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);

    let [inner,setInner] = useState(_data.inner)

      // 附件
    let [form_Data,form_DataSet] = useState()

    useEffect(() => {
      inner[5].list = _data.market_role;
      inner[6].list = _data.pjc;
      setInner([...inner])
    },[])

    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const mintNftHandler = async () => {

        let flag = true
        // 校验一:是否为空

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
        let data = {
          pro_content: `${inner[3].value}`,
          recruiting_role: `'{${role}}'`,
          demand_type: `'{${pjc}}'`,
          title: `${inner[0].value}`,
          period: Number(inner[2].value),
          budget: Number(inner[1].value),
          u_address: `'${account}'`,
          hash: '',
          payhash: ''
        }
        if (form_Data) {
          await getHash(form_Data)
            .then((res) => {
              data.hash = res
            })
            .catch(err => {
              console.log(err);
              return err
            })
        }
        
        data = JSON.stringify(data)
        let para = {"proLabel":data}
        let tradeStatus = true


        // console.log(library.getSigner(account));
        // return
        // await library.getSigner(account).signMessage('👋')
        //         .then((res) => {
        //           console.log(res);
        //         })
        // return

        // await library.provider.request({
        //   method: "personal_sign",
        //   params: ['xxx', account]
        // });
// return

        let fee = ethers.utils.parseEther("0.1")
        data = JSON.parse(para.proLabel)
        let budget = data.budget * 100
        let period = data.period * 24 * 60 * 60
        // const signer = library.getSigner()
        // const signer = await library.getSigner(account)
        // console.log(signer);
        // console.log(signer,":",library.provider.signer);
        // return
        let signer = await library.getSigner(account).connectUnchecked();
        // console.log(signer);

        
        const taskContract = new ethers.Contract(taskAddr.address, task.abi, signer);
        await taskContract.createTask(
            { 
                title: data.title,
                desc: data.pro_content,
                attachment: data.hash,
                budget: budget,
                period: period
            },
            {
                value: fee
            })
            .then(res => {
              console.log('res==>',res);
              return res
            })
        return
        // 交易
        await Demand(para)
        .then(res => {
          if (res) {
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

    function getProviderOrSigner(provider, account) {
      return getSigner(provider, account)
    }

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
      <>
        <Modal title="" className='Mask_connect' visible={isModalVisible} footer={null} onCancel={handleCancel}>
            <div className="title">Welcome to Code-Market</div>
            <div className='strong'>Sign-in to get started</div>
            <Button className="li" onClick={() => {
                activate(connectors.injected);
                handleCancel();
            }}>Metamask</Button>

            <Button className="li" onClick={() => {
                activate(connectors.walletConnect);
                handleCancel();
            }}>WalletConnect</Button>

            <Button className="li" onClick={() => {
                activate(connectors.coinbaseWallet);
                handleCancel();
            }}>coinbaseWallet</Button>
            {/* <Divider>{}</Divider> */}
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
        </>
    )
    
}

export default Publish