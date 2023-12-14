import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatlogics";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import { useEffect } from "react";

const ScrollableChat = ({ messages }) => {
  console.log("messages", messages);
  const { User, selectedChat, notification, setnotification } = ChatState();
  useEffect(() => {
    const filteredNotifications = notification.filter((ele) => {
      return ele.chat._id !== selectedChat._id;
    });
    setnotification(filteredNotifications);
  }, []);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: `${
                  m.sender._id === User._id ? "flex-end" : "flex-start"
                }`,
              }}
              key={m._id}
            >
              {isSameSender(messages, m, i, User._id) ||
              isLastMessage(messages, i, User._id) ? (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt={"7px"}
                    mr={1}
                    size={"sm"}
                    cursor={"pointer"}
                    name={m.sender.name}
                    src={m.sender.picture}
                  />
                </Tooltip>
              ) : (
                <span style={{ width: "35px" }}></span>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === User._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  //   marginLeft: isSameSenderMargin(messages, m, i, User._id),
                  marginTop: `${m.sender._id === User._id ? "3px" : "8px"}`,
                  //   marginTop: isSameUser(messages, m, i) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};
export default ScrollableChat;
