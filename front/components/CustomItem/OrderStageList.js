import { useSetState } from "ahooks";
import { Button, Checkbox, InputNumber, Tabs } from "antd";
import { useEffect, useState } from "react";



export default function OrderStageList(params) {
    
    const { chache, data, order } = params;

    // chache: 暂存的阶段划分  ==>  data: 数据库内已存的阶段划分


    useEffect(() => {
        console.log('order ==> ',order);
    },[])

    return (
        <>

            
        </>
    )
}