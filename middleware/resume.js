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

var uploadResume = multer({
    storage:storage,
    fileFilter:(req,file,callback)=>{
        if(
            file.mimetype=="application/pdf" 
        ){
            callback(null,true)
        }else{
            console.log('Only pdf file supported!');
            callback(null,false)
        }
    }
})

module.exports = uploadResume;