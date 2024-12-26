const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false },
   phone: {
    type: String,
    required: true, 
  }
 
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
