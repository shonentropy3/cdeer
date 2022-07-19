import {withRouter} from 'next/router'
import { useEffect, useState } from "react"
import { getDemandInfo } from '../http/api';
import NavigationBar from "../../components/NavigationBar";
import { translatedPjc, translatedRole } from '../utils/translated';
import Attend from '../../components/ApplyFor';
import { ApplyFor } from '../../controller/ApplyProject';

export default function ProjectDetail() {
    let oid = ''
    let [detail,detailSet] = useState({})
    let [maskStatus,setMaskStatus] = useState(false)

    const navbar = [
        { label: '找项目', url: '/'},
        { label: '项目详情', url: ''}
    ]
    
    useEffect(()=>{
        oid = location.search
        oid = oid.replace('?','')
        
        getDemandInfo({id: oid})
        .then(res=>{
            let data = res.data
            Array.from(data).forEach((e,i) => {
                data[i].role = translatedRole(e.role)
                data[i].demand_type = translatedPjc(e.demand_type)
            })
            detail = data[0]
            detailSet({...detail})
        })
        .catch(err=>{
            console.log(err);
        })
    },[])
    






    return(
        <>
            {
                maskStatus ? 
                <div className="Mask">
                    <Attend setParent={setMaskStatus} demand_id={detail.demand_id} />
                </div>
                :
                ''
            }
            <div className="pjc_detail">
                <NavigationBar data={navbar} />

                <div className='container'>
                    <div className='top'>
                        <div>
                            <h1>{detail.title}</h1>
                            <p>No.{detail.id}</p>
                        </div>
                        <div>
                            <p>招募角色: {detail.role}</p>
                        </div>
                        <button onClick={()=>toggleMask()}>参加项目</button>
                        <div>
                            <p>金额 ¥{detail.budget}</p>
                            <p>类型  {detail.demand_type}</p>
                            <p>周期  {detail.period}</p>
                            <p>报名人数  xx</p>
                        </div>
                    </div>
                    <div className='content'>
                        {/* {
                            detail.attachment.length > 0 ? <p>项目附件: {detail.attachment}</p> : ''
                        } */}
                        <p>项目描述: {detail.content}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
