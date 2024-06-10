const asynchandler = require("express-async-handler");
const path = require("path");
const fs = require("fs").promises;
const { User, validateUpdateUser } = require("../models/user");
const {
  commentVaildition,
  Comment,
  updatecommentVaildition,
} = require("../models/comment");
const { Post, validatePost, validateUpdatePost } = require("../models/posts");

const bcrypt = require("bcryptjs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemovAllImages,
} = require("../utils/cloudinary");
module.exports.getAllUsers = asynchandler(async (req, res) => {
  const users = await User.find().select("-password").populate("posts");
  res.status(201).json(users);
});
module.exports.getUserscount = asynchandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(201).json(count);
});

module.exports.getUser = asynchandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  res.status(201).json(user);
});

module.exports.UpdateUser = asynchandler(async (req, res) => {
  console.log(req.body);
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(500).json(error);
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const user = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      username: req.body.username,
      bio: req.body.bio,
      password: req.body.password,
    }, 
  },{ new: true }).populate("posts");;
  await user.save();
  return res.status(201).json(user);
});

module.exports.uploadProfilePhoto = asynchandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "error" });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  const resault = await cloudinaryUploadImage(imagePath);
  const user = await User.findById(req.user.id);
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  user.profilePhoto = {
    url: resault.secure_url,
    publicId: resault.public_id,
  };

  user.save();
  fs.unlinkSync(imagePath);
  return res.status(200).json({
    message: "your profile photo uploaded successfully",
    profilePhoto: { url: resault.secure_url, publicId: resault.public_id },
  });
});

module.exports.deleteUser = asynchandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    console.log("User not found");
    return res.status(404).json({ message: "User not found" });
  }

  const posts = await Post.find({ user: user._id });
  const publicIds = posts.map((post) => post.image.publicId);
  if (publicIds.length > 0) {
    console.log("Removing images from cloudinary...");
    await cloudinaryRemovAllImages(publicIds);
  }

  console.log("Removing profile photo from cloudinary...");
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  console.log("Deleting user's posts...");
  await Post.deleteMany({ user: user._id });

  console.log("Deleting user's comments...");
  await Comment.deleteMany({ user: user._id });

  console.log("Deleting user...");
  await User.findOneAndDelete({ _id: req.params.id });

  console.log("User account has been deleted");
  return res.status(201).json("Account has been deleted");
});
