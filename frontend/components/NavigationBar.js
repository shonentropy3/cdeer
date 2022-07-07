import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import Link from "next/link";
import { useEffect } from 'react';

export default function NavigationBar(params) {
    useEffect(()=>{
        console.log(params);
    },[])
    return(
        <div className="NavigationBar">
            <Breadcrumb>
                <Breadcrumb.Item >
                <HomeOutlined />
                </Breadcrumb.Item>
                <Link href="/">
                <Breadcrumb.Item href="">
                {/* <UserOutlined /> */}
                <span>找项目</span>
                </Breadcrumb.Item>
                </Link>
                <Breadcrumb.Item>
                    项目详情
                </Breadcrumb.Item>
            </Breadcrumb>
        </div>
    )
}