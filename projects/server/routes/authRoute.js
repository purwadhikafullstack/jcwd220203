const express = require("express")
const router = express.Router()
const { RegisterController } = require("../controllers/RegisterController")
const { body } = require("express-validator")
const { authController } = require("../controllers/authController")
const { verifyToken } = require("../middlewares/authMiddleware")
const {
  validateRegisterEmail,
  validateRegisterPassword,
} = require("../middlewares/validatorMiddleware")

router.post(
  "/registerEmail",
  validateRegisterEmail,
  RegisterController.sendEmailRegister
)
router.post(
  "/registerPassword",
  validateRegisterPassword,
  RegisterController.makePassword
)
router.post(
  "/loginSocialMedia",
  validateRegisterEmail,
  RegisterController.loginWithSocialMedia
)

router.post("/request-reset-password", authController.requestResetPassword)
router.patch(
  "/confirm-reset-password",
  body("newPassword", "Password not strong enough").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),
  authController.inputNewPassword
)

router.post("/login", authController.loginUser)
router.get("/refresh-token", verifyToken, authController.refreshToken)
router.post("/loginSocialMedia", authController.loginWithSocialMedia)
module.exports = router
