import '../css/header.scss'
import {
    //用于跳转路由
    useNavigate
} from 'react-router-dom';
function Header() {
    let navigate = useNavigate();

    return (
        <div className="header">
            <div className="left">
                <div className="logo">

                </div>
                <div className="nav">
                    <div className="_li" onClick={()=>{navigate('/')}}>
                        找项目
                    </div>
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
                    <div className="_li">
                        我发布的项目
                    </div>
                    <div className="_li" onClick={()=>{navigate('/publish')}}>
                        发布项目
                    </div>
                    <div className="_li">
                        在线沟通
                    </div>
                </div>
                <div className="avt">

                </div>
            </div>
        </div>
    )
}
export default Header