const { check, validationResult } = require("express-validator")

exports.validateRegisterEmail = [
  check("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(422).json({
        errors: errors.array(),
        message: "Invalid fields",
      })
    next()
  },
]

exports.validateRegisterPassword = [
  check("username")
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters"),
  check("password").optional({ checkFalsy: true }).isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(422).json({
        errors: errors.array(),
        message: "Invalid fields",
      })
    next()
  },
]

exports.validateAddress = [
  check("recipients_name")
    .optional({ checkFalsy: true })
    .isLength({ min: 3 })
    .isString()
    .withMessage("recipients_name must be at least 3 characters"),
  check("phone_number")
    .optional({ checkFalsy: true })
    .isLength({ min: 9, max: 14 })
    .isNumeric(),
  check("address_labels")
    .optional({ checkFalsy: true })
    .isLength({ min: 4 })
    .isAlphanumeric(),
  check("province").optional({ checkFalsy: true }).isNumeric().notEmpty(),
  check("city").optional({ checkFalsy: true }).isNumeric().notEmpty(),
  check("districts").optional({ checkFalsy: true }).isString().notEmpty(),
  check("full_address").optional({ checkFalsy: true }).isLength({ min: 5 }),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(422).json({
        errors: errors.array(),
        message: "Invalid fields",
      })
    next()
  },
]

exports.validateAdmin = [
  check("email").optional({ checkFalsy: true }).isEmail(),
  check("password").optional({ checkFalsy: true }).isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),
  check("phone_number")
    .optional({ checkFalsy: true })
    .isNumeric()
    .isLength({ min: 9, max: 14 }),
  check("username")
    .optional({ checkFalsy: true })
    .isLength({ min: 3 })
    .isString()
    .withMessage("username must be at least 3 characters"),
  check("WarehouseId").optional({ checkFalsy: true }),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(422).json({
        errors: errors.array(),
        message: "Invalid fields",
      })
    next()
  },
]

exports.validateAdminUpdate = [
  check("phone_number")
    .optional({ checkFalsy: true })
    .isNumeric()
    .isLength({ min: 9, max: 14 }),
  check("username")
    .optional({ checkFalsy: true })
    .isLength({ min: 3 })
    .isString()
    .withMessage("username must be at least 3 characters"),
  check("WarehouseId").optional({ checkFalsy: true }),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(422).json({
        errors: errors.array(),
        message: "Invalid fields",
      })
    next()
  },
]
