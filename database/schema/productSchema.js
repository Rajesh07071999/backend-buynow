import mongoose from "mongoose";
import moment from "moment";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  stock_count: { type: Number, default: 0 },
  image: String,
  rating: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => moment().utc().toDate() },
  updatedAt: { type: Date, default: () => moment().utc().toDate() },
});

const productModel = mongoose.model("tbl_products", productSchema);
export default productModel;
