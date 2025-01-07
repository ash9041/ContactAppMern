const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: false },
  email: { type: String, required: false },
   phone: {
    type: String,
    required: true, 
  }
 
}, { timestamps: true });


const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
