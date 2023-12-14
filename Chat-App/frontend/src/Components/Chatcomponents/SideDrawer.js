import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "./userAvatar/UserListItem";
import { getSender } from "../../config/chatlogics";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingchat] = useState();

  const {
    User,
    setSelectedChat,
    chats,
    setchats,
    notification,
    setnotification,
  } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const Logouthandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "please enter something in search",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${User.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:1001/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "No data found",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
      return;
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingchat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${User.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:1001/api/chat",
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);

      setSelectedChat(data);
      setLoadingchat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <FaSearch />{" "}
            <Text display={{ base: "none", md: "flex" }} p={"10px"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work Sans"}>
          Chat-Connect
        </Text>
        <div>
          <Menu>
            <MenuButton p={"1px"} position={"relative"}>
              <BellIcon fontSize={"2xl"} m={1} />
              {notification.length == 0 ? (
                <></>
              ) : (
                <span
                  style={{
                    position: "absolute",
                    zIndex: "1111",
                    top: "0%",
                    borderRadius: "10px",
                    fontSize: "11px",
                    padding: "0 5px",
                    minHeight: "15px",
                    minWidth: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    left: "20px",
                    background: "#FF3B30",
                    color: "white",
                  }}
                >
                  {notification.length}
                </span>
              )}
            </MenuButton>
            <MenuList p={1}>
              {!notification.length && "no new messages"}
              {notification.map((notif) => {
                return (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setnotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(User, notif.chat.users)}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={User.name}
                src={User.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal User={User}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={Logouthandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} isLoading={loading}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default SideDrawer;
