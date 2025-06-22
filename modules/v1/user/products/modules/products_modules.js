import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";
import common from "../../../../../config/common.js";
import productSchema from "../../../../../database/schema/productSchema.js";
import mongoose from "mongoose";
import ratingSchema from "../../../../../database/schema/ratingSchema.js";
const { ObjectId } = mongoose.Types;

const productsModule = {


  async productListing(req, res) {
    try {
      let matchObj = {
        is_active: true,
        is_deleted: false,
      };

      if (req.id) {
        matchObj._id = new ObjectId(req.id);
      }

      if (req.search && req.search.trim() !== "") {
        matchObj.name = { $regex: req.search.trim(), $options: "i" };
      }

      if (req.category) {
        matchObj.category = req.category;
      }

      if (req.price) {
        matchObj.price = { $lte: Number(req.price) };
      }

      const sortField = req.sortOrder ? "price" : "_id";
      const sortOrder = req.sortOrder === "asc" ? 1 : -1;


      const page = parseInt(req.page) || 1;
      const limit = parseInt(req.limit) || 10;
      const skip = (page - 1) * limit;

      const productData = await productSchema.aggregate([
        { $match: matchObj },
        {
          $lookup: {
            from: "tbl_ratings",
            localField: "_id",
            foreignField: "product_id",
            as: "ratings"
          }
        },

        {
          $addFields: {
            averageRating: {
              $round: [
                {
                  $cond: [
                    { $gt: [{ $size: "$ratings" }, 0] },
                    { $avg: "$ratings.rating" },
                    0
                  ]
                },
                1
              ]
            }
          }
        },
        ...(req.rating ? [{
          $match: {
            averageRating: { $gte: Number(req.rating) }
          }
        }] : []),
        { $sort: { [sortField]: sortOrder } },
        { $skip: skip },
        { $limit: limit },
      ]);

      if (productData.length === 0) {
        return userMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_product_not_found,
          null
        );
      }

      return userMiddleware.sendResponse(
        res,
        Codes.SUCCESS,
        lang[req.language].rest_keywords_success,
        productData
      );
    } catch (error) {
      return userMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  }
  ,
  async addProductRating(req, res) {
    try {
      const userId = new ObjectId(req.user_id);
      const productId = new ObjectId(req.product_id);

      const existingRating = await ratingSchema.findOne({ user_id: userId, product_id: productId });

      if (existingRating) {
        const update = await ratingSchema.updateOne(
          { user_id: userId, product_id: productId },
          { $set: { rating: req.rating, updated_at: new Date() } }
        );

        if (update.modifiedCount > 0) {
          return userMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_product_updated_rating_success || "Rating updated successfully",
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
      } else {
        const addRating = await common.singleInsert(
          { user_id: userId, product_id: productId, rating: req.rating, created_at: new Date() },
          ratingSchema
        );
        if (addRating) {
          return userMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_product_added_rating_success,
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
      }
    } catch (error) {
      return userMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  }

};

export default productsModule;
