const express = require("express");
const protect = require("../middlewareError/authMiddleware");
const { sendmessage, allMessages } = require("../Controller/messageController");

const router = express.Router();

router.route("/").post(protect, sendmessage);
router.route('/:chatId').get(protect, allMessages)

module.exports = router;
