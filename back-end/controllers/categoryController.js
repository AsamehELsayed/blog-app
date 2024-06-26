const asynchandler = require("express-async-handler");
const { categoryVaildition, Category } = require("../models/category");

module.exports.createCategory = asynchandler(async (req, res) => {
  const { error } = categoryVaildition(req.body);
  if (error) {
    return res.status(400).json(error);
  }
  const category = await Category.create({
    title: req.body.title,
    user: req.user.id,
  });
  res.status(201).json(category);
});

module.exports.getCategory = asynchandler(async (req, res) => {
  const category = await Category.find().populate(["user"]);
  res.status(200).json(category);
});


module.exports.deleteCategory = asynchandler(async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(404).json({message:"category not found"})
    }
    await Category.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"category has been deleted"});
  });
  