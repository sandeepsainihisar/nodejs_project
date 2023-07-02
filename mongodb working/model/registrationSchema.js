const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const registrationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },


    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    cpassword: {
        type: String,
        required: true
    }
    // attachfile:{
    //     type:String,
    //     required:true
    // }

});

registrationSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12);
        this.cpassword=await bcrypt.hash(this.cpassword,12);
    }
    next();
})
const userModel = mongoose.model('signup', registrationSchema)
module.exports = userModel