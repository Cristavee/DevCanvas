import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  codeSnippet: { type: String, required: true },
  language: { type: String, required: true, index: true },
  tags: [{ type: String, index: true }],
  thumbnailUrl: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  visibility: { 
    type: String, 
    enum: ['Public', 'Private'], 
    default: 'Public' 
  },
}, { timestamps: true });

// Avoid overwriting model during HMR
const Project = models.Project || model('Project', ProjectSchema);
export default Project;
