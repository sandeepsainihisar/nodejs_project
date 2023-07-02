const mongoose = require('mongoose');
const contactschema = new mongoose.Schema({
    namecon: {
        type: String,
        required: true
    },
    
    
    emailcon : {
        type: String,
        required: true
    },
    
    subjectcon : {
        type: String,
        required: true
    },
    msgcon : {
        type: String,
        required: true
    }

})

const Contactschema = mongoose.model('contact', contactschema);
module.exports = Contactschema;