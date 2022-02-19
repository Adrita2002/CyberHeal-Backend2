"use strict";
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require("ejs");
const nodemailer=require("nodemailer");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const publishable_key = process.env.PUBLISHABLE_KEY;
const secret_key = process.env.SECRET_KEY;
const stripe = require("stripe")(process.env.SECRET_KEY);
const http = require('http');

const app = express();
const server= http.createServer(app);
const io=socketio(server);

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "\\public")));
app.use('/uploads',express.static('uploads'));

require("./db/cyberheal");
const Complaint = require("./models/complaint");
const CounsellorReg=require("./models/counsellor");
const upload = require("./middleware/upload");

app.get('/',(req,res)=>{
  res.render('index');
})

app.get('/complaintform', (req, res) => {
    res.render('complaintform');
});

app.get('/chat',(req,res)=>{
  res.render('chat');
})

app.get('/counsellorRegister',(req,res)=>{
  res.render('counsellorRegister');
})

//Complaint file
app.post('/complaintform', upload.single('screenshot'),async(req, res) => {
    try {
      let userComplaint = new Complaint({
          name: req.body.name,
          email: req.body.emailid,
          contact: req.body.contact,
          gender: req.body.gender,
          typeofuser:req.body.type,
          platform:req.body.platform
      })  
      if(req.file){
        userComplaint.screenshot = req.file.path;
      }
      await userComplaint.save();
      res.status(201).render("index");
       // async..await is not allowed in global scope, must use a wrapper
       async function main() {
        // Generate test SMTP service account from ethereal.email
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          service:"gmail",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASSWORD, 
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: process.env.EMAIL, // sender address
          to: req.body.emailid, // list of receivers
          subject: "Confirmation of submission of Complaint regarding Cyberbullying", // Subject line,
          text: "We have recieved the complaint that you have filed now. Please stay in contact with us.", // plain text body
           html: "We have recieved the complaint that you have filed now. Please stay in contact with us.<br>Contact no : 1234-5678", // html body
        });
      
        console.log("Mail Sent!");
      }
      
      main().catch(console.error);
      
    } catch (error) {
        res.status(400).send(error);
    }


})


//Payment

app.get('/payment', (req, res) => {
  res.render('payment')});

  const storeItems = new Map([
    [1, { priceInPaise: 150000, name: "CyberHeal" }]
  ])
  
  app.post("/create-checkout-session", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.priceInPaise,
            },
            quantity: item.quantity,
          }
        }),
        success_url: `${process.env.SERVER_URL}/chat`,
        cancel_url: `${process.env.SERVER_URL}/failure`,
      })
      res.json({ url: session.url })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  const chatUsers = {}
 
//Chat
io.on('connection',(socket)=>{
  // console.log("new User");
  socket.on('new-user',username=>{
    chatUsers[socket.id]=username;
    socket.broadcast.emit('user-connected',username);
  })
  
   socket.on('send-chat-message',message=>{
    //  console.log(message);
     socket.broadcast.emit('chat-message',{message:message,username:chatUsers[socket.id]})
   })
   socket.on('disconnect',()=>{
    socket.broadcast.emit('user-disconnected',chatUsers[socket.id]);
    delete chatUsers[socket.id];
    
  })
})

//Counsellor
app.post('/counsellorRegister',async(req,res)=>{
  try {
    let register = new CounsellorReg({
        name: req.body.name,
        username: req.body.counsellorUsername,
        age: req.body.age,
        city: req.body.city,
        state:req.body.state,
        password:req.body.password
    })  
    if(req.file){
      register.resume = req.file.path;
    }
    await register.save();
    res.status(201).render("counsellorRegister");

  }  catch (error) {
    res.status(400).send(error);
}

})

const port = process.env.PORT || 1000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})