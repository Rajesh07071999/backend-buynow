import mongoose from "mongoose";
import moment from "moment";

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tbl_users',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tbl_products',
        required: true
    },
    price: {
        type: Number
    },
    qty: {
        type: Number,
        return: true
    },
    grand_total: {
        type: Number,
        
    },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => moment().utc().toDate() },
    updatedAt: { type: Date, default: () => moment().utc().toDate() },
});

const cartModel = mongoose.model("tbl_carts", cartSchema);
export default cartModel;
