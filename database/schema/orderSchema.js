import mongoose from "mongoose";
import moment from "moment";

const orderSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_users",
    required: true,
  },

  price: {
    type: Number,
  },
  delivery_date: {
    type: Date,
    default: () => moment().utc().format("YYYY-MM-DD HH:mm:ss"),
  },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => moment().utc().toDate() },
  updatedAt: { type: Date, default: () => moment().utc().toDate() },
});

const orderModel = mongoose.model("tbl_orders", orderSchema);
export default orderModel;
