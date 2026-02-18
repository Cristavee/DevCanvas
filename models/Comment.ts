import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  author:  { type: Schema.Types.ObjectId, ref: "User",    required: true },
  content: { type: String, required: true, maxlength: 1000 },
  likes:   [{ type: Schema.Types.ObjectId, ref: "User" }],
  parentComment: { type: Schema.Types.ObjectId, ref: "Comment" }, // for threading
}, { timestamps: true });

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
