const mongoose=require('mongoose')
const counsellorSchema = new mongoose.Schema({
    name:{
        type:String
    },
    username:{
        type:String
    },
    age:{
        type:Number
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    password:{
        type:String
    },
    resume:{
        type:String
    }
   },{timestamps:true})
   
   const CounsellorReg = new mongoose.model("CounsellorReg",counsellorSchema);
   module.exports=CounsellorReg;