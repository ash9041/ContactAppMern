const express = require("express");
const Contact = require("../models/Contact");

const authenticateUser = require("../middleware/authUser");
const router = express.Router();


router.post("/Contact",authenticateUser, async (req, res) => {
  const { name, phone, email,} = req.body;
    console.log("Request body:", req.body);
    console.log("User ID:", req.user.id);
    try {
       
    
    const contact = new Contact({
      userId: req.user.id,
      name,
      phone,
      email,
      
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/Contact",authenticateUser, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/Contact/:id", authenticateUser,async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/Contact/:id",authenticateUser, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
