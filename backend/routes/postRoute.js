const express = require("express");
const router = express.Router();
const { isAuthorized, isAdmin } = require("../middleware/is-auth");
const postController = require("../controllers/postController");
router.post("/createpost", isAuthorized, isAdmin, postController.createPost);
router.get("/getposts", postController.getPosts);
router.get("/getpost/:postId", postController.getPost);
router.delete(
  "/deletepost/:postId",
  isAuthorized,
  isAdmin,
  postController.deletePost
);
router.post("/comment/:postId", isAuthorized, postController.addComment);
router.put("/updatepost/:postId", isAuthorized, postController.updatePost);
router.put("/addlike/:postId", isAuthorized, postController.addLike);
router.put("/removelike/:postId", isAuthorized, postController.removeLike);
router.delete(
  "/posts/:postId/comments/:commentId",
  isAuthorized,
  postController.deleteComment
);

module.exports = router;
