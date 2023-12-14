import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
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
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [password, setPass] = useState("");
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const handelSubmit = () => {
    setLoad(true);
    if (!email || !password) {
      toast({
        position: "bottom",
        title: "Please fill email & password",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoad(false);
      return;
    }
    axios
      .post("http://localhost:1001/api/user/login", { email, password })
      .then((data) => {
        toast({
          position: "top",
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        setLoad(false);
        navigate("/chat");
      })
      .catch((err) => {
        toast({
          position: "bottom",
          title: "Error ! while Login",
          status: "error",
          description: JSON.stringify(err),
          duration: 5000,
          isClosable: true,
        });
        setLoad(false);
      });
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl id="email" isRequired>
        <FormLabel color={"blackAlpha.600"}>Email</FormLabel>
        <Input
          type={"email"}
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel color={"blackAlpha.600"}>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPass(e.target.value)}
          />
          <InputRightElement>
            <Button h={"2.2em"} size={"md"} onClick={() => setShow(!show)}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        mt={"15px"}
        colorScheme="blue"
        ml={"80%"}
        onClick={handelSubmit}
        isLoading={load}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
