import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import validationRules from "../validation_rules.js";
import authModule from "../modules/auth_modules.js";
import Codes from "../../../../../config/statusCode.js";

const userAuthController = {
    async register(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.registerValidation
        );
        if (valid.status) {
          return authModule.register(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async login(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.loginValidation
        );
        if (valid.status) {
          return authModule.login(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async logout(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.logoutValidation
        );
        if (valid.status) {
          return authModule.logout(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async changePassword(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.changepasswordValidation
        );
        if (valid.status) {
          return authModule.changePassword(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async editProfile(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.editProfileValidation
        );
        if (valid.status) {
          return authModule.editProfile(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async userDetails(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.userdetailsValidation
        );
        if (valid.status) {
          return authModule.userDetails(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
}

export default userAuthController;