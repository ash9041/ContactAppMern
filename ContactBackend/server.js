require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const User = require('./models/Register');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.get("/Contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts); 
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send("Server Error");
  }
});

app.post('/User', async (req, res) => {
  const { Username, email,password } = req.body;

  
  if (!Username||!email||!password) {
    return res.status(400).json({ error: 'Please provide Credentials.' });
  }

  try {
    

        
           const user = new User({ Username,email,password });
           await user.save();
           res.status(201).json({ message: 'user registered successfully!' });
        
    
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});
app.post('/Contact', async (req, res) => {
  const { name, email, phone } = req.body;

  
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Please provide name, email, and phone.' });
  }

  try {
    const contact = new Contact({ name, email, phone });
    await contact.save();
    res.status(201).json({ message: 'Contact registered successfully!' });
  } catch (error) {
    console.error("Error registering contact:", error);
    res.status(500).json({ error: 'Failed to register contact' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
