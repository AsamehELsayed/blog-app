const asynchandler = require("express-async-handler");
const { User } = require("../models/user");
const {
  commentVaildition,
  Comment,
  updatecommentVaildition,
} = require("../models/comment");

module.exports.createComments = asynchandler(async (req, res) => {
  const { error } = commentVaildition(req.body);
  if (error) {
    return res.status(400).json(error);
  }
  const profile = await User.findById(req.user.id);
  const comment = await Comment.create({
    postId: req.body.postId,
    text: req.body.text,
    user: req.user.id,
    username: profile.username,
  });
  res.status(201).json(comment);
});

module.exports.getComments = asynchandler(async (req, res) => {
  const comments = await Comment.find().populate(["postId", "user"]);
  res.status(200).json(comments);
});

module.exports.deleteComment = asynchandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "comment not fount" });
  }
  if (req.user.isAdmin || req.user.id === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "comment has been deleted" });
  } else {
    res.status(403).json({ message: "access denied" });
  }
});
module.exports.UpdateComment = asynchandler(async (req, res) => {
  const { error } = updatecommentVaildition(req.body);
  if (error) {
    return res.status(400).json(error);
  }
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "comment not fount" });
  }
  if (req.user.id === comment.user.toString()) {
    await Comment.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          text: req.body.text,
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "comment has been updated" , comment});
  } else {
    res.status(403).json({ message: "access denied" });
  }
});
