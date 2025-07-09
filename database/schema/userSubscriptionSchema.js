import mongoose from "mongoose";
import moment from "moment";

const userSubscriptionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_users",
    required: true,
  },
  subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_subscription_plan",
    required: true,
  },
  expire_date: {
    type: Date,
  },
  start_date: { type: Date, default: () => moment().utc().toDate() },
  type: { type: String, enum: ["Free", "Pro", "Ai"], default: "Free" },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => moment().utc().toDate() },
  updatedAt: { type: Date, default: () => moment().utc().toDate() },
});

const userSubscriptionModel = mongoose.model(
  "tbl_user_subscriptions",
  userSubscriptionSchema
);
export default userSubscriptionModel;
