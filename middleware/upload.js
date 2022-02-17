const path = require('path');
const multer = require('multer');

var storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb)=>{
        let ext = path.extname(file.originalname);
        cb(null,Date.now()+ext)
    }
})

var upload = multer({
    storage:storage,
    fileFilter:(req,file,callback)=>{
        if(
            file.mimetype=="image/png" ||
            file.mimetype=="img/jpg"
        ){
            callback(null,true)
        }else{
            console.log('Only jpg or png file supported!');
            callback(null,false)
        }
    },
    limits:{
       fileSize:1024*1024*2 
    }
})

module.exports = upload;