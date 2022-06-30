import {withRouter} from 'next/router'
import { useEffect, useState } from "react"
// import {
//     //截取查询参数的hook
    
//   } from 'react-router-dom';
const Sport = ({router})=>{
    let data = ''
    let oid = ''
    let [detail,detailSet] = useState({})
    useEffect(()=>{
        oid = location.search
        oid = oid.replace('?','')
        
        data = require("../testData/mock.json")
        data = data.data
        getDetail()
    },[])

    const getDetail = () => {

        data.forEach(ele => {
            if (ele.id == oid) {
                detail = ele
                detailSet({...detail})
            }
        });
    }
    return(
        <div className="pjc_detail">
            <div className='container'>
                <div className='top'>
                    <div>
                        <h1>{detail.name}</h1>
                        <p>No.{detail.id}</p>
                    </div>
                    <div>
                        <p>招募角色: {detail.roles}</p>
                    </div>
                    <div>
                        <p>金额 ¥{detail.price}</p>
                        <p>类型  {detail.typeText}</p>
                        <p>周期  {detail.duration}</p>
                        <p>报名人数  {detail.applyCount}</p>
                    </div>
                </div>
                <div className='content'>
                        项目描述:   {detail.description}
                </div>
            </div>
        </div>
    )
}
export default withRouter(Sport)