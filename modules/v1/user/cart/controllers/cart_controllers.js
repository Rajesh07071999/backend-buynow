import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import validationRules from "../validation_rules.js";
import cartModule from "../modules/cart_modules.js";
import Codes from "../../../../../config/statusCode.js";

const cartAuthController = {
    async addtoCart(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.addToCartValidation
        );
        if (valid.status) {
          return cartModule.addToCart(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async cartListing(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.cartValidation
        );
        if (valid.status) {
          return cartModule.cartListing(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async removeCart(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.removecartValidation
        );
        if (valid.status) {
          return cartModule.removeCart(request, res);
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

export default cartAuthController;