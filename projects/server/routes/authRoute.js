const express = require("express")
const router = express.Router()
const { RegisterController } = require("../controllers/RegisterController")
const { body } = require("express-validator")
const { verifyToken } = require("../middlewares/authMiddleware")

router.post(
  "/registerEmail",
  body("email").isEmail(),
  RegisterController.sendEmailRegister
)
router.post(
  "/registerPassword",
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
// router.get("/verification", RegisterController.verifyUser)
module.exports = router
