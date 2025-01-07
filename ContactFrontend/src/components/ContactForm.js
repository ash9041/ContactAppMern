import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ContactForm = () => {
  const [contacts, setContacts] = useState([]); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false); 
  const [selectedContactId, setSelectedContactId] = useState(null); 

  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const toast = useToast(); 
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/contacts/Contact", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Contacts fetched from API:", response.data); 
        setContacts(response.data); 
      } catch (err) {
        console.error("Error fetching contacts:", err);
        toast({
          title: "Error",
          description: "Failed to load contacts",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchContacts();
  }, [toast, token]);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (isEditing) {
        // Edit contact
        await axios.put(
          `http://localhost:3001/contacts/Contact/${selectedContactId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast({
          title: "Success",
          description: "Contact updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        
        await axios.post("http://localhost:3001/contacts/Contact", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({
          title: "Success",
          description: "Contact created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      setFormData({ name: "", email: "", phone: "" });
      setIsEditing(false);
      onClose();
      refreshContacts();
    } catch (err) {
      console.error("Error saving contact:", err);
      toast({
        title: "Error",
        description: "Failed to save contact",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  
  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
    setSelectedContactId(contact._id);
    setIsEditing(true);
    onOpen();
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/contacts/Contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Success",
        description: "Contact deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refreshContacts();
    } catch (err) {
      console.error("Error deleting contact:", err);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  
  const refreshContacts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/contacts/Contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data); // Assuming response is an array of contacts
    } catch (err) {
      console.error("Error refreshing contacts:", err);
    }
  };

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box bg="gray.200" minH="100vh" p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Contact Manager</Heading>
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>

     
      {contacts.length > 0 ? (
  <Flex wrap="wrap" justify="left" gap={6} mt={4}>
    {contacts.map((contact) => (
      <Box
        key={contact._id}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        p={4}
        w="300px"
        bg="white"
        _hover={{ boxShadow: "xl" }}
      >
        <Heading size="md" mb={2} color="teal.600">
          {contact.name}
        </Heading>
        <VStack align="start" spacing={2} mb={4}>
          <Box>
            <strong>Email:</strong> {contact.email}
          </Box>
          <Box>
            <strong>Phone:</strong> {contact.phone}
          </Box>
        </VStack>
        <Flex justify="space-between">
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => handleEdit(contact)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => handleDelete(contact._id)}
          >
            Delete
          </Button>
        </Flex>
      </Box>
    ))}
  </Flex>
) : (
  <Heading size="md" color="gray.500" textAlign="center" mt={4}>
    No contacts available. Please add one.
  </Heading>
)}


      
      <Button colorScheme="green"marginTop="20px"onClick={onOpen}>
        Add Contact
      </Button>

      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Contact" : "Add Contact"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                placeholder="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {isEditing ? "Update" : "Save"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ContactForm;
