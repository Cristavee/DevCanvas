import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional - only for credentials auth
  avatar: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  githubId: { type: String },
  googleId: { type: String },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
