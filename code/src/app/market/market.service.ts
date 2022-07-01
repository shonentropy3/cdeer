import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});

@Injectable()
export class MarketService {

    // 获取hash
    getFile(files) {
        return new Promise((resolve, reject) => {
            const file = files[0]
            let time = `${Date.now()}-${file.originalname}`
            // let time = `${Date.now()}-${file.name}`
            let path = '../../../public'+'/'+ time
            let writeStream = createWriteStream(join(__dirname, path))
            writeStream.write(file.buffer , function (err) {
                if (!err) {
                    let res = '/Users/xiaonahe/Desktop/work/code-market/code/public/'+time
                    // resolve(res)
                    ipfs.add(fs.readFileSync(res),   function (err, files) {
                        if (err || typeof files == "undefined") {
                            console.log(err);
                        } else {
                            resolve(files[0].hash)
                        }
                    })
                }
            })
        }).then((res)=>{
            return res
        })
    }


    // 创建项目
    // createPjc(body) {
    //     let queryData = body;
    //     let{proType,pro} = queryData;
    //     const { ethereum } = window;
    //     try {
    //         if (ethereum) {
    //         const provider = new ethers.providers.Web3Provider(ethereum);
    //         const signer = provider.getSigner();
    //         const nftContract = new ethers.Contract(contractAddress.address, abi, signer);
    //         getAccountInfo.insertLabel(proType)

    //         //Project publishing fee
    //         let fee = ethers.utils.parseUnits('1', 18);
    //         let nftTxn = await nftContract.createProject({
    //             title: pro[0].value,
    //             budget: Number(pro[1].value),
    //             desc: pro[3].value,
    //             period: Number(pro[2].value)
    //         },
    //         {
    //             value: fee
    //         });
    //         await nftTxn.wait();
    //         } else {
    //         console.log("Ethereum object does not exist");
    //         }
    
    //     } 
    //     catch (err) {
    //         ctx.response.body = _fail(err);
    //         return;
    //     }
    //     return ctx.response.body = _succeed();
    // }
}
