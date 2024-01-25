const Post = require("../models/postModel");
const errorResponse = require("../utils/errorResponse");
const fs = require("fs");
exports.createPost = async (req, res, next) => {
  console.log(req.file);
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  const { title, content } = req.body;
  try {
    const post = await Post.create({
      title: title,
      content: content,
      imageUrl: newPath,
      postedBy: req.user._id,
    });
    console.log(post.postedBy);
    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("postedBy likes comments.postedBy", "username name");
    res.status(200).json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId).populate(
      "postedBy comments.postedBy",
      "username name"
    );
    if (!post) {
      return next(new errorResponse("post not found", 404));
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    throw error;
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return next(new errorResponse("post not found", 404));
    }
    res.status(200).json("ok");
  } catch (error) {
    next(error);
  }
};
exports.addComment = async (req, res, next) => {
  const postId = req.params.postId;
  comment = req.body.comment;
  try {
    const postComment = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { text: comment, postedBy: req.user._id } } },
      { new: true }
    );
    if (!postComment) {
      return next(new errorResponse("post not found", 404));
    }
    const post = await Post.findById(postId).populate(
      "comments.postedBy",
      "username email"
    );
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
exports.deleteComment = async (req, res, next) => {
  const { postId, commentId } = req.params;
  try {
    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);
    console.log(post.comments);
    if (!post) {
      return next(new errorResponse("post not found", 404));
    }
    if (!comment) {
      return next(new errorResponse("post not found", 404));
    }
    // console.log(comment.postedBy);
    // console.log(req.user._id);
    if (
      comment.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new errorResponse("You cannot delete this post", 403));
    }
    post.comments.pull(commentId);
    await post.save();
    res.status(200).json({ message: "comment deleted succesfully" });
  } catch (error) {
    next(error);
  }
};
exports.updatePost = async (req, res, next) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  try {
    const post = await Post.findById(req.params.postId);
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return next(
        new errorResponse("you are not authorized to update this post", 403)
      );
    }
    post.title = updatedTitle;
    post.content = updatedContent;
    if (newPath) {
      post.imageUrl = newPath;
    } else {
      post.imageUrl = post.imageUrl;
    }
    const updatedPost = await post.save();
    res.status(200).json({ sucess: true, updatedPost });
  } catch (error) {
    next(error);
  }
};
exports.addLike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const postLike = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    const post = await Post.findById(postLike._id).populate(
      "likes",
      "username"
    );
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
exports.removeLike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const postLike = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    const post = await Post.findById(postLike._id).populate(
      "likes",
      "username"
    );
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
