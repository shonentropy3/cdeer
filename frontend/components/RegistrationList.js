import { useState } from "react"
import Order from "../controller/order"
import Attend from "./ApplyFor"

function RegistrationList(params) {

    const {data} = params
    let [maskStatus,setMaskStatus] = useState(false)

    const toggleMask = () => {
        maskStatus = true 
        setMaskStatus(maskStatus)
    }
     
    return(
        <>
            {
                maskStatus ? 
                <div className="Mask">
                    <Attend setParent={setMaskStatus} data={data} />
                </div>
                :
                ''
            }
            <div className="RegistrationList">
                <div className="left">
                    <div>
                        {data.apply_addr}
                    </div>
                    <div>
                        预估价:{data.price}
                    </div>
                </div>
                <div className="right">
                    {/* <button>不合适</button> */}
                    <button onClick={() => toggleMask()}>确认合作</button>
                </div>
            </div>
        </>
    )
}

export default RegistrationList