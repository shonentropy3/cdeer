import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ProjectList from '../../components/ProjectList';
import style from '../../styles/utils.module.scss'
import { getMyDemand,getApplyinfo } from '../http/api';
import { translatedPjc, translatedRole } from '../utils/translated'


export default function Myproject() {
    const _data = require("../data/data.json")
    const [account,setAccount] = useState('')
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('0');
    const [test, setTest] = useState('');
    const [selectItem,setSelectItem] = useState('item-1')
    let [pjcList,setPjcList] = useState([])
    let [applyList,setApplyList] = useState([])

    const items = [
      { label: '我发布的项目', key: 'item-1'}, // 菜单项务必填写 key
      { label: '我开发的项目', key: 'item-2'}
    ];

    const handleVisibleChange = (flag) => {
        setVisible(flag);
    };
    const handleMenuClick = e => {
        title = e.key
        test = _data.list[e.key].label
        setTest(test)

        setTitle(title)
    }

    const menu = (
        <Menu
          selectable
          onClick={handleMenuClick}
          defaultSelectedKeys={['0']}
          className={style.w150}
          items={_data.list}
        />
    );

    // 我发布的需求
    const getIssue = async() => {
      await connectWalletHandler()
      getMyDemand({hash: account})
      .then(res => {
          Array.from(res).forEach((e,i) => {
            res[i].roleNew = translatedRole(e.role)
            res[i].pro_typeNew = translatedPjc(e.task_type)
          })
          pjcList = res;
          setPjcList([...pjcList])
      })
    }

    const issue = () => {
      return  <div className={`content`}>
                <h1>{test}</h1>
                <div className="list">
                    {
                      pjcList.map((ele,index) => <ProjectList data={ele} key={index} type="demand" />)
                    }
                </div>
              </div>
    }
    // 我开发的项目
    const getExploitation = () => {
      getApplyinfo({id:account})
        .then(res => {
          if (res.data.length > 0) {
            let arr = []
            res.data.forEach(ele => {
              getMyDemand({demand_id: ele.task_id})
                .then(res => {
                  arr.push(res[0])
                  applyList = arr
                  setApplyList([...applyList])
                })
            })
          }
        })
    }

    const exploitation = () => {
      return  <div className={`content`}>
                <h1></h1>
                <div className="list">
                    {
                      applyList.map((ele,index) => <ProjectList data={ele} key={index} type="exploitation" />)
                    }
                </div>
              </div>
    }

    const panel = () => {
      switch (selectItem) {
        case 'item-1':
            return  issue()
        case 'item-2':
            return  exploitation()
        default: 
            break
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
          account = await accounts[0]
          setAccount(account)

        } catch (err) {
          alert('请登录')
        }
    }

    const toggleNav = (item) => {
      selectItem = item.key
      setSelectItem(selectItem)
    }

    useEffect(() => {
        switch (selectItem) {
            case 'item-1':
                getIssue()
                break;
            case 'item-2':
                getExploitation()
                break;
            default:
                break;
        }
    },[selectItem])

    return(
      <>
      
        <div className={`Myproject ${style.pt5_} ${style.padding_0_20} ${style.bg1} ${style.h100vh}`}>
          
            <div className={`topbar ${style.between} ${style.bgwhite} ${style.pdr10}`}>
            <Menu 
              items={items} 
              mode="horizontal"
              selectedKeys={selectItem}
              onSelect={(item)=>toggleNav(item)}
            />
                <div className={style.df}>
                    <Dropdown overlay={menu} onVisibleChange={handleVisibleChange} visible={visible} placement="bottomRight">
                        <Typography.Link>
                        <Space>
                            { _data.list[title].label }
                            <CaretDownOutlined />
                        </Space>
                        </Typography.Link>
                    </Dropdown>
                    {/* <div className={style.btn_blue}>
                        发布新项目
                    </div> */}
                </div>
            </div>
            { panel() }
        </div>
      </>
    )
}