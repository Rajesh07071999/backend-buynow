import adminMiddleware from "../../../../../middleware/cryptojsValidationHeader.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";

import common from "../../../../../config/common.js";
import mongoose from "mongoose";
import productSchema from "../../../../../database/schema/productSchema.js";
const { ObjectId } = mongoose.Types;

const productsModule = {
  async addProducts(req, res) {
    try {
      const productData = {
        name: req.name,
        price: req.price,
        description: req.description,
        image: req.image,
        category: req.category,
        stock_count: req.stock_count,
      };
      const addProduct = await common.singleInsert(productData, productSchema);
      if (addProduct) {
        return adminMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword_product_added_success,
          null
        );
      } else {
        return adminMiddleware.sendResponse(
          res,
          Codes.INTERNAL_ERROR,
          lang[req.language].rest_keyword_product_added_error,
          { message: error.message, stack: error.stack }
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
  async productListing(req, res) {
    try {
      let obj = {
        is_active: true,
        is_deleted: false,
      };
      if (req.id) {
        obj._id = new ObjectId(req.id);
      }
      if (req.search && req.search.trim() !== "") {
        obj.name = { $regex: req.search.trim(), $options: "i" };
      }
      const productData = await productSchema.aggregate([
        {
          $match: obj,
        },
        {
          $sort: { _id: -1 },
        },
      ]);

      if (productData.length == 0) {
        return adminMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_product_not_found,
          null
        );
      } else {
        return adminMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keywords_success,
          productData
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
  async editProduct(req, res) {
    try {
      const productId = new ObjectId(req.id);
      const productData = await common.singleGet(productSchema, {
        _id: productId,
        is_active: true,
        is_deleted: false,
      });

      if (!productData) {
        return adminMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_product_not_found,
          null
        );
      } else {
        const editData = {
          name:
            req.name !== undefined && req.name !== null
              ? req.name
              : productData.name,
          price:
            req.price !== undefined && req.price !== null
              ? req.price
              : productData.price,
          description:
            req.description !== undefined && req.description !== null
              ? req.description
              : productData.description,
          image:
            req.image !== undefined && req.image !== null
              ? req.image
              : productData.image,
          stock_count:
            req.stock_count !== undefined && req.stock_count !== null
              ? req.stock_count
              : productData.stock_count,
          category:
            req.category !== undefined && req.category !== null
              ? req.category
              : productData.category,
        };
        const updatedProduct = await common.singleUpdate(
          editData,
          productSchema,
          { _id: productId }
        );
        if (updatedProduct) {
          const productData = await common.singleGet(productSchema, {
            _id: productId,
            is_active: true,
            is_deleted: false,
          });

          return adminMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_product_edited_success,
            productData
          );
        } else {
          return adminMiddleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            lang[req.language].rest_keyword_product_edited_error,
            null
          );
        }
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
  async deleteProduct(req, res) {
    try {
      const productId = new ObjectId(req.id);
      const productData = await common.singleGet(productSchema, {
        _id: productId,
        is_active: true,
        is_deleted: false,
      });

      if (!productData) {
        return adminMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_product_not_found,
          null
        );
      } else {
        const deleteProduct = await common.singleUpdate(
          { is_deleted: true, is_active: false },
          productSchema,
          { _id: productId }
        );
        if (deleteProduct) {
          return adminMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_success_product_deleted,
            null
          );
        } else {
          return adminMiddleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            lang[req.language].rest_keyword_err_deleted_product,
            { message: error.message, stack: error.stack }
          );
        }
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
};

export default productsModule;
