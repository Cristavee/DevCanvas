import { Schema, model, models, Types } from "mongoose";

const UserSchema = new Schema({
  name:     { type: String, required: true, trim: true, maxlength: 50 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  avatar:   { type: String },
  bio:      { type: String, default: "", maxlength: 300 },
  location: { type: String, default: "", maxlength: 100 },
  website:  { type: String, default: "", maxlength: 200 },
  twitter:  { type: String, default: "", maxlength: 50 },
  github:   { type: String, default: "", maxlength: 50 },
  role:     { type: String, enum: ["user", "moderator", "admin"], default: "user", index: true },
  githubId: { type: String, sparse: true },
  xp:       { type: Number, default: 0, min: 0 },
  streak:   { type: Number, default: 0, min: 0 },
  lastActiveDate: { type: Date },
  tier:     { type: String, enum: ["Bronze","Silver","Gold","Platinum","Diamond"], default: "Bronze" },
  badges:   [{ type: String }],
  followers:     [{ type: Schema.Types.ObjectId, ref: "User" }],
  following:     [{ type: Schema.Types.ObjectId, ref: "User" }],
  savedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  theme:               { type: String, enum: ["dark","light","system"], default: "dark" },
  emailNotifications:  { type: Boolean, default: true },
  pushNotifications:   { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isBanned:   { type: Boolean, default: false },
  banReason:  { type: String },
}, { timestamps: true });

// Auto-compute tier from XP
UserSchema.pre("save", function (next) {
  const xp = this.xp ?? 0;
  if (xp >= 10000)     this.tier = "Diamond";
  else if (xp >= 5000) this.tier = "Platinum";
  else if (xp >= 2000) this.tier = "Gold";
  else if (xp >= 500)  this.tier = "Silver";
  else                 this.tier = "Bronze";
  next();
});

const User = models.User || model("User", UserSchema);
export default User;
