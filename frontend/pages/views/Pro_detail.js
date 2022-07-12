import {withRouter} from 'next/router'
import { useEffect, useState } from "react"
import { getProjectDetail } from '../http/api';
import NavigationBar from "../../components/NavigationBar";


export default function ProjectDetail() {
    let oid = ''
    let [detail,detailSet] = useState({})
    useEffect(()=>{
        oid = location.search
        oid = oid.replace('?','')
        
        getProjectDetail({id: oid})
        .then(res=>{
            console.log(res);
            detail = res[0]
            detailSet({...detail})
        })
        .catch(err=>{
            console.log(err);
        })
    },[])

    // 参与项目
    const participate = () => {
        // 参与报名接口
        
    }

    return(
        <div className="pjc_detail">
            <NavigationBar />

            <div className='container'>
                <div className='top'>
                    <div>
                        <h1>{detail.title}</h1>
                        <p>No.{detail.id}</p>
                    </div>
                    <div>
                        <p>招募角色: {detail.role}</p>
                    </div>
                    <button onClick={()=>participate()}>参加项目</button>
                    <div>
                        <p>金额 ¥{detail.budget}</p>
                        <p>类型  {detail.pro_type}</p>
                        <p>周期  {detail.period}</p>
                        <p>报名人数  xx</p>
                    </div>
                </div>
                <div className='content'>
                        项目描述:   {detail.content}
                </div>
            </div>
        </div>
    )
}
