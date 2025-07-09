import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";
import common from "../../../../../config/common.js";
import mongoose from "mongoose";
import subscriptionModel from "../../../../../database/schema/subscriptionSchema .js";
import Razorpay from "razorpay";
import userSubscriptionModel from "../../../../../database/schema/userSubscriptionSchema.js";
import userModel from "../../../../../database/schema/userSchema.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const { ObjectId } = mongoose.Types;

const productsModule = {
  async addSubscriptionplans(req, res) {
    try {
      const addData = {
        name: req.name,
        price: req.price,
        duration: req.duration,
        type: req.type,
        feature: req.feature,
        description: req.description,
      };

      const subscriptionInsert = await common.singleInsert(
        addData,
        subscriptionModel
      );

      if (subscriptionInsert) {
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keywords_subscription_added_success,
          null
        );
      } else {
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
  async subscriptionListing(req, res) {
    try {
      const obj = {
        is_active: true,
        is_deleted: false,
      };
      const subscriptionData = await subscriptionModel.aggregate([
        {
          $match: obj,
        },
      ]);
      const userId = new ObjectId(req.user_id);
      const Userobj = {
        is_active: true,
        is_deleted: false,
        user_id:userId
      };
      const UsersubscriptionData = await userSubscriptionModel.aggregate([
        {
          $match: Userobj,
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
          {subscriptionData,UsersubscriptionData}
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
  async payment(req, res) {
 
    try {
      const { amount } = req;
      const plan_id = new ObjectId(req.plan_id);

      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      try {
        const order = await razorpay.orders.create(options);

        const OrderData = {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        };
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keywords_subscription_list_success,
          OrderData
        );
      } catch (error) {
        console.log(error);

        return userMiddleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          lang[req.language].rest_keywords_something_went_wrong,
          { message: error.message, stack: error.stack }
        );
      }
    } catch (error) {
      return userMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  },
  async paymentCapture(req, res) {
    try {
      const userId = new ObjectId(req.user_id);
      const existingSubscription = await common.singleGet(userSubscriptionModel, {
        user_id: userId,
      });
  
      if (existingSubscription) {
        await common.singleUpdate(
          {
            subscription_id: req.plan_id,
            type: req.type,
            expire_date: req.expire_date,
          },
          userSubscriptionModel,
          { user_id: req.user_id }
        );
      } else {
        await common.singleInsert(
          {
            user_id: req.user_id,
            subscription_id: req.plan_id,
            type: req.type,
            expire_date: req.expire_date,
          },
          userSubscriptionModel
        );
      }

        await common.singleUpdate({ type: req.type }, userModel, {
          _id: userId,
        });

        const UserData=await common.singleGet(userModel,{_id:userId})
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keywords_success,
          UserData
        );
     
    } catch (error) {
      return userMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  },
 
};

export default productsModule;
