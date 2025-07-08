
import mongoose from 'mongoose';
import moment from 'moment';

const subscriptionSchema = new mongoose.Schema({
  name: String,
  price: String,
  duration: String,
  description: String,
  feature: [String],
  type: { type: String, enum: ["Free", "Pro","Ai"], default: "Free" },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => moment().utc().toDate() },
  updatedAt: { type: Date, default: () => moment().utc().toDate() },
});

const subscriptionModel = mongoose.model('tbl_subscription_plan', subscriptionSchema);
export default subscriptionModel;
