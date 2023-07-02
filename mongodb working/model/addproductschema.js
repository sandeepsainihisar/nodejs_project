const mongoose = require('mongoose');
const addproductschema = new mongoose.Schema({
    details: {
        type: String,
        required: true
    },
    
    
    subdetails : {
        type: String,
        required: true
    },
    
    enterdesc : {
        type: String,
        required: true
    },
    attachfile : {
        type: String,
        required:true
      
    }
    

})

const Addproductschema = mongoose.model('addproduct', addproductschema);
module.exports = Addproductschema;