
const router = require('express').Router();
const { createPost, getallPost, getPost, PostCount, deletePost, UpdatePost, UpdateImagePost, likesPost, deleteAll } = require('../controllers/postController');
const photoUpload = require('../middleware/uploadImages');
const { validateObjectId } = require('../middleware/validateObjectId');
const { verifyAdminToken, verifyUserToken, verifyToken, verifyUserorAdminToken } = require('../middleware/verifytoken');


router.route("/").post(verifyToken,photoUpload.single("image"),createPost).get(getallPost).delete(deleteAll)
router.route("/likes/:id").put(validateObjectId,verifyToken,likesPost)
router.route("/image-Update/:id").put(validateObjectId,verifyToken,photoUpload.single("image"),UpdateImagePost)
router.route("/count").get(PostCount)
router.route("/:id").get(validateObjectId,getPost).delete(validateObjectId,verifyToken,deletePost).put(validateObjectId,verifyToken,UpdatePost)



module.exports=router