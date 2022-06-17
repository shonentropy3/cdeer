import { ethers } from 'ethers';
import contract from '../contracts/deployments/abi/CodeMarket.json';
import address from '../contracts/deployments/CodeMarket.json';
import { useEffect, useState, } from 'react';
import '../css/market.scss';
import axios from 'axios'
const contractAddress = address;
const abi = contract.abi;
function Market() {

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

    const roleData = () => {
      return <>
        {
          role.map((item,index)=> <div key={index} className={`check ${roleC === item.value ? 'active':''}`} onClick={()=>{Set_roleC(item.value)}} >{item.name}</div> )
        }
      </>
    }

    const pjcData = () => {
      return <>
        {
          pjc.map((item,index)=> <div key={index} className={`check ${pjcC === item.value ? 'active':''}`} onClick={()=>{Set_pjcC(item.value)}} >{item.name}</div> )
        }
      </>
    }

    // ============常量==>
    // 角色data
    const role = [{
      value: 'qb',
      name: '全部'
    },
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
    // 项目类型data
    const pjc = [{
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
    // ============变量==>
    // 发布订单数
    let[tokens,Set_tokens] = useState(0)

    // 首页数据
    let [data,Set_data] = useState({
        detail: '',
        state: 0,    // 0: loading; 1: success; 2: error
    })

    // 错误码
    let [error,Set_error] = useState('')
    
    // 角色check
    let [roleC,Set_roleC] = useState('')
     
    // 项目类型check
    let [pjcC,Set_pjcC] = useState('')

    
    useEffect(() => {
        checkWalletIsConnected();
        axios.get('http://192.168.1.7:3030/upchain/getProject')
            .then( res => {
                data.detail = res.data
                data.state = 1
                Set_data({...data})
                console.log(res.data);
            }) 
            .catch( err => {
                data.state = 2
                Set_data({...data})
                Set_error(err)
            })

            
      }, [])



    return(
        <div className="market">
            <div className="filter">
              <div className="_box">
                <div className="title">
                  角色
                </div>
                <div className="content">
                  {roleData()}
                </div>
              </div>
              <div className="_box">
                <div className="title">
                  项目类型
                </div>
                <div className="content">
                  {pjcData()}
                </div>
              </div>
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

export default Market;