import userMiddleware from "../../../../../middleware/cryptojsValidatorHeaderUser.js";
import validationRules from "../validation_rules.js";
import subscriptionModule from "../modules/subscription_modules.js";
import Codes from "../../../../../config/statusCode.js";

const productsAuthController = {
    
    async addSubscriptionplans(req, res) {
      
        const request = await userMiddleware.decryption(req);
        
        const valid = await userMiddleware.checkValidationRules(
          request,
          validationRules.addSubscriptionplansValidation
        );
        if (valid.status) {
          return subscriptionModule.addSubscriptionplans(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async subscriptionListing(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          
        );
        if (valid.status) {
          return subscriptionModule.subscriptionListing(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async payment(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          
        );
        if (valid.status) {
          return subscriptionModule.payment(request, res);
        } else {
          return userMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async paymentCapture(req, res) {
        const request = await userMiddleware.decryption(req);
        const valid = await userMiddleware.checkValidationRules(
          request,
          
        );
        if (valid.status) {
          return subscriptionModule.paymentCapture(request, res);
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