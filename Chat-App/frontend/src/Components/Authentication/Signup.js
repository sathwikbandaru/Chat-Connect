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

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [picture, setPicture] = useState("");
  const [conPass, setConPass] = useState("");
  const [show1, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [load, setLoad] = useState(false);
  const toast = useToast();

  const setUserPicture = (ele) => {
    const url = "https://api.cloudinary.com/v1_1/ddeiij01c/upload";
    setLoad(true);
    if (ele === undefined) {
      toast({
        position: "bottom",
        title: "select an image",
        status: "warning",
        isClosable: true,
        containerStyle: {
          width: "800px",
          maxWidth: "100%",
        },
      });
    }
    if (
      ele.type === "image/jpeg" ||
      ele.type === "image/png" ||
      ele.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", ele);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "ddeiij01c");
      axios
        .post(url, data)
        .then((data) => {
          console.log(data.data.url.toString());
          setPicture(data.data.url.toString());
          setLoad(false);
        })
        .catch((err) => setLoad(false));
    } else {
      toast({
        position: "bottom-left",
        title: "select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          width: "800px",
          maxWidth: "100%",
        },
      });
    }
    return;
  };
  const handelSubmit = () => {
    setLoad(true);
    if (!name || !email || !password || !conPass) {
      toast({
        position: "bottom",
        title: "Enter all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoad(false);
      return;
    }
    if (password !== conPass) {
      toast({
        position: "bottom",
        title: "Password should match with Confirm Password",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoad(false);
      return;
    }
    axios
      .post("http://localhost:1001/api/user", {
        name,
        email,
        password,
        picture,
      })
      .then((data) => {
        toast({
          position: "top",
          title: "Registration Successful",
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
          title: "Error ! while Registration",
          status: "error",
          description: err.message,
          duration: 5000,
          isClosable: true,
        });
        setLoad(false);
      });
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl id="username" isRequired>
        <FormLabel color={"blackAlpha.600"}>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
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
            type={show1 ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPass(e.target.value)}
          />
          <InputRightElement>
            <Button h={"2.2em"} size={"md"} onClick={() => setShow(!show1)}>
              {show1 ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="conformPass" isRequired>
        <FormLabel color={"blackAlpha.600"}>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show2 ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConPass(e.target.value)}
          />
          <InputRightElement>
            <Button h={"2.2em"} size={"md"} onClick={() => setShow2(!show2)}>
              {show2 ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="picture" isRequired>
        <FormLabel color={"blackAlpha.600"}>Upload your picture</FormLabel>
        <Input
          type="file"
          p={"1.5px"}
          accept="image/*"
          onChange={(e) => setUserPicture(e.target.files[0])}
        />
      </FormControl>
      <Button
        mt={"15px"}
        colorScheme="blue"
        ml={"80%"}
        onClick={handelSubmit}
        isLoading={load}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
