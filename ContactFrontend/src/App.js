import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactForm from "./components/ContactForm";

import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

const App = () => {
  return (
    
   <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/contact" element={<ContactForm />} />
      </Routes>
    </Router>
  );
};

export default App;
