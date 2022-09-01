import { useEffect, useState, } from 'react';
import Link from "next/link"
import { Spin, BackTop, Divider, Empty, Button } from 'antd';
import { getDemand, getFilter } from '../../http/api';
import style from '../../styles/utils.module.scss'
import { translatedPjc, translatedRole, sToDays } from '../../utils/translated';
import { useSignTypedData, useAccount, useNetwork } from 'wagmi'

export default function Findproject() {

  const { address, isConnecting, isDisconnected } = useAccount()
  const { chain, chains } = useNetwork()

  let [account,setAccount] = useState()

  useEffect(() => {
    account = address;
    setAccount(account);
  },[])

  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 31337,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  }
  
  // The named list of all type definitions
  const types = {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
    ],
  }
  
  const value = {
    from: {
      name: 'Cow',
      wallet: account,
    },
    to: {
      name: 'Bob',
      wallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    },
    contents: 'Hello, Bob!',
  }

  const { data: signData, isError, isLoading, isSuccess, signTypedData } =
    useSignTypedData({
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 31337,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      types: {
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      },
      value: {
        from: {
          name: 'Cow',
          wallet: account,
        },
        to: {
          name: 'Bob',
          wallet: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        },
        contents: 'Hello, Bob!',
      },
      onError(error) {
        console.log('Error', error)
      },
      onSuccess(data) {
        console.log('Success', data)
      },
    })

    useEffect(() => {
      isSuccess ? 
      console.log(signData)
      :
      ''
    },[isSuccess])



  const responseDate = () => {
    if (data.status === 0) {
        return <>
          <Spin />
        </>;
    }
    if (data.status === 1) {
      if (data.detail.data.length === 0 || data.detail === " ") {
        return <Empty />
      }
        return data.detail.data.map(
          // return sql.data.map(
          (item, index) => 
          <Link href={{pathname:'/developer/task/Info',search: item.id}} target="_blank" key={index}>
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
                      <span className={style.color_red}>${item.budget}</span>
                  </div>
                  <div>
                      <div className={style.flex_start}>
                        <div className={style.mr30}>
                          招募: {item.demand_role}
                        </div>
                        <div className={style.mr30}>
                          类型: {item.demand_type}
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

  // 筛选分类
  let filter = () => {
    data.status = 0;
    Set_data({...data})
    let obj = {
      role: roleC,
      task_type: pjcC
    }
    obj = JSON.stringify(obj)
    getFilter({obj: obj})
    .then(res => {
      Array.from(res.data).forEach((e,i) => {
        res.data[i].demand_role = translatedRole(e.role)
        res.data[i].demand_type = translatedPjc(e.task_type)
        res.data[i].period = sToDays(e.period)
      })
      data.detail = res;
      data.status = 1;
      Set_data({...data})
    })
  }

  // 获取页面数据
  const marketData = async()=>{
    await getDemand()
    .then(res => {
      Array.from(res.data).forEach((e,i) => {
        res.data[i].demand_role = translatedRole(e.role)
        res.data[i].demand_type = translatedPjc(e.task_type)
        res.data[i].period = sToDays(e.period)
      })
      data.detail = res
      data.status = 1
    })
    .catch(err => {
      data.status = 1
    })
    Set_data({...data})
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
  const _data = require('../../data/data.json')
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
      marketData()
    }, [])
    

    
  return (
    <div className="market">
            <Button disabled={isLoading} onClick={() => signTypedData()}>
              Sign typed data
            </Button>
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
