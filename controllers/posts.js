const Post = require("../models/posts");

const getPosts = async (req, res) => {
  const posts = await Post.find();
  const postsWithFlag = posts.map((post) => ({
    ...post._doc,
    isMine: post.userId.toString() === req.user._id.toString(),
  }));
  res.status(200).json({ status: "success", data: { posts: postsWithFlag } });
};

const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const isMine = post.userId.toString() === req.user._id.toString();
  res.status(200).json({ status: "success", data: { post: { ...post._doc, isMine } } });
};

const createPost = async (req, res) => {
  const post = await Post.create({ ...req.body, userId: req.user._id });
  res.status(201).json({ status: "success", data: { post } });
};

const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not authorized to update this post" });
  }
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ status: "success", data: { post: updatedPost } });
};

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not authorized to delete this post" });
  }
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };