import mongoose from 'mongoose';
import moment from 'moment';

const ratingSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_users",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_products",
    required: true,
  },
  rating: {
    type: Number,
  },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => moment().utc().toDate() },
  updatedAt: { type: Date, default: () => moment().utc().toDate() },
});

const ratingModel = mongoose.model("tbl_ratings", ratingSchema);
export default ratingModel;
