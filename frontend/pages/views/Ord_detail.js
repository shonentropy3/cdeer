import { useEffect } from "react"

export default function OrderDetail(oid) {

    useEffect(()=>{
        oid = location.search
        console.log(oid);
    },[])

 

    return (
        <div className="ord_detail">
            <div className="container">
                <div className="top">
                    <p>报名列表</p>
                    {/* <div>
                        所有开发者
                    </div> */}
                </div>
                <div className="content">

                    <div className="box"></div>
                </div>
            </div>
        </div>
    )    
}