const mongoose = require("mongoose");
const { Schema } = mongoose;

const INVITE_STATUS = Object.freeze({
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELED: "canceled",
});

const inviteSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(INVITE_STATUS),
      default: INVITE_STATUS.PENDING,
      required: true,
    },
  },
  { timestamps: true },
);

const Invite = mongoose.model("Invite", inviteSchema);
module.exports = { Invite, INVITE_STATUS };
