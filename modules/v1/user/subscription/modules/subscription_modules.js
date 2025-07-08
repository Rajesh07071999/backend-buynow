import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";
import common from "../../../../../config/common.js";
import mongoose from "mongoose";
import subscriptionModel from "../../../../../database/schema/subscriptionSchema .js";

const { ObjectId } = mongoose.Types;

const productsModule = {
  async addSubscriptionplans(req, res) {
    try {

      
      const addData = {
        name: req.name,
        price: req.price,
        duration:req.duration,
        type:req.type,
        feature:req.feature,
        description:req.description
      };

      const subscriptionInsert=await common.singleInsert(addData,subscriptionModel)

      if (subscriptionInsert) {
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keywords_subscription_added_success,
          null
        );
      
      }
      else{
        return userMiddleware.sendResponse(
          res,
          Codes.INTERNAL_ERROR,
          lang[req.language].rest_keywords_subscription_added_error,
          null
        );
      }
    } catch (error) {
      console.log(error);
      
      return userMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  },
  async subscriptionListing(req,res){
    try {
      const obj={
        is_active:true,
        is_deleted:false
      }
      const subscriptionData = await subscriptionModel.aggregate([
        {
          $match: obj,
        },
      ]);


      if (subscriptionData.length == 0) {
        return userMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keywords_subscription_data_not_found,
          null
        );
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keywords_subscription_list_success,
          subscriptionData
        );
      }
    } catch (error) {
      console.log(error);
      
      return userMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  },
  async payment(req,res){
    
  }
  
};

export default productsModule;
