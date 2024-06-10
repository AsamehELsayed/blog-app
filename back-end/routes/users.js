
const router = require('express').Router();
const { getAllUsers, getUser, UpdateUser, getUserscount, uploadProfilePhoto, deleteUser } = require('../controllers/usersController');
const photoUpload = require('../middleware/uploadImages');
const { validateObjectId } = require('../middleware/validateObjectId');
const { verifyAdminToken, verifyUserToken, verifyToken, verifyUserorAdminToken } = require('../middleware/verifytoken');

router.route("/profile").get(verifyAdminToken,getAllUsers)
router.route("/profile/uploadPhoto").post(verifyToken,photoUpload.single("image"),uploadProfilePhoto)
router.route("/profile/:id").get(validateObjectId,getUser).put(validateObjectId,verifyUserToken,UpdateUser).delete(validateObjectId,verifyUserorAdminToken,deleteUser)
router.route("/count").get(verifyAdminToken,getUserscount)

module.exports=router