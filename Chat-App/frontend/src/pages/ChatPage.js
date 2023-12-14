import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import SideDrawer from "../Components/Chatcomponents/SideDrawer";
import Mychats from "../Components/Mychats";
import Chatbox from "../Components/Chatbox";
import { useState } from "react";

const ChatPage = () => {
  const { User } = ChatState();
  const [fetchAgain, setfetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {User && <SideDrawer />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        w={"100%"}
        h={"90vh"}
        p={"10px"}
        bg={"gray"}
      >
        {User && <Mychats fetchAgain={fetchAgain} />}
        {User && (
          <Chatbox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
