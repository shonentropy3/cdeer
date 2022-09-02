import { Button } from 'antd';
import Link from 'next/link'
import { useState } from 'react';

export default function Header() {
    
    let [selectItem,setSelectItem] = useState([
        {title: '首页', url: '/', checked: true},
        {title: '寻找项目', url: '/projects', checked: false}
    ])

    const onchange = (title) => {
        selectItem.map((e,i) => {
            e.checked = false;
            if (e.title === title) {
                e.checked = true;
            }
        })
        setSelectItem([...selectItem]);
    }

    return <div className="Header">
        <div className="content">
            <div className="header-logo">
                <div className="img"></div>
                <p>LOGO</p>
            </div>
            <div className="header-nav">
                {
                    selectItem.map((e,i) => 
                        <Link key={i} href={{pathname:e.url}}>
                            <div className={`li ${e.checked ? 'li-active':''}`} onClick={() => onchange(e.title)}>
                                {e.title}
                                <div className="line" />
                            </div>
                        </Link>
                    )
                }

            </div>
            <div className="header-info">
                <div className="img"></div>
                <Button className="btn">连接钱包</Button>
            </div>
        </div>
    </div>
}