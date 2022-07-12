import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router'
import { useEffect } from 'react';

export default function NavigationBar(params) {
    const router = useRouter()
    useEffect(()=>{
        console.log(params);
    },[])
    return(
        <div className="NavigationBar">
            <Breadcrumb>
                <Breadcrumb.Item >
                    <HomeOutlined />
                </Breadcrumb.Item>

                <Breadcrumb.Item onClick={() => router.back()}>
                    {/* <UserOutlined /> */}
                    <span>找项目</span>
                </Breadcrumb.Item>
                
                <Breadcrumb.Item>
                    项目详情
                </Breadcrumb.Item>
            </Breadcrumb>
        </div>
    )
}