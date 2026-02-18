import { Schema, model, models } from 'mongoose';

const CommunitySchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  color: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  channels: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
  tags: [String],
  isPrivate: { type: Boolean, default: false },
}, { timestamps: true });

const Community = models.Community || model('Community', CommunitySchema);
export default Community;
