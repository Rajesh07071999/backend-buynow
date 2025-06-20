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
          Codes.NOT_FOUND,
          lang[req.language].rest_keywords_unique_email_error,
          null
        );
      }

      const checkUniqueMobile = await common.checkUniqueMobile(
        req.mobile_number,
        userSchema
      );
      if (checkUniqueMobile) {
        return userMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_unique_mobile_number_error,
          null
        );
      }
      const encPass = await userMiddleware.encryption(req.password);
      const signupObject = {
        full_name: req.full_name,
        email: req.email,
        address: req.address,
        shipping_address: req.address,
        country_code: req.country_code,
        mobile_number: req.mobile_number,
        password: encPass,
        profile_image: req.profile_image,
      };

      const registerUser = await common.singleInsert(signupObject, userSchema);

      if (registerUser) {

        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keywords_success_signup,
          null
        );
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.INTERNAL_ERROR,
          lang[req.language]
            .rest_keyword_something_went_wrong_while_signup_user,
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
  async login(req, res) {
    try {
      const userData = await common.singleGet(userSchema, {
        email: req.email,
        is_deleted: false,
        is_active:true
      });
      console.log(userData)
      if (userData) {
          const encPass = await userMiddleware.encryption(req.password);

          if (userData.password == encPass) {
            const token = jwt.sign(
              { userId: userData.id },
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
              Codes.VALIDATION_ERROR,
              lang[req.language].rest_keyword_invalid_credentials,
              null
            );
          }
       
      } else {
        return userMiddleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          lang[req.language].rest_keyword_invalid_credentials,
          null
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
  },

  async logout(req, res) {
    const userId = new ObjectId(req.user_id);

    const userData = await common.singleGet(userSchema, {
      _id: userId,
      is_deleted: false,
      is_active:true
    });

    if (!userData) {
      try {
        const updateInfo = {
          login_status: "Offline",
          token: "",
        };
        const adminSignout = await common.singleUpdate(
          updateInfo,
          userSchema,
          {
            _id: userId,
            is_active: true,
            is_deleted: false,
          }
        );
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

  async changePassword(req, res) {
    try {
      const userId = new ObjectId(req.user_id);
      const password = await userMiddleware.encryption(req.old_password);

      const userData = await common.singleGet(userSchema, {
        _id: userId,
        is_deleted: false,
        is_active:true
      });

      if (!userData) {
        return userMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_user_not_found,
          null
        );
      } else {
        if (password !== userData.password) {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            lang[req.language].rest_keyword_old_new_password_incorect,
            null
          );
        } else {
          if (userData) {
            if (req.old_password == req.new_password) {
              return userMiddleware.sendResponse(
                res,
                Codes.VALIDATION_ERROR,
                lang[req.language].rest_keyword_old_new_password_same,
                null
              );
            } else {
              try {
                const newPassword = await userMiddleware.encryption(
                  req.new_password
                );
                const updatePassword = {
                  password: newPassword,
                };
                const result = await common.singleUpdate(
                  updatePassword,
                  userSchema,
                  {
                    _id: userId,
                    is_active: true,
                    is_deleted: false,
                  }
                );

                if (result) {
                  return userMiddleware.sendResponse(
                    res,
                    Codes.SUCCESS,
                    lang[req.language].rest_keyword_change_password_succ
                  );
                } else {
                  return userMiddleware.sendResponse(
                    res,
                    Codes.VALIDATION_ERROR,
                    lang[req.language].rest_keywords_something_went_wrong,
                    null
                  );
                }
              } catch (error) {
                return userMiddleware.sendResponse(
                  res,
                  Codes.VALIDATION_ERROR,
                  lang[req.language].rest_keywords_something_went_wrong,
                  null
                );
              }
            }
          } else {
            return userMiddleware.sendResponse(
              res,
              Codes.VALIDATION_ERROR,
              lang[req.language].rest_keywords_something_went_wrong,
              null
            );
          }
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
  },
  async editProfile(req, res) {
    const userId = new ObjectId(req.user_id);


    try {
      const userData = await common.singleGet(userSchema, {
        _id: userId,
        is_deleted: false,
        is_active:true
      });
      if (!userData) {
        return userMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_user_not_found,
          null
        );
      } else {
        let profileImageUrl = userData.profile_image;
        const userProfileParams = {
          full_name:
            req.full_name !== undefined && req.full_name !== null
              ? req.full_name
              : userData.full_name,
          address:
            req.address !== undefined && req.address !== null
              ? req.address
              : userData.address,
          email:
            req.email !== undefined && req.email !== null
              ? req.email
              : userData.email,
          country_code:
            req.country_code !== undefined && req.country_code !== null
              ? req.country_code
              : userData.country_code,
          mobile_number:
            req.mobile_number !== undefined && req.mobile_number !== null
              ? req.mobile_number
              : userData.mobile_number,
          profile_image:
            req.profile_image !== undefined && req.profile_image !== null
              ? profileImageUrl
              : userData.profile_image,
        };
        await common.singleUpdate(
          userProfileParams,
          userSchema,
          {
            _id: userId,
            is_active: true,
            is_deleted: false,
          }
        );
    
        const UpdatedData = await common.singleGet(userSchema, {
          _id: userId,
          is_deleted: false,
          is_active:true
        });
       
       
        return userMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword__profile_update_success,
          UpdatedData
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
