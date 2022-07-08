// const ipfsFile = require('../../com/utils/ipfs');
const fs = require('fs');
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});


function _fail(msg) {
    return { 'status': '0', 'message': msg };
}

function _succeed(extraData) {
    let base = { 'status': '1', 'message': 'OK' };
    // return Object.assign(base, extraData)
    return Object.assign(base, '成功了')
}

async function storage(ctx) {
    const multiparty = require("multiparty")
    let form = new multiparty.Form()
    let file = '初始值'
    let filePath = ctx.request.body;
    try {
        //设置编辑
        // form.encoding = 'utf-8';
        // console.log(form.encoding);
        console.log('filePath==>',filePath);
        // form.parse(ctx.req,function(err,fields,files){ 
        //     if(err){
        //         console.log(err.name);
        //     }else{
        //     //files.file是undefined
        //     console.log("files==>"+files);
        //     }
        //  })
        // console.log(file);
        // let addPath = 'backend/src/controller/storage/86b67c64cdca0edc5e907ee0193854f3.png'
        ipfs.add(fs.readFileSync(filePath), function (err, files) {
            if (err || typeof files == "undefined") {
                console.log('err==>',err);
            } else {
                console.log('files==>',files);
            }
        })

        // axios.get('https://jsonplaceholder.typicode.com/todos/1')
        // .then(res => {
        //     console.log(res.data.id);
        //     console.log(res.data.title);
        // })
        // .catch(err => {
        //     console.log(err);
        // });
        

        // const service = new upyun.Service(ipfs0,upchain,'upchain123')
        // const client = new upyun.Client(service);
        // client.usage('/sub/dir').then(function(size) {
        //   console.log('/sub/dir total used size: ' + size)
        // })
      } 
      catch (err) {
        ctx.response.body = _fail(err);
        return;
      }
    return ctx.response.body = _succeed();
}

module.exports = {
    storage
};