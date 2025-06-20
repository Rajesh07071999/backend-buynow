import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import validationRules from "../validation_rules.js";
import productsModule from "../modules/products_modules.js";
import Codes from "../../../../../config/statusCode.js";

const productsAuthController = {
    
    async productListing(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.productListingValidation
        );
        if (valid.status) {
          return productsModule.productListing(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async addProductRating(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.addProductRatingValidation
        );
        if (valid.status) {
          return productsModule.addProductRating(request, res);
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

export default productsAuthController;