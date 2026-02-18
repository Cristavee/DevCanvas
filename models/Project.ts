import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  title:       { type: String, required: true, trim: true, maxlength: 120, index: "text" },
  description: { type: String, default: "", maxlength: 1000, index: "text" },
  codeSnippet: { type: String, required: true },
  language:    { type: String, required: true, index: true },
  tags:        [{ type: String, maxlength: 30, index: true }],
  author:      { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  likes:       [{ type: Schema.Types.ObjectId, ref: "User" }],
  bookmarks:   [{ type: Schema.Types.ObjectId, ref: "User" }],
  views:       { type: Number, default: 0 },
  visibility:  { type: String, enum: ["Public","Private"], default: "Public", index: true },
  thumbnailUrl:{ type: String },
  forkOf:      { type: Schema.Types.ObjectId, ref: "Project" },
  forksCount:  { type: Number, default: 0 },
}, { timestamps: true });

// Text search index
ProjectSchema.index({ title: "text", description: "text", tags: "text" });
// Feed sorting index
ProjectSchema.index({ visibility: 1, createdAt: -1 });
ProjectSchema.index({ visibility: 1, likes: -1 });

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
