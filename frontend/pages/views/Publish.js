import contract from '../../contracts/deployments/abi/CodeMarket.json';
import address from '../../contracts/deployments/CodeMarket.json';
import { useEffect, useState, useRef } from 'react';
import { createProject,createStorage } from '../http/api';
import { Input,Form,message,Button,Upload,notification } from 'antd';
import { UploadOutlined,WarningOutlined } from '@ant-design/icons';
import axios from 'axios';
function Publish() {

    const [currentAccount, setCurrentAccount] = useState(null);

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
    
        if (!ethereum) {
          console.log("Make sure you have Metamask installed!");
          return;
        } else {
          console.log("Wallet exists! We're ready to go!")
        }
    
        const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account: ", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
    }

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
        // 校验三:项目周期校验
        if ((Number(account[2].value) <= 0 ) || ((account[2].value.indexOf('.') <= -1) === false)) {
            account[2].status = 'error'
            account[2].help = '请输入大于0的正整数'
            Set_account([...account])
            document.documentElement.scrollTop = 0;
            return
        }
        // 校验四:预防xss攻击
        account[0].value = account[0].value.replace(/<|>|\//g,"")
        Set_account([...account])
        // console.log(account[0].value);
        // console.log('通过了 ==>',account);
       
        let data = {pro_content: account[3].value,
          recruiting_role: `{${tuan}}`,
          pro_type: `{${pjc}}`}
          data = JSON.stringify(data)
        let para = {"proLabel":data}
        createProject(para,account)

    }


    // 登陆/下单按钮
    
    const buttonModel = () => {
      if (currentAccount) {
        return <button onClick={mintNftHandler} className='btn login'> Mint NFT </button>
      }
      if (!currentAccount) {
          return <button onClick={connectWalletHandler} className='btn connect'> Connect Wallet </button>
      }
    }
    // 角色类型
    const team = [
      {
        value: 'kfgcs',
        name: '开发工程师'
      },
      {
        value: 'sjs',
        name: '设计师'
      },
      {
        value: 'cpjl',
        name: '产品经理'
      },
      {
        value: 'csgcs',
        name: '测试工程师'
      }]

    // 项目类型
    const demand = [{
        value: 'web',
        name: 'Web网站'
      },
      {
        value: 'app',
        name: 'App开发'
      },
      {
        value: 'wechat',
        name: '微信公众号'
      },
      {
        value: 'applets',
        name: '小程序'
      },
      {
        value: 'html5',
        name: 'HTML5应用'
      },
      {
        value: 'other',
        name: '其他项目'
      }
      ]

    // 角色选择(输出)
    const roleBox = () => {
        return <>
                      <p>选择具体角色</p>
                      <div className="result">
                        {
                          team.map((item,index)=> <div key={index}>
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
                          demand.map((item,index)=> <div className="result" key={index}>
                            <input type="checkbox" value={item.value} name="role" onChange={e=>{get_pjc(e)}}/>{item.name}
                          </div> )
                        }
                      </div>
                        
        </> 
        
      )
    }
    // 输入绑定
    let get_account = (e,i) =>{
        account[i].value = e.target.value;
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
      let [file,fileSet] = useState()

      // 上传附件
      let upload = () => {
      //   // $req = $this->curl("http://127.0.0.1:5001/api/v0/add", $myJSON);
      //   // $req = json_decode($req, TRUE);
      //   // $hash = $req['Hash'];
        
      }
      
      useEffect(()=>{
        // upload()
        console.log();
      },[])

      const beforeUpload = (file) => {
        console.log(file);
        const isLt2M = file.size / 1024 / 1024 < 20;
      
        if (!isLt2M) {
          message.error('Must smaller than 20MB!');
        }
        return isLt2M;
      };
      
      let num = 0
      const handleChange = (info) => {
        console.log('list===>',info.fileList);
        if (num === 1) {
          notification.open({
            message: '最大文件数量不可超过一个!',
            closeIcon: (
              <></>
            ),
            duration: 5,
            icon: (
              <WarningOutlined
                style={{
                  color: 'white',
                }}
              />
            ),
          });
          return false
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
          num++
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        } else if (info.file.status === 'removed') {
          num--
        }
      };

      let customRequest = (file)=> {


        // const config = {
        //   headers: { "Content-Type": "multipart/form-data" }
        // };
        let test = {'file': file.file}
        console.log(test);
        axios.post("http://127.0.0.1:3000/codemarket/user/find-one", test)
        .then((response) => {
            console.log(response);
          //   if (response.status === 200) {
          //   console.log(response);
          // }
        })
        .catch(function (error) {
          console.log(error);
        });
      }

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
                                            {/* <Input placeholder="unavailable choice" id="error" /> */}
                                        
                                            <Input status={item.status} className={`${'data'+index}`} type={ index > 0 ? "number" : "text"} onChange={(e)=>{get_account(e,index)}} />
                                            {index === 1 ? '元' : ''}
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
                    <div>
                      相关文档<span>(选填)</span>

                        <Upload 
                          // accept='"Content-Type": "multipart/form-data"'
                          maxCount='1'
                          name="file"
                          // action='http://127.0.0.1:3030/upchain/storage'
                          // data={file}
                          customRequest={customRequest}
                          fileList={file}
                          beforeUpload={beforeUpload}
                          onChange={handleChange}
                        >
                          <Button icon={<UploadOutlined />}>Click to Upload</Button>
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