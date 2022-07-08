
const Koa = require('koa');
const app = new Koa();
const cors = require('koa2-cors');
// const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const rules = require('../../config/router');
const router = require('koa-router')()


// const multer = require('koa-multer')

// let storage = multer.diskStorage({
//   //文件保存路径 这个路由是以项目文件夹 也就是和入口文件（如app.js同一个层级的）
//   destination: function (req, file, cb) {
//       cb(null, 'static/base/')
//   },
//   //修改文件名称
//   filename: function (req, file, cb) {
//       let fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
//       cb(null, 'Jimmy'+Date.now() + "." + fileFormat[fileFormat.length - 1]);
//   }
// })

// let upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024*1024/2 // 限制512KB  
//   }
// });

// module.exports = upload



// const upload = require('../common/uploadConfig')  // 引入我们的中间键

// // 在路由的时候注入，之后只要这个路由一走，就会自动的将我们的图片上传到服务器，并且保存到我们 upload 中间键配置的保存文件目录下
// router.post('/gallery',upload.single('file'),async ctx=>{
//   console.log('new data',ctx.req.file.filename)

//   ctx.body = {code:200,result:'请求成功',filename:ctx.req.file.filename}
// })

// module.exports = router.routes()

app.use(cors({
    origin: function(ctx) {
        return ctx.header.origin;
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
// 先添加koaBody中间件
app.use(
    koaBody({
      // 如果需要上传文件,multipart: true
      //　不设置无法传递文件
      multipart: true,
      formidable: {
        maxFileSize: 1000 * 1024 * 1024
      },
      patchKoa: true
    })
  );


const NotFound = ctx => {
    ctx.response.status = 404;
    ctx.response.body = 'Page Not Found';
};

const IntervalError = ctx => {
    ctx.throw(500);
};

const handler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        };
        ctx.app.emit('error', err, ctx);
    }
};
app.use(handler);
app.use(bodyParser({
    'formLimit':'20mb',
    'jsonLimit':'2mb',
    'textLimit':'2mb',
  }))
// app.use(bodyParser());

router.get('/404', NotFound);
router.get('/500', IntervalError);

for (let rule of rules) {
    let [method, action, handler] = rule;
    method = method.toLowerCase();
    if (method === 'get') {
        router.get(action, handler);
    } else if (method === 'post') {
        router.post(action, handler);
    }
}

app.use(router.routes());

app.on('error', (err, ctx) => {
    console.error('server error', err);
});

module.exports = app;