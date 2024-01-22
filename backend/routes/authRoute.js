const express = require("express");
const router = express.Router();
const { isAuthorized } = require("../middleware/is-auth");
const authController = require("../controllers/authController");
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/getme", isAuthorized, authController.userProfile);
router.get("/logout", authController.signOut);
module.exports = router;
