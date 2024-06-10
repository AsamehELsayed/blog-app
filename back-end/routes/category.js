const router = require('express').Router();
const { createCategory, getCategory, deleteCategory, UpdateCategory } = require('../controllers/categoryController');
const { validateObjectId } = require('../middleware/validateObjectId');
const { verifyAdminToken, verifyUserToken, verifyToken, verifyUserorAdminToken } = require('../middleware/verifytoken');


router.route("/").post(verifyAdminToken,createCategory).get(getCategory)
router.route("/:id").delete(validateObjectId,verifyToken,deleteCategory)
module.exports=router