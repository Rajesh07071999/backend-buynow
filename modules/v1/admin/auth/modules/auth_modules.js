import adminMiddleware from "../../../../../middleware/cryptojsValidationHeader.js";
import Codes from "../../../../../config/statusCode.js";
import lang from "../../../../../config/language.js";
import adminSchema from "../../../../../database/schema/adminSchema.js";
import common from "../../../../../config/common.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import GLOBALS from "../../../../../config/constant.js";
import userModel from "../../../../../database/schema/userSchema.js";
import productModel from "../../../../../database/schema/productSchema.js";
import orderModel from "../../../../../database/schema/orderSchema.js";
import cartModel from "../../../../../database/schema/cartSchema.js";
const { ObjectId } = mongoose.Types;
import moment from "moment"
const adminAuthModule = {
  async login(req, res) {
    try {
      const adminData = await common.singleGet(adminSchema, {
        email: req.email,
        is_deleted: false,
      });
      if (adminData) {

        const encPass = await adminMiddleware.encryption(req.password);
        if (adminData.password == encPass) {
          const token = jwt.sign(
            { userId: adminData.id },
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
            await common.singleUpdate(updateAdminToken, adminSchema, {
              email: req.email,
              is_active: true,
              is_deleted: false,
            });

            const adminUpdatedData = await common.singleGet(adminSchema, {
              email: req.email,
              is_deleted: false,
              is_active: true,
            });

            return adminMiddleware.sendResponse(
              res,
              Codes.SUCCESS,
              lang[req.language].rest_keyword_admin_login_success,
              adminUpdatedData
            );
          } catch (error) {
            return adminMiddleware.sendResponse(
              res,
              Codes.INTERNAL_ERROR,
              lang[req.language].rest_keywords_something_went_wrong,
              { message: error.message, stack: error.stack }
            );
          }
        } else {

          return adminMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            lang[req.language].rest_keyword_invalid_credentials,
            null
          );
        }

      } else {
        return adminMiddleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          lang[req.language].rest_keyword_invalid_credentials,
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

  async logout(req, res) {
    const userId = new ObjectId(req.user_id);

    const adminData = await common.singleGet(adminSchema, {
      _id: userId,
      is_deleted: false,
      is_active: true
    });

    if (adminData) {
      try {
        const updateInfo = {
          login_status: "Offline",
          token: "",
        };
        const adminSignout = await common.singleUpdate(
          updateInfo,
          adminSchema,
          {
            _id: userId,
            is_active: true,
            is_deleted: false,
          }
        );
        if (!adminSignout) {
          return adminMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keywords_something_went_wrong
          );
        } else {
          return adminMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_admin_logout,
            null
          );
        }
      } catch (error) {
        return adminMiddleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          lang[req.language].rest_keywords_something_went_wrong,
          { message: error.message, stack: error.stack }
        );
      }
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_admin_not_found,
        null
      );
    }
  },

  async changePassword(req, res) {
    try {
      const userId = new ObjectId(req.user_id);
      const password = await adminMiddleware.encryption(req.old_password);

      const adminData = await common.singleGet(adminSchema, {
        _id: userId,
        is_deleted: false,
        is_active: true
      });

      if (!adminData) {
        return adminMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keywords_admin_not_found,
          null
        );
      } else {
        if (password !== adminData.password) {
          return adminMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            lang[req.language].rest_keyword_old_new_password_incorect,
            null
          );
        } else {
          if (adminData) {
            if (req.old_password == req.new_password) {
              return adminMiddleware.sendResponse(
                res,
                Codes.VALIDATION_ERROR,
                lang[req.language].rest_keyword_old_new_password_same,
                null
              );
            } else {
              try {
                const newPassword = await adminMiddleware.encryption(
                  req.new_password
                );
                const updatePassword = {
                  password: newPassword,
                };
                const result = await common.singleUpdate(
                  updatePassword,
                  adminSchema,
                  {
                    _id: userId,
                    is_active: true,
                    is_deleted: false,
                  }
                );

                if (result) {
                  return adminMiddleware.sendResponse(
                    res,
                    Codes.SUCCESS,
                    lang[req.language].rest_keyword_change_password_succ
                  );
                } else {
                  return adminMiddleware.sendResponse(
                    res,
                    Codes.VALIDATION_ERROR,
                    lang[req.language].rest_keywords_something_went_wrong,
                    null
                  );
                }
              } catch (error) {
                return adminMiddleware.sendResponse(
                  res,
                  Codes.VALIDATION_ERROR,
                  lang[req.language].rest_keywords_something_went_wrong,
                  null
                );
              }
            }
          } else {
            return adminMiddleware.sendResponse(
              res,
              Codes.VALIDATION_ERROR,
              lang[req.language].rest_keywords_something_went_wrong,
              null
            );
          }
        }
      }
    } catch (error) {
      return adminMiddleware.sendResponse(
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
      const adminData = await common.singleGet(adminSchema, {
        _id: userId,
        is_deleted: false,
        is_active: true
      });
      if (!adminData) {
        return adminMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keywords_admin_not_found,
          null
        );
      } else {
        let profileImageUrl = adminData.profile_image;
        const adminProfileParams = {
          firstname:
            req.firstname !== undefined && req.firstname !== null
              ? req.firstname
              : adminData.firstname,
          lastname:
            req.lastname !== undefined && req.lastname !== null
              ? req.lastname
              : adminData.lastname,
          email:
            req.email !== undefined && req.email !== null
              ? req.email
              : adminData.email,
          country_code:
            req.country_code !== undefined && req.country_code !== null
              ? req.country_code
              : adminData.country_code,
          mobile_number:
            req.mobile_number !== undefined && req.mobile_number !== null
              ? req.mobile_number
              : adminData.mobile_number,
          profile_image:
            req.profile_image !== undefined && req.profile_image !== null
              ? profileImageUrl
              : adminData.profile_image,
        };
        await common.singleUpdate(
          adminProfileParams,
          adminSchema,
          {
            _id: userId,
            is_active: true,
            is_deleted: false,
          }
        );

        const adminUpdatedData = await common.singleGet(adminSchema, {
          _id: userId,
          is_deleted: false,
          is_active: true
        });


        return adminMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword__profile_update_success,
          adminUpdatedData
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

  async adminDetails(req, res) {
    try {
      const userId = new ObjectId(req.user_id);

      const adminInfo = await common.singleGet(adminSchema, {
        _id: userId,
        is_deleted: false,
        is_active: true,
      });

      if (!adminInfo) {
        return adminMiddleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          lang[req.language].rest_keywords_admin_not_found,
          null
        );
      } else {
        return adminMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword_success,
          adminInfo
        );
      }
    } catch (error) {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  },

async dashbaord(req, res) {
  try {
    const [totalUsers, totalProducts, totalOrders, totalCarts] = await Promise.all([
      userModel.countDocuments({is_active:true,is_deleted :false}),
      productModel.countDocuments({is_active:true,is_deleted :false}),
      orderModel.countDocuments({is_active:true,is_deleted :false}),
      cartModel.countDocuments({is_active:true,is_deleted :false})
    ]);

    const past6Months = [...Array(6)].map((_, i) => {
      const date = moment().subtract(i, "months");
      return {
        month: date.format("MMM"),
        year: date.format("YYYY"),
        start: date.startOf("month").toDate(),
        end: date.endOf("month").toDate()
      };
    }).reverse();

    const monthlyData = await Promise.all(
      past6Months.map(async ({ month, start, end }) => {
        const orders = await orderModel.find({ createdAt: { $gte: start, $lte: end } });
        console.log(orders)
        const revenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
        return {
          month,
          orderCount: orders.length,
          revenue
        };
      })
    );
    const categoryCounts = await productModel.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    const dashboardData = {
      totalUsers,
      totalProducts,
      totalOrders,
      totalCarts,
      monthlyStats: monthlyData, 
      categoryStats: categoryCounts 
    };

    return adminMiddleware.sendResponse(
      res,
      Codes.SUCCESS,
      lang[req.language].rest_keyword_success,
      dashboardData
    );
  } catch (error) {
    return adminMiddleware.sendResponse(
      res,
      Codes.VALIDATION_ERROR,
      lang[req.language].rest_keywords_something_went_wrong,
      null
    );
  }
}
,
  async userList(req, res) {
    try {
      const userLists = await userModel.find({
        is_deleted: false
      })
      if (userLists) {
        return adminMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword_success,
          userLists
        );
      } else {
        return adminMiddleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          lang[req.language].rest_keywords_something_went_wrong,
          null
        );
      }

    } catch (error) {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        null
      );
    }
  },
  async userDetails(req, res) {
    try {
      const userId = new ObjectId(req.id);
      const userInfo = await common.singleGet(userModel, {
        _id: userId,
        is_deleted: false,
      });
      if (!userInfo) {
        return adminMiddleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          lang[req.language].rest_keyword_user_not_found,
          null
        );
      } else {
        return adminMiddleware.sendResponse(
          res,
          Codes.SUCCESS,
          lang[req.language].rest_keyword_success,
          userInfo
        );
      }
    } catch (error) {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        lang[req.language].rest_keywords_something_went_wrong,
        { message: error.message, stack: error.stack }
      );
    }
  },
  async deleteUser(req, res) {
    try {
      const userId = new ObjectId(req.id);
      const userData = await common.singleGet(userModel, {
        _id: userId,
        is_active: true,
        is_deleted: false,
      });

      if (!userData) {
        return adminMiddleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          lang[req.language].rest_keyword_product_not_found,
          null
        );
      } else {
        const deleteUser = await common.singleUpdate(
          { is_deleted: true, is_active: false },
          userModel,
          { _id: userId }
        );
        if (deleteUser) {
          return adminMiddleware.sendResponse(
            res,
            Codes.SUCCESS,
            lang[req.language].rest_keyword_success,
            null
          );
        } else {
          return adminMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            lang[req.language].rest_keywords_something_went_wrong,
          );
        }
      }
    } catch (error) {
      return adminMiddleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        lang[req.language].rest_keywords_something_went_wrong
      );
    }
  },

  async userChangeActiveStatus(req, res) {
    try {
      const userId = new ObjectId(req.id);
      const userData = await common.singleUpdate(
        { is_active: req.status },
        userModel,
        { _id: userId }
      );
      if (userData) {
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
};

export default adminAuthModule;
