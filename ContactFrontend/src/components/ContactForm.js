import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Select,
  Text
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchContacts();
  }, [toast, token]);
    
  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/contacts/Contact", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setContacts(response.data);
     
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load contacts",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
        await axios.put(
          `http://localhost:3001/contacts/Contact/${selectedContactId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
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
      fetchContacts();
    } catch (err) {
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
      fetchContacts();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    
    navigate("/");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedAndFilteredContacts = contacts
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOrder === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <Box bg="gray.200" minH="100vh" p={4}>
     
       <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1rem"
      bg="blue.500"
        color="white"
        mb={4}
        borderRadius={10}
    >
     
      <Box>
        <Text fontSize="xl" fontWeight="bold" justifyContent="center" align="center">
          Contact Manager
        </Text>
      </Box>

      
      <Flex align="center" gap="4">
          {/* <Text fontSize="md">{Username }</Text> */}
        <Button
          size="sm"
          colorScheme="red"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Flex>
    </Flex>

      <Flex gap={4} mb={4}   >
        <Input
          placeholder="Search contacts"
          value={searchTerm}
          onChange={handleSearch}
          backgroundColor="whiteAlpha.900"
        />
        <Select value={sortOrder} onChange={handleSort} backgroundColor="whiteAlpha.900">
           <option value="" disabled>
            Filter Options 
         </option>
          <option value="newest">Newest to Oldest</option>
          <option value="oldest">Oldest to Newest</option>
          <option value="alphabetical">Alphabetical</option>
        </Select>
      </Flex>

      {sortedAndFilteredContacts.length > 0 ? (
        <Flex wrap="wrap" justify="left" gap={6} mt={4}>
          {sortedAndFilteredContacts.map((contact) => (
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
