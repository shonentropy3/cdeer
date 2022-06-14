import { useAxios } from "use-axios-client";
import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/deployments/abi/CodeMarket.json';
import address from './contracts/deployments/CodeMarket.json';
import { ethers } from 'ethers';

const contractAddress = address;
const abi = contract.abi;


function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const { data, error, loading } = useAxios({
    url: "http://127.0.0.1:3030/test/getProject"
  });
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
        // const kokens = nftContract.tokensAmount("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
        // console.log("countract",kokens)
        console.log("Initialize payment");
          let nftTxn = await nftContract.createProject({ 
            title: "test",
            price: 10,
            content: "test text",
            time: 786942864435
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

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }
  
  const responseData = []

  const responseDate = () => {
    if (error){
      return `Error: ${error.message}`;
    }else if (loading || !data) {
      return "Loading...";
    }else{
      for (let project of data) {
        responseData.push( // 循环每本书，构建 JSX，push 到数组中
          <div>
            <div>创建地址：{project.sender_adddress}</div>
            <div>NFT-ID：{project.token_id}</div>
            <div>标题：{project.title}</div>
            <div>价格：{project.price}</div>
            <div>项目内容：{project.pro_content}</div>
            <div>创建时间：{project.pro_time}</div>
            <hr />
          </div>
        )
      }
      console.log(responseData) 
      return responseData;
      const props = data.reduce((acc,item) => 
        [...new Set([...acc, ...Object.keys(item)])]
      , []);
      console.log(props)

    const records = data.map(item =>
      props.map(key => item[key])
    );

    console.log(records);
      console.log(data.id)
    } 
    }
  


  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])



  const [name, setName] = useState('');
console.log(setName)
  return (



    <div className='main-app'>
      <h1>Code—Market</h1>

      <div>




      <div>
      <input ype="text" onChange={(value) => setName(value)} value={name} />
				{/* <input type="text" ref={input => this.input = input} defaultValue="Hello"/>
				<button onClick={this.search.bind(this)}></button> */}
			</div>

        <div >
                <br />title:
                <input type="text" v-model="recipient" />
                <br />
                <br /> price:
                <input type="text" v-model="amount" />
                <br />
                <br />content:
                <input type="text" v-model="recipient" />
        </div>
        <br />
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>

      <div>
      <br /><br /><br />
        <br /> content : ”test“
        <br /> 我的token : "test"
        <br /><br /><br /><br /><br />
      </div>

      <div>
       {(responseDate())}
      </div>


    </div>

  )

  
}


export default App;
