import { ethers } from 'ethers';
import contract from '../contracts/deployments/abi/CodeMarket.json';
import address from '../contracts/deployments/CodeMarket.json';
import { useEffect, useState, } from 'react';
import '../css/login.scss';
import axios from 'axios'
const contractAddress = address;
const abi = contract.abi;
function Login() {

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

    const tokensAmount = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress.address, abi, signer);
          let num = await nftContract.tokensAmount("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
          Set_tokens(JSON.parse(num))
        }
       } catch (err) {
          console.log(err);
        }

    }




    const mintNftHandler = async () => {
  
        try {
          const { ethereum } = window;
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(contractAddress.address, abi, signer);
            console.log("Initialize payment");
            
            let obj = {}
            for (let i = 0; i < account.length; i++) {
                obj[account[i].title] = account[i].value
            }
            // ===============
            //  将角色，项目标签数据存入数据库
            // 内容,角色,项目类型
            // if (tuan.length === 0 && ge === null && pjc.length === 0) {
            //   alert('角色、项目类型不能为空')
            //   return
            // }
            let role = ''
            let project = ''
            // if (tuan.length === 0) {
            //   role = ge
            // }else{
            // }
              tuan.forEach((e,i)=>{
                role+=e
                if (i !== tuan.length-1) {
                  role+=','
                }
              })
            
            pjc.forEach((e,i)=>{
              project+=e
              if (i !== pjc.length-1) {
                project+=','
              }
            })

            console.log(account[3].value,'<===>',role,'<===>',project);
            
            // return
            let data = [account[3].value,role,project];
            axios.post(`http://192.168.1.7:3030/upchain/insertLabel`,data)

            .then(res=>{
                console.log('res=>',res);            
            })
            .catch(err=>{
              console.log(err);
            })

            let nftTxn = await nftContract.createProject({
              title: obj.title,
              price: Number(obj.price),
              content: obj.content,
              time: Number(obj.time)
            });
            console.log("Mining... please wait");
            await nftTxn.wait();



          } else {
            console.log("Ethereum object does not exist");
          }
    
        } catch (err) {
          console.log(err);
        }
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

    const responseDate = () => {
        if (data.state === 0) {
            return "Loading...";
        }
        if (data.state === 2) {
            return "Error:"+error;
        }
        if (data.state === 1) {
            return data.detail.map(
                    (item, index) => <div key={index} className="li" >
                        <div>创建地址：{item.sender_adddress}</div>
                        <div>NFT-ID：{item.token_id}</div>
                        <div>标题：{item.title}</div>
                        <div>价格：{item.price}</div>
                        <div>项目内容：{item.pro_content}</div>
                        <div>创建时间：{item.pro_time}</div>
                    </div>
                );
        }
        console.log(data.state);
    }

    // 个人角色类型
    // const individual = [
    //   {
    //     value: 1001,
    //     name: '开发工程师'
    //   },
    //   {
    //     value: 1002,
    //     name: '设计师'
    //   },
    //   {
    //     value: 1003,
    //     name: '产品经理'
    //   },
    //   {
    //     value: 1004,
    //     name: '测试工程师'
    //   }
    // ]

    // 团队角色类型
    const team = [
      {
        value: 2001,
        name: '开发工程师'
      },
      {
        value: 2002,
        name: '设计师'
      },
      {
        value: 2003,
        name: '产品经理'
      },
      {
        value: 2004,
        name: '测试工程师'
      }
    ]

    // 项目类型
    const project = [
      {
        value: 3001,
        name: 'Web网站'
      },
      {
        value: 3002,
        name: 'APP开发'
      },
      {
        value: 3003,
        name: '微信公众号'
      },
      {
        value: 3004,
        name: '小程序'
      },
      {
        value: 3005,
        name: 'HTML5应用'
      },
      {
        value: 3006,
        name: '其他项目'
      },
    ]

    // 角色选择(输出)
    const roleBox = () => {
      // if (role === '1') {
      //   return(  <div className="check">
      //                 选择具体角色
      //                   {
      //                     individual.map((item,index)=> <div className="result" key={index}>
      //                       <input type="radio" value={item.value} name="role" onChange={e=>{get_ge(e)}}/>{item.name}
      //                     </div> )
      //                   }
      //           </div> 
      //   )
      // }
      // if (role === '2') {
      // }
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
                          project.map((item,index)=> <div className="result" key={index}>
                            <input type="checkbox" value={item.value} name="role" onChange={e=>{get_pjc(e)}}/>{item.name}
                          </div> )
                        }
                      </div>
                        
        </> 
        
      )
    }

    // 角色类型绑定
    // let get_type = e => {
    //   role = e.target.defaultValue
    //   Set_role(role)
    // }
    // 输入绑定
    let get_account = (e,i) =>{
        account[i].value = e.target.value;
        Set_account([...account])
    }
    // 个人角色绑定
    // let get_ge = e => {
    //   let res = e.target.defaultValue
    //   ge = res
    //   Set_ge(ge)
    // }
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
      console.log(pjc);
    }

    // 发布订单数
    let[tokens,Set_tokens] = useState(0)
    // 角色类型
    // let [role,Set_role] = useState(0)
    // 输入数据
    let [account,Set_account] = useState(
      [
          {
              title: '项目名称',
              value: ''
          },
          {
              title: '项目预算',
              value: ''
          },
          {
            title: '项目周期',
            value: ''
          },
          {
              title: '项目描述',
              value: ''
          }
          
      ]
    )
    // 个人角色
    // let [ge,Set_ge] = useState(null)
    // 团队角色
    let [tuan,Set_tuan] = useState([])
    // 项目类型
    let [pjc,Set_pjc] = useState([])
    
  
    // 首页数据
    let [data,Set_data] = useState({
        detail: '',
        state: 0,    // 0: loading; 1: success; 2: error
    })
    // 错误码
    let [error,Set_error] = useState('')
    
     

    
    useEffect(() => {
        checkWalletIsConnected();
        axios.get('http://192.168.1.7:3030/upchain/getProject')
            .then( res => {
                data.detail = res.data
                data.state = 1
                Set_data({...data})
            }) 
            .catch( err => {
                data.state = 2
                Set_data({...data})
                Set_error(err)
            })

            
      }, [])



    return(
        <div id="Login">
            <div className="box">
                <h1>Code-Market</h1>
                {
                    account.map((item,index) => <div key={index} className={`inner`}>
                        <div className="title">
                            {item.title}
                        </div>
                        <div className="content">
                          {
                            index !== account.length - 1 ? 
                            <>
                              <input className={`${'data'+index}`} type="text" onChange={(e)=>{get_account(e,index)}} />
                              {index === 1 ? '元' : ''}
                              {index === 2 ? '天' : ''}
                            </>
                            :
                            <>
                              <textarea name="" id="" cols="30" rows="10"></textarea>
                            </>
                          }
                          
                        </div>
                        
                    </div>
                    )
                }
                <div className="type">
                  {/* <div className="check">
                        选择您招募的角色类型
                        <input type="radio" value={1} name="type" onChange={e=>{get_type(e)}}/>招募个人
                        <input type="radio"  value={2} name="type" onChange={e=>{get_type(e)}}/>招募团队
                  </div> */}
                  {roleBox()}
                </div>
                <div className="type">
                  {typeBox()}
                </div>
                <div>
                      发布项目总数：{tokens}
                </div>
                {buttonModel()}

            </div>
            <div className="ul">
                <div className="search">
                    <input type="text" name="" id="" />
                </div>
                {responseDate()}
            </div>
        </div>
    )
}

export default Login;