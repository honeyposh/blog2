const Post = require("../models/postModel");
const errorResponse = require("../utils/errorResponse");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
exports.createPost = async (req, res, next) => {
  const { title, content, imageUrl } = req.body;
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "blog",
      // width: 300,
      // crop: "scale"
    });
    const post = await Post.create({
      title: title,
      content: content,
      imageUrl: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      postedBy: req.user._id,
    });
    console.log(post);
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
// exports.deletePost = async (req, res, next) => {
//   try {
//     const post = await Post.findByIdAndDelete(req.params.postId);
//     const ImgId = post.imageUrl.public_id;
//     if (!post) {
//       return next(new errorResponse("post not found", 404));
//     }
//     if (ImgId) {
//       await cloudinary.uploader.destroy(ImgId);
//     }
//     res.status(200).json("ok");
//   } catch (error) {
//     next(error);
//   }
// };
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    //retrieve current image ID
    const imgId = post.imageUrl.public_id;
    if (imgId) {
      await cloudinary.uploader.destroy(imgId);
    }

    const removepost = await Post.findByIdAndDelete(req.params.postId);

    res.status(201).json({
      success: true,
      message: " Post deleted",
    });
  } catch (error) {
    console.log(error);
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
    console.log(post);
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
  try {
    const currentPost = await Post.findById(req.params.postId);
    console.log(currentPost);
    const data = {
      title: req.body.title,
      content: req.body.content,
    };
    if (req.body.imageUrl !== "") {
      const ImgId = currentPost.imageUrl.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }

      const newImage = await cloudinary.uploader.upload(req.body.imageUrl, {
        folder: "blog",
        width: 1000,
        crop: "scale",
      });
      // console.log(newImage);
      data.imageUrl = {
        public_id: newImage.public_id,
        url: newImage.secure_url,
      };
    }

    const postUpdate = await Post.findByIdAndUpdate(req.params.postId, data, {
      new: true,
    });
    // console.log(postUpdate);
    res.status(200).json({
      success: true,
      postUpdate,
    });
  } catch (error) {
    console.log(error);
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
