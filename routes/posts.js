const express = require("express");
const { getPosts, getPost, createPost, updatePost, deletePost } = require("../controllers/posts");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getPosts);
router.get("/:id", auth, getPost);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;