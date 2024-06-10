const router = require("express").Router();
const {
  ressetPasswordAccountCtrl, writeNewPassword,
} = require("../controllers/passwordControllers")


router.route("/reset-password/")
  .post(ressetPasswordAccountCtrl)

router.route("/reset-password/:id/:token").put(writeNewPassword)
module.exports = router;