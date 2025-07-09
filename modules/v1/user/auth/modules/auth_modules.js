import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";

import common from "../../../../../config/common.js";
import mongoose from "mongoose";
import userSchema from "../../../../../database/schema/userSchema.js";
const { ObjectId } = mongoose.Types;
import GLOBALS from "../../../../../config/constant.js";
import jwt from "jsonwebtoken";
import template from "../../../../../config/template.js";
import userSubscriptionModel from "../../../../../database/schema/userSubscriptionSchema.js";

const userModule = {
  async register(req, res) {
    try {
      const checkEmailUnique = await common.checkUniqueEmail(
        req.email,
        userSchema
      );
      if (checkEmailUnique) {
        return userMiddleware.sendResponse(
          res,
          Codes.DUPLICATE_VALUE,
          lang[req.language].rest_keywords_unique_email_error,
          []
        );
      }
      const checkUniqueMobile = await common.checkUniqueMobile(
        req.mobile_number,
        userSchema
      );
      if (checkUniqueMobile) {
        return userMiddleware.sendResponse(
          res,
          Codes.DUPLICATE_VALUE,
          lang[req.language].rest_keyword_unique_mobile_number_error,
          null
        );
      }
      const signupObject = {
        full_name: req.name,
        email: req.email,
        profile_image: req.profile_image,
        country_code: req.country_code,
        mobile_number: req.mobile_number,
      };

      const registerUser = await common.singleInsert(signupObject, userSchema);

      if (registerUser) {
        const token = jwt.sign(
          { userId: registerUser.id },
          GLOBALS.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        const updateAdminToken = {
          token: token,
          login_status: "Online",
          last_login: new Date(),
        };
        try {
          await common.singleUpdate(updateAdminToken, userSchema, {
            email: req.email,
            is_active: true,
            is_deleted: false,
          });
         
          const insertData = {
            subscription_id: process.env.subscription_id,
            type: "Free",
            expire_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            user_id:registerUser.id
          };
          const insertSubscription = await common.singleInsert(
            insertData,
            userSubscriptionModel
          );
          if (insertSubscription) {
            const adminUpdatedData = await common.singleGet(userSchema, {
              email: req.email,
              is_deleted: false,
              is_active: true,
            });

            return userMiddleware.sendResponse(
              res,
              Codes.SUCCESS,
              lang[req.language].rest_keywords_success_signup,
              adminUpdatedData
            );
          }
        } catch (error) {
          console.log(error);
          
          return userMiddleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            lang[req.language].rest_keywords_something_went_wrong,
            { message: error.message, stack: error.stack }
          );
        }
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language]
            .rest_keyword_something_went_wrong_while_signup_user,
          null
        );
      }
    } catch (error) {
      return userMiddleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        lang[req.language].rest_keywords_something_went_wrong
      );
    }
  },
  async login(req, res) {
    try {
      const userData = await common.singleGet(userSchema, {
        email: req.email,
        is_deleted: false,
        is_active: true,
      });

      if (userData) {
        const token = jwt.sign({ userId: userData.id }, GLOBALS.JWT_SECRET, {
          expiresIn: "7d",
        });
        const updateAdminToken = {
          token: token,
          login_status: "Online",
          last_login: new Date(),
        };
        try {
          await common.singleUpdate(updateAdminToken, userSchema, {
            email: req.email,
            is_active: true,
            is_deleted: false,
          });

          const adminUpdatedData = await common.singleGet(userSchema, {
            email: req.email,
            is_deleted: false,
            is_active: true,
          });

          return userMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_admin_login_success,
            adminUpdatedData
          );
        } catch (error) {
          return userMiddleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            lang[req.language].rest_keywords_something_went_wrong,
            { message: error.message, stack: error.stack }
          );
        }
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_invalid_credentials,
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

  async logout(req, res) {
    const userId = new ObjectId(req.user_id);

    const userData = await common.singleGet(userSchema, {
      _id: userId,
      is_deleted: false,
      is_active: true,
    });

    if (userData) {
      try {
        const updateInfo = {
          login_status: "Offline",
          token: "",
        };
        const adminSignout = await common.singleUpdate(updateInfo, userSchema, {
          _id: userId,
          is_active: true,
          is_deleted: false,
        });
        if (!adminSignout) {
          return userMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keywords_something_went_wrong
          );
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_admin_logout,
            null
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
    } else {
      return userMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keyword_user_not_found,
        null
      );
    }
  },

  async userDetails(req, res) {
    try {
      const userId = new ObjectId(req.user_id);

      const Userobj = {
        is_active: true,
        is_deleted: false,
        _id: userId,
      };
      const userInfo = await userSchema.aggregate([
        { $match: Userobj },
        {
          $lookup: {
            from: "tbl_user_subscriptions",
            localField: "_id",
            foreignField: "user_id",
            as: "usersubscription",
          },
        },
        {
          $addFields: {
            expire_date: {
              $cond: [
                { $gt: [{ $size: "$usersubscription" }, 0] },
                { $arrayElemAt: ["$usersubscription.expire_date", 0] },
                null,
              ],
            },
          },
        },
        {
          $project: {
            usersubscription: 0,
          },
        },
      ]);
      if (!userInfo) {
        return userMiddleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          lang[req.language].rest_keyword_user_not_found,
          null
        );
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword_success,
          userInfo
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
  async contactUs(req, res) {
    try {
      const userId = new ObjectId(req.user_id);

      const userInfo = await common.singleGet(userSchema, {
        _id: userId,
        is_deleted: false,
        is_active: true,
      });

      const value = {
        subject: req.subject,
        description: req.message,
        email: req.email,
        full_name: userInfo.full_name,
      };
      const sendReplyTemplate = await template.contactUsInquiry(value);
      const response = await common.sendEmail(
        GLOBALS.EMAIL_ID,
        `${GLOBALS.APP_NAME} - ${req.subject}`,
        sendReplyTemplate
      );

      if (response) {
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keywords_contactus_success,
          userInfo
        );
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          lang[req.language].rest_keywords_contactus_error,
          null
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
};

export default userModule;
