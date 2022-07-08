const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const fs  = require('fs');
//传入要上传的文件路径
exports.add = (addPath) =>{
    return new Promise((resolve,reject)=>{
        try {
            let buffer = fs.readFileSync(addPath);
            ipfs.add(buffer, function (err, files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                } else {
                    resolve(files[0].hash);
                }
            })  
        }catch(ex) {
            reject(ex);
        }
    })
}
//传入文件的hash地址以及要下载到哪个目录的路径
exports.get = (hash,getPath) =>{
    return new Promise((resolve,reject)=>{
        try{
            ipfs.get(hash,function (err,files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                }else{
                    fs.writeFileSync(getPath,files[0].content);
                    resolve('ok');                   
                }
            })
        }catch (ex){
            reject(ex);
        }
    });
}
