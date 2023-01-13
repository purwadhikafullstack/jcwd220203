const { check } = require("express-validator")

exports.validateAddress = [
  check("recipients_name")
    // .optional({ checkFalsy: true })
    .isLength({ min: 3 })
    .isString(),
  // .withMessage("recipients_name must be at least 3 characters"),
  //   check("phone_number")
  //     .optional({ checkFalsy: true })
  //     .isLength({ min: 9, max: 14 })
  //     .isNumeric(),
  //   check("address_labels")
  //     .optional({ checkFalsy: true })
  //     .isLength({ min: 4 })
  //     .isAlphanumeric(),
  //   check("province").optional({ checkFalsy: true }).isNumeric(),
  //   // .notEmpty()

  //   check("city").optional({ checkFalsy: true }).isNumeric(),
  //   //   .notEmpty()
  //   check("districts").optional({ checkFalsy: true }).isString(),
  //   // .notEmpty()
  //   check("full_address").optional({ checkFalsy: true }).isLength({ min: 7 }),
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
