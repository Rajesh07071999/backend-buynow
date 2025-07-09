
import mongoose from 'mongoose';
import moment from 'moment';

const userSchema = new mongoose.Schema({
  full_name: String,
  email: { type: String, unique: true },
  token: { type: String, default: "" },
  profile_image: String,
  country_code: { type: Number, default: null },
  mobile_number: { type: Number, unique: true },
  login_status: { type: String, enum: ["Online", "Offline"], default: "Offline" },
  type: { type: String, enum: ["Free", "Pro","Ai"], default: "Free" },
  last_login: { type: Date, default: () => moment().utc().toDate() },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => moment().utc().toDate() },
  updatedAt: { type: Date, default: () => moment().utc().toDate() },
});

const userModel = mongoose.model('tbl_users', userSchema);
export default userModel;
