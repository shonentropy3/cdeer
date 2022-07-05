import Link from 'next/link'
// import style from '../../styles/header.module.scss'
// import { MessageOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
function Header() {    return (
        <div className='header'>
            <div className="left">
                <div className="logo">

                </div>
                <div className="nav">
                    <Link href="/">
                    <div className="_li">
                        找项目
                    </div>
                    </Link>
                    <div className="_li">
                        原型广场
                    </div>
                    <div className="_li">
                        帮助中心
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="zone">
                    <Link href="/views/Myproject">
                        <div className="_li">
                            我发布的项目
                        </div>
                    </Link>
                    <Link href="/views/Publish">
                        <div className="_li">
                            发布项目
                        </div>
                    </Link>
                    

                </div>
                <Link href="/views/My">
                    <div className="avt">

                    </div>
                </Link>
            </div>
        </div>
    )
}
export default Header