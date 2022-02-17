const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
 name:{
     type:String
 },
 email:{
     type:String
 },
 contact:{
     type:Number
 },
 gender:{
     type:String
 },
 typeofuser:{
     type:String
 },
 platform:{
     type:String
 },
 screenshot:{
     type:String
 }
},{timestamps:true})

const Complaint = new mongoose.model("Complaint",complaintSchema);
module.exports=Complaint;

