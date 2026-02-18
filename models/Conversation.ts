import { Schema, model, models } from 'mongoose';

const ConversationSchema = new Schema({
  type: { type: String, enum: ['dm', 'group', 'channel'], default: 'dm' },
  name: { type: String }, // for group/channel
  description: { type: String },
  avatar: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  community: { type: Schema.Types.ObjectId, ref: 'Community' },
}, { timestamps: true });

const Conversation = models.Conversation || model('Conversation', ConversationSchema);
export default Conversation;
