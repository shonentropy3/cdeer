import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import style from '../../styles/utils.module.scss'


export default function Myproject() {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('0');
    const handleVisibleChange = (flag) => {
        setVisible(flag);
    };
    const handleMenuClick = e => {
        title = e.key
        setTitle(title)
        console.log(list[e.key].url);
    }

    const list = [
        {
          key: '0',
          label: '所有状态',
          url:'查看全部'
        },
        {
          key: '1',
          label: '待支付',
          url:'查看待支付'
        },
        {
          key: '2',
          label: '招募中',
          url:'查看招募中'
        },
        {
          key: '3',
          label: '开发中',
          url:'查看招募中'
        },
        {
          key: '4',
          label: '已结束',
          url:'查看招募中'
        },
        {
          key: '5',
          label: '已取消',
          url:'查看招募中'
        }
      ]

    const menu = (
        <Menu
          selectable
          onClick={handleMenuClick}
          defaultSelectedKeys={['0']}
          className={style.w150}
          items={list}
        />
      );

      

    return(
        <div className={`Myproject ${style.pt5_} ${style.padding_0_20} ${style.bg1} ${style.h100vh}`}>
            <div className={`topbar ${style.between}`}>
                我发布的项目
                <div className={style.df}>
                    <Dropdown overlay={menu} onVisibleChange={handleVisibleChange} visible={visible} placement="bottomRight">
                        <Typography.Link>
                        <Space>
                            { list[title].label }
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

            </div>

        </div>
    )
}