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
    return await getSecondStatus(oid)
    .then(res => {
        amoumt = res.amoumt
        console.log(res,'res==>');
        switch (res.check) {
            case 0:
                status = 1;
                break;
            case 1:
                status = 2;
                break;
            default:
                status = 3;
                break;
        }
        let obj = {
            state: status,
            oid: oid,
            amoumt: amoumt
        }
        return obj
    })
    .catch(err => {
        console.log(err)
    })


    //  划分好阶段==>2
    
    //  甲方确认阶段==>3
}