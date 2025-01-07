const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const registerSchema = new mongoose.Schema({
    Username: { type: String, required: false },
    email: { type: String, required: false },
   password: {type: String,required: true  }
 
}, { timestamps: true });

registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


registerSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
