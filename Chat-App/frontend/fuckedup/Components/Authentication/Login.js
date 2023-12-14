import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState();
  const [show1, setShow1] = useState(false);
  const [password, setPassword] = useState();
  const [loading, setloading] = useState(false);

  const handleclick1 = () => {
    setShow1(!show1);
  };
  const toast = useToast();
  const navigate = useNavigate();
  const submitHandler = async () => {
    setloading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:1001/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login Successful",
        status: "Success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setloading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your mail"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show1 ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handleclick1}>
              {show1 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        w={"60%"}
        // ml={"80%"}
        marginTop={15}
        colorScheme={"blue"}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        w={"60%"}
        // ml={"80%"}
        marginTop={15}
        colorScheme={"red"}
        onClick={() => {
          setEmail("guest@gmail.com");
          setPassword("keeluuu");
        }}
      >
        Guest User
      </Button>
    </VStack>
  );
};
export default Login;
