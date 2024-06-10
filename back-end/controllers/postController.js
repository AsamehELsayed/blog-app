const fs = require("fs").promises;
const asynchandler = require("express-async-handler");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { Post, validatePost, validateUpdatePost } = require("../models/posts");
const {
 
  Comment,

} = require("../models/comment");
// Create a new post
module.exports.createPost = asynchandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "image not found" });
  }

  // Validate post data
  const { error } = validatePost(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  // Upload image to Cloudinary
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // Create a new post in the database
  const post = await Post.create({
    title: req.body.title,
    category: req.body.category,
    user: req.user.id,
    description: req.body.description,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // Log the created post and send a response
  console.log(post);
  res.status(200).json(post);

  // Delete the temporary local image file
  await fs.unlink(imagePath);
});

// Get all posts with optional pagination and category filtering
module.exports.getallPost = asynchandler(async (req, res) => {
  const postPerpage = 3;
  const { pageNumper, category } = req.query;
  let posts;

  if (category && pageNumper) {
    // Case: Category and pagination
    console.log("a");
    posts = await Post.find({ category })
      .skip((pageNumper - 1) * postPerpage)
      .limit(postPerpage)
      .populate("user", ["username","profilePhoto"])
      .select("category");
  } else if (category) {
    // Case: Category only
    console.log("b");
    posts = await Post.find({ category }).populate("user", ["username","profilePhoto"])
  } else if (pageNumper) {
    // Case: Pagination only
    console.log("c");
    posts = await Post.find()
      .skip((pageNumper - 1) * postPerpage)
      .limit(postPerpage)
      .populate("user", ["username","profilePhoto"])
  } else {
    posts = await Post.find().populate("user", "username");
  }

  // Populate the comments virtual field
  await Post.populate(posts, { path: "comments" });

  // Send the retrieved posts as a response
  res.status(200).json(posts);
});


// Get a single post by ID
module.exports.getPost = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate("user", ["-password"]).populate("comments")
    if (!post) {
        return res.status(404).json({ message: "post not found" });
    }
    return res.status(200).json(post);
 
});

// Get the total count of posts
module.exports.PostCount = asynchandler(async (req, res) => {
    const count = await Post.countDocuments();
    res.status(200).json(count);
});

// Delete a post by ID
module.exports.deletePost = asynchandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(post.image.publicId);
    await Comment.deleteMany({postId:post._id})
    res.status(200).json({ message: "post has been deleted" });
    console.log({ message: "post has been deleted" })
  }
});

// Update a post by ID
module.exports.UpdatePost = asynchandler(async (req, res) => {
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(500).json({ error });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  if (req.user.id === post.user.toString()) {
    const Updatedpost = await Post.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    }, { new: true }).populate("user", "-password");
    res.status(200).json(Updatedpost);
  }
});

// Update a post's image by ID
module.exports.UpdateImagePost = asynchandler(async (req, res) => {
  if (!req.file) {
    return res.status(500).json({ message: "file not found" });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  if (req.user.id === post.user.toString()) {
    // Remove the old image from Cloudinary
    await cloudinaryRemoveImage(post.image.publicId);

    // Upload the new image to Cloudinary
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    // Update the post with the new image details
    const UpdatedPhoto = await Post.findByIdAndUpdate(req.params.id, {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    }, { new: true }).populate("user", "-password");

    // Send the updated post as a response
    res.status(200).json(UpdatedPhoto);

    // Delete the temporary local image file
    await fs.unlink(imagePath);
  }
});

// Like/Unlike a post by ID
module.exports.likesPost = asynchandler(async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }


  const isUserAlreadyLike = post.likes.find((user) => user.toString() === req.user.id);
  if (isUserAlreadyLike) {
    post = await Post.findByIdAndUpdate(req.params.id, {
      $pull: {
        likes: req.user.id,
      },
    }, { new: true });

  } else {
    post = await Post.findByIdAndUpdate(req.params.id, {
      $push: {
        likes: req.user.id,
      },
    }, { new: true });

  }

  // Send the updated post as a response
  res.status(200).json(post);
});
module.exports.deleteAll=asynchandler(async(req,res)=>{
  await Post.deleteMany()
  res.status(200).json("postDeleted")
})