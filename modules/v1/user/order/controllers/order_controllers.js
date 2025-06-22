import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import validationRules from "../validation_rules.js";
import orderModule from "../modules/order_modules.js";
import Codes from "../../../../../config/statusCode.js";

const orderAuthController = {

    async orderPlace(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
         
        );
        if (valid.status) {
          return orderModule.orderPlace(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async orderListing(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
         
        );
        if (valid.status) {
          return orderModule.orderListing(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async cancelOrder(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
        
        );
        if (valid.status) {
          return orderModule.cancelOrder(request, res);
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

export default orderAuthController;