import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router'

export default function NavigationBar(params) {

    const { data } = params;
    const router = useRouter();

    const goWhere = (url) => {
        router.push(url)
    }

    return(
        <div className="NavigationBar">
            <Breadcrumb>
                <Breadcrumb.Item >
                    <HomeOutlined />
                </Breadcrumb.Item>

                {
                    data.map((e,i) => 
                        <Breadcrumb.Item key={i} className="cur" onClick={() => goWhere(e.url)}>
                            {/* <UserOutlined /> */}
                            <span>{e.label}</span>
                        </Breadcrumb.Item>
                    )
                }

            </Breadcrumb>
        </div>
    )
}