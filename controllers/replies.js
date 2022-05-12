const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

module.exports = (app) => {
  // NEW REPLY
  app.get("/post/:postId/comments/:commentId/replies/new", (req, res) => {
    const currentUser = req.user;
    let post;
    Post.findById(req.params.postId)
        .lean()
        .then((p) => {
          post = p;
          return Comment.findById(req.params.commentId).lean();
        })
        .then((comment) => {
          res.render("replies-new", { post, comment, currentUser });
        })
        .catch((err) => {
          console.log(err.message);
        });
  });

  // CREATE REPLY
  app.post("/post/:postId/comments/:commentId/replies", (req, res) => {
    // TURN REPLY INTO A COMMENT OBJECT
    const reply = new Comment(req.body);
    reply.author = req.user._id;
    // LOOKUP THE PARENT POST
    Post.findById(req.params.postId).then((post) => {
      // FIND THE CHILD COMMENT
      Promise.all([reply.save(), Comment.findById(req.params.commentId)])
          .then(([reply, comment]) => {
            // ADD THE REPLY
            comment.comments.unshift(reply._id);
            return Promise.all([comment.save()]);
          })
          .then(() => res.redirect(`/post/${req.params.postId}`))
          .catch(console.error);
      // SAVE THE CHANGE TO THE PARENT DOCUMENT
      return post.save();
    });
  });
};