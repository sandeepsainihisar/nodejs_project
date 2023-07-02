//Mongoose
const mongoose = require('mongoose');
var con = mongoose.connect("mongodb+srv://sandeepsaini:7015645572Sandeep@cluster0.fuf7ggg.mongodb.net/myfirstdatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    //node src/app.js
    .then(() => console.log("connection successfully.."))
    .catch((err) => console.log(err));
module.exports = con;