import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ProjectList from '../../components/ProjectList';
import style from '../../styles/utils.module.scss'

export default function Myproject() {
    const _data = require("../data/data.json")
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('0');
    const [test, setTest] = useState('');
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

      // 账号
      const [currentAccount, setCurrentAccount] = useState(null);

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

      useEffect(()=>{
        console.log('获取当前账号登陆状态');
        connectWalletHandler()
      },[])

    return(
        <div className={`Myproject ${style.pt5_} ${style.padding_0_20} ${style.bg1} ${style.h100vh}`}>
            <div className={`topbar ${style.between}`}>
                我发布的项目
                <div className={style.df}>
                    <Dropdown overlay={menu} onVisibleChange={handleVisibleChange} visible={visible} placement="bottomRight">
                        <Typography.Link>
                        <Space>
                            { _data.list[title].label }
                            <CaretDownOutlined />
                        </Space>
                        </Typography.Link>
                    </Dropdown>
                    <div className={style.btn_blue}>
                        发布新项目
                    </div>
                </div>
            </div>
            <div className={`content`}>
                <h1>{test}</h1>
                <div className="list">
                    <ProjectList />
                    <ProjectList />
                </div>
            </div>

        </div>
    )
}