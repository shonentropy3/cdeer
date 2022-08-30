import { Button } from "antd";
import { useState } from "react";
import Stage from "../../../components/Stage";



export default function comfirmStage(params) {
    
    let [isWhom,setIsWhom] = useState(false);



    return <div className="comfirmStage">
        <div className="content">
        {
            isWhom ? 
                // 我划分
                <h1>等待需求方确认中...</h1>
                :
                <div className="container">
                    <div className="btn">
                        <Button>同意该阶段划分</Button>
                        <Button>修改该阶段划分</Button>
                    </div>
                    {/* <Stage oid={oid} amoumt={amoumt} /> */}
                    <Stage />
                </div>
        }
        </div>
    </div>
}