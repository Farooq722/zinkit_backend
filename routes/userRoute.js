const express = require('express');
const { registerUser, verifyEmailController, loginController, logoutController, uploadAvatar, updateUserProfile,forgetPassword, verifyForgetPasswordOtp, resetPassword, refreshToken1, allUser } = require("../controllers/userControllers");
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.get("/logout", auth, logoutController);
router.put("/upload-avatar", auth, upload.single('avatar'), uploadAvatar);
router.put("/update", auth, updateUserProfile);
router.put("/forget-password", forgetPassword);
router.put("/verify-forget-password", verifyForgetPasswordOtp);
router.put("/reset-password", resetPassword);
router.post("/refresh", refreshToken1);
router.get("/users", allUser);

module.exports = router;