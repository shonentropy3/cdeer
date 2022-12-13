import { useEffect, useState } from "react"
import qs from 'querystring';
import { getApply } from "../http/_api/task";
import { searchTask, searchTaskDetail } from "../http/_api/public";
import { deform_Count, deform_Skills } from "../utils/Deform";
import { getDate } from "../utils/GetDate";
import Image from "next/image";
import Computing_time from "../components/Computing_time";
import UserInfoModal from "../components/CustomModal/UserInfoModal";





export default function ApplyList(params) {
    
    let [data, setData] = useState([]);     //  报名列表
    let [detail, setDetail] = useState({});     //  需求详情

    let [userInfo, setUserInfo] = useState({});     //  用户详情
    let [isUserInfo, setIsUserInfo] = useState(false);      //  用户详情弹窗


    // 用户详情弹窗
    const showUserInfo = (info) => {
        userInfo = info;
        setUserInfo({...userInfo});
        setIsUserInfo(true);
    }

    const init = async() => {
        const { task_id } = qs.parse(location.search.slice(1));
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
                detail.role = deform_Skills(detail.role);
                detail.budget = deform_Count(detail.budget,detail.currency);
                setDetail(detail);

            }
        })
    }   

    useEffect(() => {
        init();
    },[])

    return <div className="Applylist">
        {/* 用户详情弹窗 */}
        <UserInfoModal show={isUserInfo} setShow={setIsUserInfo} userInfo={userInfo} />
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
                                <p onClick={() => {worker = e.apply_addr, setWorker(worker) ,showModal()}}>Invite</p>
                                <p onClick={() => sort(e.apply_addr, i)} className="product-collaborate-no">Improper</p>
                            </div>
                        </div>
                    </li> )
                }
            </ul>
        </div>
    </div>
    </div>
}