const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    Username: { type: String, required: false },
    email: { type: String, required: false },
   password: {type: String,required: true  }
 
}, { timestamps: true });

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
