import {getFirstStatus,getSecondStatus} from '../controller/getOrdStatus'
// 有没有创建订单
export default async function getOrderStatus(params)  {
    let oid;

    // 判断甲方是否选择乙方
    await getFirstStatus({proLabel: params})
    .then(res => {
        oid = res.toString()
    })
    .catch(err => {
        console.log(err)
    })
    if(oid == 0){
        console.log('阶段一');
      return 0
    }
    


    // 判断乙方是否划分好了阶段
    await getSecondStatus(oid)
    .then(res => {
        oid = res
    })
    .catch(err => {
        console.log(err)
    })
    if (oid == 0) {
      return 1
    }


    //  划分好阶段==>2
    
    //  甲方确认阶段==>3
}