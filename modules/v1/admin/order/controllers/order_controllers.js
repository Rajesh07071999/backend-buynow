import adminMiddleware from "../../../../../middleware/cryptojsValidationHeader.js";
import validationRules from "../validation_rules.js";
import orderModule from "../modules/order_modules.js";
import Codes from "../../../../../config/statusCode.js";

const orderAuthController = {

    async orderListing(req, res) {
        const request = await adminMiddleware.decryption(req);
        const valid = await adminMiddleware.checkValidationRules(
          request,
         
        );
        if (valid.status) {
          return orderModule.orderListing(request, res);
        } else {
          return adminMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async orderUpdateStatas(req, res) {
        const request = await adminMiddleware.decryption(req);
        const valid = await adminMiddleware.checkValidationRules(
          request,
          validationRules.orderCancelValidation
        );
        if (valid.status) {
          return orderModule.orderUpdateStatas(request, res);
        } else {
          return adminMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
}

export default orderAuthController;