import adminMiddleware from "../../../../../middleware/cryptojsValidationHeader.js";
import validationRules from "../validation_rules.js";
import productsModule from "../modules/products_modules.js";
import Codes from "../../../../../config/statusCode.js";

const productsAuthController = {
    async addProducts(req, res) {
        const request = await adminMiddleware.decryption(req);
        const valid = await adminMiddleware.checkValidationRules(
          request,
          validationRules.addproductValidation
        );
    
        if (valid.status) {
          return productsModule.addProducts(request, res);
        } else {
          return adminMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async productListing(req, res) {
        const request = await adminMiddleware.decryption(req);
        const valid = await adminMiddleware.checkValidationRules(
          request,
        );
    
        if (valid.status) {
          return productsModule.productListing(request, res);
        } else {
          return adminMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async editProduct(req, res) {
        const request = await adminMiddleware.decryption(req);
        const valid = await adminMiddleware.checkValidationRules(
          request,
          validationRules.editproductValidation
        );
        if (valid.status) {
          return productsModule.editProduct(request, res);
        } else {
          return adminMiddleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            valid.error,
            null
          );
        }
      },
      async deleteProduct(req, res) {
        const request = await adminMiddleware.decryption(req);
        const valid = await adminMiddleware.checkValidationRules(
          request,
          validationRules.deleteproductValidation
        );
        if (valid.status) {
          return productsModule.deleteProduct(request, res);
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

export default productsAuthController;