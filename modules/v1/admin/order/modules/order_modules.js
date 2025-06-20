import adminMiddleware from "../../../../../middleware/cryptojsValidationHeader.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";
import common from "../../../../../config/common.js";
import mongoose from "mongoose";
import cartSchema from "../../../../../database/schema/cartSchema.js";
import orderSchema from "../../../../../database/schema/orderSchema.js";
import orderDetailsSchema from "../../../../../database/schema/orderDetailsSchema.js";
const { ObjectId } = mongoose.Types;

const orderModule={

    async orderListing(req,res){
        try {
            let matchOrderId ;
            if (req.id) {
                matchOrderId = req.id ? new ObjectId(req.id) : null;
            }
            const matchConditions = [
              {
                $lookup: {
                  from: "tbl_orders",
                  localField: "order_id",
                  foreignField: "_id",
                  as: "orderDetails",
                },
              },
             
              {
                $match: {
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
      
            if (orderListing && orderListing.length > 0) {
              return adminMiddleware.sendResponse(
                res,
                Codes.SUCCESS,
                lang[req.language].rest_keyword_order_list_fetch_success,
                orderListing
              );
            } else {
              return adminMiddleware.sendResponse(
                res,
                Codes.NOT_FOUND,
                lang[req.language].rest_keyword_order_not_found,
                null
              );
            }
          } catch (error) {
            return adminMiddleware.sendResponse(
              res,
              Codes.INTERNAL_ERROR,
              lang[req.language].rest_keywords_something_went_wrong,
              { message: error.message, stack: error.stack }
            );
          }
    },
    async orderUpdateStatas(req, res) {
        try {
          const orderId = new ObjectId(req.id);
    
          const cancelData = await common.singleUpdate(
            { status: req.status },
            orderDetailsSchema,
            { _id: orderId }
          );
          if (cancelData) {
            return adminMiddleware.sendResponse(
              res,
              Codes.SUCCESS,
              lang[req.language].rest_keyword_order_status_updated,
              null
            );
          } else {
            return adminMiddleware.sendResponse(
              res,
              Codes.INTERNAL_ERROR,
              lang[req.language].rest_keyword_order_status_update_failed,
              null
            );
          }
        } catch (error) {
          return adminMiddleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            lang[req.language].rest_keywords_something_went_wrong,
            { message: error.message, stack: error.stack }
          );
        }
      },

}

export default orderModule;  