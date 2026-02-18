import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  githubId: { type: String },
  googleId: { type: String },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  savedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
