// adminSchema.js
import mongoose from 'mongoose';
import moment from 'moment';

const adminSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  country_code: { type: Number, default: null },
  mobile_number: { type: Number, unique: true },
  password: { type: String, required: true },
  token: { type: String, default: "" },
  profile_image: String,
  role: { type: String, enum: ["admin", "subadmin"], default: "admin" },
  login_status: { type: String, enum: ["Online", "Offline"], default: "Offline" },
  last_login: { type: Date, default: () => moment().utc().toDate() },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => moment().utc().toDate() },
  updatedAt: { type: Date, default: () => moment().utc().toDate() },
});

const adminModel = mongoose.model('tbl_admins', adminSchema);
export default adminModel;
 