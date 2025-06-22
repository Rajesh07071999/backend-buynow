import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";
import userSchema from "../../../../../database/schema/userSchema.js";
import cartSchema from "../../../../../database/schema/cartSchema.js";
import orderSchema from "../../../../../database/schema/orderSchema.js";
import orderDetailsSchema from "../../../../../database/schema/orderDetailsSchema.js";
import common from "../../../../../config/common.js";
import mongoose from "mongoose";
import moment from "moment"

const { ObjectId } = mongoose.Types;

const orderModule = {
  async orderPlace(req, res) {
    try {
      const userId = new ObjectId(req.user_id);
      for (const element of req.orderItems) {
        const delivery_date = new Date();
        delivery_date.setDate(delivery_date.getDate() + 5);
        await common.singleUpdate({ address: req.address, shipping_address: req.shipping_address }, userSchema, { _id: userId })
        const params = {
          user_id: userId,
          price: element.total_price,
          delivery_date: delivery_date,
        };
        const addOrders = await common.singleInsert(params, orderSchema);
        if (!addOrders) {
          return userMiddleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            lang[req.language].rest_keyword_order_placed_error,
            null
          );
        }
        const orderDetails = req.orderItems.map((item) => ({
          order_id: addOrders._id,
          product_id: item.product_id,
          qty: item.qty,
          price: item.price,
          grand_total: req.grand_total,
        }));
        const addOrderDetails = await common.singleInsert(
          orderDetails,
          orderDetailsSchema
        );
        if (!addOrderDetails) {
          return userMiddleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            lang[req.language].rest_keyword_order_placed_error,
            null
          );
        } else {
          const deleteCart = await cartSchema.deleteMany({ user_id: userId });

          const orderDetail = {
            order_id: orderDetails[0].order_id,
            status: "Pending",
            delivery_date: addOrders.delivery_date
          }
          if (deleteCart) {
            return userMiddleware.sendResponse(
              res,
              Codes.SUCCESS,
              lang[req.language].rest_keyword_order_placed_success,
              orderDetail
            );
          }
        }
      }
    } catch (error) {
      return userMiddleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  },

async orderListing(req, res) {
  try {
    const userId = new ObjectId(req.user_id);
    let matchOrderId = req.id ? new ObjectId(req.id) : null;

    const matchConditions = [
      {
        $lookup: {
          from: "tbl_orders",
          localField: "order_id",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      { $unwind: "$orderDetails" },
      {
        $match: {
          "orderDetails.user_id": userId,
          ...(matchOrderId && { "orderDetails._id": matchOrderId }),
        },
      },
      {
        $lookup: {
          from: "tbl_products",
          localField: "product_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ];

    const orderListing = await orderDetailsSchema.aggregate(matchConditions);

    // ===== Monthly Order Summary =====
    const monthlyStatsMap = {};

    orderListing.forEach((order) => {
      const date = moment(order.orderDetails.delivery_date);
      const key = date.format("YYYY-MM");
      const amount = order.grand_total || 0;

      if (!monthlyStatsMap[key]) {
        monthlyStatsMap[key] = {
          month: date.format("MMM YYYY"),
          orderCount: 0,
          totalSpent: 0,
        };
      }

      monthlyStatsMap[key].orderCount += 1;
      monthlyStatsMap[key].totalSpent += amount;
    });

    const monthlyStats = Object.values(monthlyStatsMap).sort((a, b) =>
      moment(a.month, "MMM YYYY") - moment(b.month, "MMM YYYY")
    );

    if (orderListing.length > 0) {
      return userMiddleware.sendResponse(
        res,
        Codes.SUCCESS,
        lang[req.language].rest_keyword_order_list_fetch_success,
        {
          orders: orderListing,
          monthlyStats,
        }
      );
    } else {
      return userMiddleware.sendResponse(
        res,
        Codes.NOT_FOUND,
        lang[req.language].rest_keyword_order_not_found,
        null
      );
    }
  } catch (error) {
    return userMiddleware.sendResponse(
      res,
      Codes.INTERNAL_ERROR,
      lang[req.language].rest_keywords_something_went_wrong,
      { message: error.message, stack: error.stack }
    );
  }
}
,
  async cancelOrder(req, res) {
    try {
      const orderId = new ObjectId(req.id);

      const cancelData = await common.singleUpdate(
        { status: "Cancelled" },
        orderDetailsSchema,
        { _id: orderId }
      );
      if (cancelData) {
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword_order_status_updated,
          null
        );
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.INTERNAL_ERROR,
          lang[req.language].rest_keyword_order_status_update_failed,
          null
        );
      }
    } catch (error) {
      return userMiddleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  },
};

export default orderModule;
