const router = require('express').Router();
const { createComments, getComments, deleteComment, UpdateComment } = require('../controllers/commentController');
const { validateObjectId } = require('../middleware/validateObjectId');
const { verifyAdminToken, verifyUserToken, verifyToken, verifyUserorAdminToken } = require('../middleware/verifytoken');


router.route("/").post(verifyToken,createComments).get(getComments)
router.route("/:id").delete(validateObjectId,verifyToken,deleteComment).put(validateObjectId,verifyToken,UpdateComment)
module.exports=router