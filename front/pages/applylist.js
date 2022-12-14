import { useEffect, useState } from "react"
import qs from 'querystring';
import { getApply, updatedApplySort } from "../http/_api/task";
import { searchTask, searchTaskDetail } from "../http/_api/public";
import { deform_Count, deform_Skills } from "../utils/Deform";
import { getDate } from "../utils/GetDate";
import Image from "next/image";
import Computing_time from "../components/Computing_time";
import UserInfoModal from "../components/CustomModal/UserInfoModal";
import { useAccount, useProvider } from "wagmi";
import { message } from "antd";
import InviteModal from "../components/CustomModal/InviteModal";
import { useContracts } from "../controller";
import { ethers } from "ethers";
import { createOrder } from "../http/_api/order";
import { useRouter } from "next/router";

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

    const invitation = (amount) => {
        contractParams.amount = ethers.utils.parseEther(`${amount}`);
        useOrderContractWrite.write({
            recklesslySetUnpreparedArgs: [
                contractParams.task_id,
                address,
                contractParams.worker,
                contractParams.token,
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
              router.push(`/task?w=issuer&bar=developping`)    //  跳转链接
          }, 500);
        })
        .catch(err => {
          message.error('操作失败')
        })
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
                setData([...data]);
            }
        })
        await searchTaskDetail({task_id: task_id})
        .then(res => {
            if (res.code === 0) {
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
                            <span>{detail.budget}{detail.currency}</span>
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

                                </div>
                                <div className="product-info">
                                    <p className="applicant-name" >{e.address}<span onClick={()=>showUserInfo(e.user)}>View personal information</span></p>
                                    <p className="applicant-skill">
                                        <i className="good-skill">Good at skills：</i>
                                        {
                                            deform_Skills(e.user.role).map((e,i)=><span key={i}>{e}</span>)
                                        } 
                                    </p>
                                    <div className="applicant-mess">
                                        <div className="applicant-mess-item">
                                            <Image src="/telegram.png" alt="" quality={100} width={29} height={29} />
                                        </div>
                                        <div className="applicant-mess-item">
                                            <Image src="/skype.png" alt="" quality={100} width={29} height={29} />
                                        </div>
                                        <div className="applicant-mess-item">
                                            <Image src="/wechat.png" alt="" quality={100} width={29} height={29} />
                                        </div>
                                        <div className="applicant-mess-item">
                                            <Image src="/discord.png" alt="" quality={100} width={29} height={29} />
                                        </div>
                                        <div className="applicant-mess-item">
                                            <Image src="/whatsapp.png" alt="" quality={100} width={29} height={29} />
                                        </div>
                                    </div>
                                </div>
                                <div className="product-apply">
                                    <span className="product-apply-he">His offer:</span>
                                    <span className="product-apply-price">{e.price}ETH</span>
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
                            <div className="product-collaborate">
                                <p onClick={() => invite(e.apply_addr)}>Invite</p>
                                <p onClick={() => updateData(e)} className="product-collaborate-no">Improper</p>
                            </div>
                        </div>
                    </li> )
                }
            </ul>
        </div>
    </div>
    </div>
}