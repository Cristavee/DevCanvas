import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  editedAt: { type: Date },
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

const Message = models.Message || model('Message', MessageSchema);
export default Message;
