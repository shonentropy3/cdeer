import { ethers } from 'ethers';
import contract from '../contracts/deployments/abi/CodeMarket.json';
import address from '../contracts/deployments/CodeMarket.json';
import { useEffect, useState } from 'react';
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

    const mintNftHandler = async () => {
  
        try {
          const { ethereum } = window;
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(contractAddress.address, abi, signer);
            
            console.log("countract",nftContract)
            console.log("Initialize payment");
            // console.log(account);
            let obj = {}
            for (let i = 0; i < account.length; i++) {
                obj[account[i].title] = account[i].value
            }
              let nftTxn = await nftContract.createProject(obj);
            console.log("Mining... please wait");
            await nftTxn.wait();
          } else {
            console.log("Ethereum object does not exist");
          }
    
        } catch (err) {
          console.log(err);
        }
    }

    const connectWalletButton = () => {
        return (
          <button onClick={connectWalletHandler} className='btn connect'>  
          {/* 未登录 */}
            Connect Wallet
          </button>
        )
    }

    const mintNftButton = () => {
        return (
          <button onClick={mintNftHandler} className='btn login'>
          {/* 已登录 */}
            Mint NFT
          </button>
        )
    }

    const responseDate = () => {
        if (data.state === 0) {
            return "Loading...";
        }
        if (data.state === 2) {
            return "Error:",error;
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
    }

    // 数据绑定
    let get_account = (e,i) =>{
        account[i].value = e.target.value;
        Set_account([...account])
    }

    // 首页数据
    let [data,Set_data] = useState({
        detail: '',
        state: 0,    // 0: loading; 1: success; 2: error
    })
    // 错误码
    let [error,Set_error] = useState('')
    // input数据
    let [account,Set_account] = useState(
        [
            {
                title: 'title',
                value: ''
            },
            {
                title: 'price',
                value: ''
            },
            {
                title: 'content',
                value: ''
            },
            {
                title: 'time',
                value: ''
            },
        ]
    )

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
                    account.map((item,index)=><div key={index} className="inner">
                        <div className="title">
                            {item.title}:
                        </div>
                        <input type="text" onChange={(e)=>{get_account(e,index)}} />
                    </div>
                    )
                }
                {currentAccount ? mintNftButton() : connectWalletButton()}
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