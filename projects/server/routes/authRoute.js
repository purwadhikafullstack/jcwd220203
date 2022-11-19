const express = require("express")
const router = express.Router()
const { RegisterController } = require("../controllers/RegisterController")
const { body } = require("express-validator")
const { authController } = require("../controllers/authController")
const { verifyToken } = require("../middlewares/authMiddleware")

router.post(
  "/registerEmail",
  body("email").isEmail(),
  RegisterController.sendEmailRegister
)
router.post(
  "/registerPassword",
  body(
    "username",
    "Username length has to be min 3, and only contain alphanumeric chars"
  )
    .isLength({ min: 3 })
    .isAlphanumeric(),
  body("password", "Password not strong enough").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),

  RegisterController.makePassword
)
router.post(
  "/loginSocialMedia",
  body("email").isEmail(),
  RegisterController.loginWithSocialMedia
)

router.post("/login", authController.loginUser)
router.get("/refresh-token", verifyToken, authController.refreshToken)
router.post("/loginSocialMedia", authController.loginWithSocialMedia)
module.exports = router
