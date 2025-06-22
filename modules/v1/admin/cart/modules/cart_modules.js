import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";
import userSchema from "../../../../../database/schema/userSchema.js";
import productSchema from "../../../../../database/schema/productSchema.js";
import cartSchema from "../../../../../database/schema/cartSchema.js";
import common from "../../../../../config/common.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

const cartModule = {

  async cartListing(req, res) {
    try {
      let obj = {};

      if (req.id) {
        obj._id = new ObjectId(req.id);
      }
      const cartListingData = await cartSchema.aggregate([
        {
          $match: obj,
        },
        {
          $lookup: {
            from: "tbl_products",
            localField: "product_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: {
            path: "$productDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "tbl_users",
            localField: "user_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            qty: 1,
            createdAt: 1,
            "productDetails.name": 1,
            "productDetails.price": 1,
            "productDetails.image": 1,
            "userDetails.full_name": 1,
            "userDetails.email": 1,
          },
        },
      ]);

      if (cartListingData) {
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword_cart_fetch_success,
          cartListingData
        );
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.INTERNAL_ERROR,
          lang[req.language].rest_keyword_cart_not_found,
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


};

export default cartModule;
