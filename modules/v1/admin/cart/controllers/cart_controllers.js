import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import validationRules from "../validation_rules.js";
import cartModule from "../modules/cart_modules.js";
import Codes from "../../../../../config/statusCode.js";

const cartAuthController = {
   
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
     
}

export default cartAuthController;