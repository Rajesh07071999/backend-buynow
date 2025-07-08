import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";

import common from "../../../../../config/common.js";
import mongoose from "mongoose";
import userSchema from "../../../../../database/schema/userSchema.js";
const { ObjectId } = mongoose.Types;
import GLOBALS from "../../../../../config/constant.js";
import jwt from "jsonwebtoken";

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

      const signupObject = {
        full_name: req.name,
        email: req.email,
        profile_image: req.profile_image,
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

      const userInfo = await common.singleGet(userSchema, {
        _id: userId,
        is_deleted: false,
        is_active: true,
      });

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
};

export default userModule;
