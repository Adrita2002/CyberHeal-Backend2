const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/cyberheal');
};

var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log("We are connected")//Asynchronous models hence callbacks are run later
});

