import {withRouter} from 'next/router'
import { useEffect, useState } from "react"
import { getDemandInfo, modifyApplySwitch } from '../http/api';
import NavigationBar from "../../components/NavigationBar";
import { translatedPjc, translatedRole } from '../utils/translated';
import Attend from '../../components/ApplyFor';
import { ApplyFor } from '../../controller/ApplyFor';

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
                data[i].pro_type = translatedPjc(e.pro_type)
            })
            detail = data[0]
            detailSet({...detail})
        })
        .catch(err=>{
            console.log(err);
        })
    },[])
    
    // 报名开关
    const toggleMask = () => {
        maskStatus = !maskStatus
        setMaskStatus(maskStatus)

        let obj = {
            demandId: detail.demandId,
            previewPrice: previewPrice,
        }
        obj = JSON.stringify(obj)
        await ModifyApplySwitch(obj)
        .then(res => {
            console.log('res==>',res);
        })
        .catch(err => {
            console.log('err==>',err);
            console.log('交易失败==>');
        })

        if (tradeStatus) {
            console.log('交易完成==>');
            modifyApplySwitch({proLabel: obj})
              .then(res => {
                console.log(res);
                cancel()
              })
              .catch(err => {
                console.log(err);
                cancel()
              })
          }

    }





    return(
        <>
            {
                maskStatus ? 
                <div className="Mask">
                    <Attend setParent={setMaskStatus} pro_id={detail.pro_id} />
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
        </>
    )
}
