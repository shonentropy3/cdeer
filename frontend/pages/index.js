import { ethers } from 'ethers';
import contract from '../contracts/deployments/abi/CodeMarket.json';
import address from '../contracts/deployments/CodeMarket.json';
import { useEffect, useState, } from 'react';
import Link from "next/link"
import { Spin, BackTop, Divider, Empty } from 'antd';
import { getDemand } from './http/api';
import style from '../styles/utils.module.scss'
import { translatedPjc, translatedRole } from './utils/translated';


const contractAddress = address;
const abi = contract.abi;
export default function Home() {

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
    if (data.status === 0) {
        return <>
          <Spin />
        </>;
    }
    if (data.status === 2) {
        // return "Error:"+error;
    }
    if (data.status === 1) {
      if (data.detail.data.length === 0) {
        return <Empty />
      }
        return data.detail.data.map(
          // return sql.data.map(
          (item, index) => 
          <Link href={{pathname:'/views/Pro_detail',search: item.id}} target="_blank" key={index}>
          <div className={`li ${style.item_container}`}>
              <div className={style.item_img}>
                {/* <img src={item.cover} alt="" /> */}
              </div>
              <div className={`${style.item_content} ${style.ml20}`}>
                  <div className={style.between}>
                      <p>
                        NO.{item.id}
                        <span className={style.ml10}>{item.name}</span>
                      </p>
                      <span className={style.color_red}>¥{item.budget}</span>
                  </div>
                  <div>
                      <div className={style.flex_start}>
                        <div className={style.mr30}>
                          招募: {item.role}
                        </div>
                        <div className={style.mr30}>
                          类型: {item.pro_type}
                        </div>
                        <div>
                          {/* 周期: {item.period} */}
                          周期: {item.period}天
                        </div>
                      </div>
                  </div>
                  <div>
                    {item.create_time}
                    <Divider type="vertical" />

                  </div>
              </div>
          </div>
          </Link>
      );
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

  // 筛选分类
  let filter = () => {
    console.log(pjcC,roleC);
  }

  // 获取页面数据
  const marketData = async()=>{
    await getDemand()
    .then(res => {
      Array.from(res).forEach((e,i) => {
        res[i].role = translatedRole(e.role)
        res[i].pro_type = translatedPjc(e.pro_type)
      })
      data.detail = res
      data.status = 1
    })
    .catch(err => {
      data.status = 1
    })


    Set_data({...data})


    
    console.log('data==>',data);
  }

  let checkRole = (val) => {
    roleC = val
    Set_roleC(roleC)
    filter()
  }

  let checkPjc = (val) => {
    pjcC = val
    Set_pjcC(val)
    filter()
  }

  const roleData = () => {
    return <>
      {
        role.map((item,index)=> <div key={index} className={`check ${roleC === item.value ? 'active':''}`} onClick={()=>{checkRole(item.value)}} >{item.name}</div> )
      }
    </>
  }

  const pjcData = () => {
    return <>
      {
        pjc.map((item,index)=> <div key={index} className={`check ${pjcC === item.value ? 'active':''}`} onClick={()=>{checkPjc(item.value)}} >{item.name}</div> )
      }
    </>
  }

  // ============常量==>
  const _data = require('./data/data.json')
  const role = _data.market_role
  const pjc = _data.pjc

  // ============变量==>
  // 发布订单数
  let[tokens,Set_tokens] = useState(0)

  // 首页数据
  let [data,Set_data] = useState({
      detail: '',
      status: 0,    // 0: loading; 1: success; 2: error
  })
  
  // 角色check
  let [roleC,Set_roleC] = useState(null)
   
  // 项目类型check
  let [pjcC,Set_pjcC] = useState(null)

  useEffect(() => {
      checkWalletIsConnected();
      marketData()
    }, [])
  


    
  return (
    <div className="market">
            <div className="filter">
              <div className="_box">
                <div className="title">
                  角色
                </div>
                <div className="desc">
                  {roleData()}
                </div>
              </div>
              <div className="_box">
                <div className="title">
                  项目类型
                </div>
                <div className="desc">
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
      <BackTop>
        <div>回到顶部</div>
      </BackTop>
  </div>
  )
}
