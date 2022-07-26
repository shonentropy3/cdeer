import {getFirstStatus,getSecondStatus} from '../controller/getOrdStatus'
// 有没有创建订单
export default async function getOrderStatus(params)  {
    let oid,status,amoumt;

    // 判断甲方是否选择乙方
    await getFirstStatus({proLabel: params})
    .then(res => {
        oid = res.toString()
        oid == 0 ? status = 0 : status = 1
    })
    .catch(err => {
        console.log(err)
    })
    if(status == 0){
        console.log('阶段一');
      let obj = {
        state: 0,
        oid: oid
      }
      return obj
    }
    


    // 判断乙方是否划分好了阶段
    await getSecondStatus(oid)
    .then(res => {
        res.check == 0 ? status = 1 : status = 2
        amoumt = res.amoumt
    })
    .catch(err => {
        console.log(err)
    })
    if (status == 1) {
        let obj = {
            state: 1,
            oid: oid,
            amoumt: amoumt
          }
          return obj
    }


    //  划分好阶段==>2
    
    //  甲方确认阶段==>3
}