const express = require("express");
const {
  userRegistration,
  authUser,
  allUsers,
} = require("../Controller/userController");
const protect = require("../middlewareError/authMiddleware");
const router = express.Router();

router.route("/").post(userRegistration).get(protect, allUsers);
router.post("/login", authUser);
module.exports = router;
