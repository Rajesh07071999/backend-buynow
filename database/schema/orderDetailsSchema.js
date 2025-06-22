import mongoose from "mongoose";
import moment from "moment";

const orderDetailsSchema = mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tbl_orders',
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tbl_products',
    },
    qty: {
        type: Number,
    },
    price: {
        type: Number,
    },
    grand_total: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["Confrimed", "Pending", "Cancelled","Delivered","Rejected"],
        default: "Pending"
    },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => moment().utc().toDate() },
    updatedAt: { type: Date, default: () => moment().utc().toDate() },


});
const orderDetailsModel = mongoose.model('tbl_order_details', orderDetailsSchema);
export default orderDetailsModel; 