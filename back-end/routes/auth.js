const router = require('express').Router();
const { registerAuthCtrl, loginCtrl, verifyUserAccountCtrl } = require('../controllers/authController');


router.route("/signup").post(registerAuthCtrl)

router.route("/signin").post(loginCtrl)

router.get("/:userId/verify/:token", verifyUserAccountCtrl);

module.exports=router
