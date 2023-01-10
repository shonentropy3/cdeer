import { useEffect, useState } from "react"
import qs from 'querystring';
import { getApply, updatedApplySort } from "../http/_api/task";
import { searchTaskDetail } from "../http/_api/public";
import { deform_Count, deform_Skills } from "../utils/Deform";
import { getDate } from "../utils/GetDate";
import Image from "next/image";
import Computing_time from "../components/Computing_time";
import UserInfoModal from "../components/CustomModal/UserInfoModal";
import { useAccount, useProvider } from "wagmi";
import { message } from "antd";
import InviteModal from "../components/CustomModal/InviteModal";
import { useContracts, useRead } from "../controller";
import { ethers } from "ethers";
import { createOrder } from "../http/_api/order";
import { useRouter } from "next/router";
import Identicon from "identicon.js";
import { Sysmbol } from "../utils/Sysmbol";
import { Currency } from "../utils/Currency";

export default function ApplyList(params) {

    const router = useRouter();
    const { address } = useAccount();
    const provider = useProvider();
    const { useOrderContractWrite } = useContracts('createOrder');
    
    let [data, setData] = useState([]);     //  报名列表
    let [detail, setDetail] = useState({});     //  需求详情

    let [userInfo, setUserInfo] = useState({});     //  用户详情
    let [isUserInfo, setIsUserInfo] = useState(false);      //  用户详情弹窗

    const [isModalOpen, setIsModalOpen] = useState(false);      //  邀请弹窗
    let [contractParams, setContractParams] = useState({});
    const [loading, setLoading] = useState(false);

    // approve ==> allowance
    // dUSDT
    const { usedUSDTRead: dUSDTallowance } = useRead('allowance', [address, process.env.NEXT_PUBLIC_PERMIT2])
    const { usedUSDTContractWrite: dUSDTapprove } = useContracts('approve');


    // 更改排序
    const updateData = (e) => {
        updatedApplySort({
            apply_addr: e.apply_addr, task_id: e.task_id
        })
        .then(res => {
            if (res.code === 0) {
                message.success('更新成功!');
                init();
            }else{
                message.error(res.msg);
            }
        })
    }

    // 用户详情弹窗
    const showUserInfo = (info) => {
        userInfo = info;
        setUserInfo({...userInfo});
        setIsUserInfo(true);
    }

    // 甲方邀请乙方弹窗
    const invite = (add) => {
        contractParams.worker = add;
        setContractParams({...contractParams});
        setIsModalOpen(true);
    }

    const tokenIsApprove = async(approve) => {
        await approve.writeAsync({
            recklesslySetUnpreparedArgs: [
                process.env.NEXT_PUBLIC_PERMIT2, (Math.pow(2,32)-1).toString()
            ]
        })
    }

    const invitation = async(amount,token) => {
        setLoading(true);
        // 判断是否为ERC20
        if (token != ethers.constants.AddressZero) {
            // 判断当前币种是否approve ==> 发起approve
            switch (token) {
                case Sysmbol().dUSDT:
                    if (dUSDTallowance.data.toString() == 0) {
                        await tokenIsApprove(dUSDTapprove)
                    }
                    break;
            
                default:
                    break;
            }
        }

        contractParams.amount = Currency(token,amount)
        useOrderContractWrite.write({
            recklesslySetUnpreparedArgs: [
                contractParams.task_id,
                address,
                contractParams.worker,
                token,
                contractParams.amount
            ]
        })
    }

    const writeSuccess = async() => {
        const hash = useOrderContractWrite.data.hash;
        await createOrder({hash: hash})
        .then(res => {
            if (res.code !== 0) {
                message.error(res.msg)
            }
        })

        // 判断交易是否成功上链
        await provider.getTransaction(hash)
        .then(res => {
          message.success('操作成功');
          setTimeout(() => {
              router.push(`/user/projects?w=issuer&bar=developping`)    //  跳转链接
          }, 500);
        })
        .catch(err => {
          message.error('操作失败')
        })
    }

    // 头像
    const hashAvt = (address) => {
        var hash = address;  // 15+ hex chars
        // var options = {
        //     foreground: [r, g, b, 255],               // rgba black
        //     background: [255, 255, 255, 255],         // rgba white
        //     margin: 0.2,                              // 20% margin
        //     size: 420,                                // 420px square
        //     format: 'svg'                             // use SVG instead of PNG
        //     };
        // create a base64 encoded SVG
        // var data = new Identicon(hash, options).toString();
        var data = new Identicon(hash, {format: 'svg'}).toString();
        data = `data:image/svg+xml;base64,${data}`
        return data
    }

    const init = async() => {
        const { task_id } = qs.parse(location.search.slice(1));
        contractParams = {
            task_id: task_id,
            address: address,
            token: ethers.constants.AddressZero
        }
        setContractParams({...contractParams});

        await getApply({task_id: task_id})
        .then(res => {
            if (res.code === 0) {
                data = res.data.list;
                console.log(res);
                setData([...data]);
            }
        })
        await searchTaskDetail({task_id: task_id})
        .then(res => {
            if (res.code === 0 && res.data.list) {
                
                detail = res.data.list[0];
                detail.role = deform_Skills(detail?.role || []);
                detail.budget = deform_Count(detail.budget,detail.currency);
                setDetail(detail);

            }
        })
    }   

    useEffect(() => {
        init();
    },[])

    useEffect(() => {
        switch (useOrderContractWrite.status) {
            case 'success':
                writeSuccess();
                setLoading(false);
                break;
            case 'loading':
                setLoading(true);
                break;
            default:
                setLoading(false);
                break;
        }
    },[useOrderContractWrite.status])
    
    return <div className="Applylist">
        {/* 用户详情弹窗 */}
        <UserInfoModal show={isUserInfo} setShow={setIsUserInfo} userInfo={userInfo} />
        {/* 邀请乙方弹窗 */}
        {
            isModalOpen && <InviteModal close={setIsModalOpen} invitation={invitation} loading={loading} />
        }
        {
            detail &&
                <div className="task-info">
                    <div className="task-demand">
                        <p className="task-title">{detail.title}</p>
                        <p className="task-skill">
                            <i className="skill-tip">Recruitment type:</i>
                            {
                                detail.role?.map((e,i)=><span key={i}>{e}</span>)
                            }
                        </p>
                        <p className="task-cycle">cycle：
                            <span>{parseInt(detail.period/86400)}天</span>
                            Cost：
                            {
                                detail.budget == 0 ? 
                                <span>可报价</span>
                                :
                                <span>{detail.budget}{detail.currency}</span>
                            }
                        </p>
                    </div>
                    {/* <div className="task-changeInfo" onClick={showModifyModal}>修改信息</div> */}
                    {/* <div className="task-delete" onClick={deleteTask}>删除任务</div> */}
                    {/* <div className="task-apply-switch" onClick={applyHandler}>{allInfo.apply_switch?"关闭报名":"开启报名"}</div> */}
                    <div className="apply-number">
                        <p className="a-number">{detail.apply_count}</p>
                        <p className="a-tip">Number of applicants</p>
                    </div>
                </div>
        }
    <div className="task-list">
        <h4>Registration list</h4>
        <div className="product-list">
            <ul>
                {
                    data.map((e,i) => <li key={i} className={getDate(e.sort_time,'y') != '1-' ? 'sort':''} >
                        <div className="product-list-item">
                            <div className="product-list-info">
                                <div className="product-img">
                                    {
                                        process &&
                                        <img 
                                            src={ e.user.avatar ? 
                                            process.env.NEXT_PUBLIC_DEVELOPMENT_API + "/" + e.user.avatar 
                                            :
                                            hashAvt(e.apply_addr)} 
                                        />
                                    }
                                </div>
                                <div className="product-info">
                                    <p className="applicant-name" >{e.user.username ? e.user.username : e.apply_addr.substring(0,5)+"..."+e.apply_addr.substring(38,42)}<span onClick={()=>showUserInfo(e.user)}>View personal information</span></p>
                                    <p className="applicant-skill">
                                        <i className="good-skill">Good at skills：</i>
                                        {
                                            deform_Skills(e.user.role).map((e,i)=><span key={i}>{e}</span>)
                                        } 
                                    </p>
                                    <div className="applicant-mess">
                                        <div className="applicant-mess-item">
                                            {
                                                e.user.telegram ? <Image src="/icon/telegram.png" alt="" quality={100} width={29} height={29} /> : ''
                                            }
                                        </div>
                                        <div className="applicant-mess-item">
                                            {
                                                e.user.skype ? 
                                                <Image src="/icon/skype.png" alt="" quality={100} width={29} height={29} /> : ''
                                            }
                                        </div>
                                        <div className="applicant-mess-item">
                                            {
                                                e.user.wechat ? <Image src="/icon/wechat.png" alt="" quality={100} width={29} height={29} /> : ''
                                            }
                                        </div>
                                        <div className="applicant-mess-item">
                                            {
                                                e.user.discord ? <Image src="/icon/discord.png" alt="" quality={100} width={29} height={29} /> : ''
                                            }
                                        </div>
                                        <div className="applicant-mess-item">
                                            {
                                                e.user.phone ? <Image src="/icon/whatsapp.png" alt="" quality={100} width={29} height={29} /> : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="product-apply">
                                    <p className="amount">
                                        His offer:
                                        <span>{ Math.floor(e.price / Math.pow(10, 18)) / 100 }</span>
                                    </p>
                                    <div className="product-apply-time">
                                        <span className="product-apply-time-icon"><img src="/clock.jpg" /></span>
                                        <Computing_time create_time={e.created_at} />
                                    </div>
                                </div>
                            </div>
                            <div className="product-apply-desc">
                                <span></span>
                                <div className="product-apply-desc-text">
                                    <p>{e.desc}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            {
                                address && 
                                <div className="product-collaborate">
                                    <p onClick={() => invite(e.apply_addr)}>Invite</p>
                                    <p onClick={() => updateData(e)} className="product-collaborate-no">Improper</p>
                                </div>
                            }
                        </div>
                    </li> )
                }
            </ul>
        </div>
    </div>
    </div>
}