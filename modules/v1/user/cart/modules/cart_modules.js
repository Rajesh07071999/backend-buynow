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
  async addToCart(req, res) {
    try {
      const userId = new ObjectId(req.user_id);
      const productId = new ObjectId(req.product_id);
      const userData = await common.singleGet(userSchema, {
        _id: userId,
        is_active: true,
        is_deleted: false,
      });
      if (!userData) {
        return userMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_user_not_found,
          null
        );
      }
      const product_data = await common.singleGet(productSchema, {
        _id: productId,
        is_active: true,
        is_deleted: false,
      });
      if (!product_data) {
        return userMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_product_not_found,
          null
        );
      }
      const cartData = await common.singleGet(cartSchema, {
        user_id: userId,
        product_id: productId,
        is_active: true,
        is_deleted: false,
      });
      if (cartData) {
        const updateCartData = {
          qty: req.qty,
          price: req.price,
          grand_total: req.qty * req.price,
        };

        const updateCart = await common.singleUpdate(
          updateCartData,
          cartSchema,
          { _id: cartData._id }
        );
        if (updateCart) {
          return userMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_cart_item_updated,
            null
          );
        }
      } else {
        const cartData = {
          user_id: userId,
          product_id: productId,
          qty: req.qty,
          price: req.price,
          grand_total: req.qty * req.price,
        };
        const createCart = await common.singleInsert(cartData, cartSchema);
        if (createCart) {
          return userMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_cart_item_added,
            null
          );
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            lang[req.language].rest_keyword_cart_operation_failed,
            null
          );
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
  async cartListing(req, res) {
    try {
      let obj = { user_id: new ObjectId(req.user_id) };

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
  },
  async removeCart(req, res) {
    try {
      const cartId = new ObjectId(req.id);
  
     
      const cartData = await common.singleGet(cartSchema, { _id: cartId });
  
      if (!cartData) {
        return userMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_cart_not_found,
          null
        );
      }
      const deleteCart = await common.singleDelete(cartSchema, { _id: cartId });
  
      if (deleteCart) {
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword_cart_item_removed,
          null
        );
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.INTERNAL_ERROR,
          lang[req.language].rest_keywords_something_went_wrong,
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
