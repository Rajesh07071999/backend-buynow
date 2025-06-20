import adminMiddleware from "../../../../../middleware/cryptojsValidationHeader.js";
import validationRules from "../validation_rules.js";
import authModule from "../modules/auth_modules.js";
import Codes from "../../../../../config/statusCode.js";

const adminAuthController = {
  
  async login(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request,
      validationRules.loginValidation
    );

    if (valid.status) {
      // req.language = request.language;
      return authModule.login(request, res);
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        valid.error,
        null 
      );
    }
  },
 
  async logout(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request,
      validationRules.logoutValidation
    );

    if (valid.status) {
      // req.language = request.language;
      return authModule.logout(request, res);
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        valid.error,
        null
      );
    }
  },
  async adminDetails(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request,
      validationRules.admindetailsValidation
    );

    if (valid.status) {
      // req.language = request.language;
      return authModule.adminDetails(request, res);
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        valid.error,
        null
      );
    }
  },
  async changepassword(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request,
      validationRules.changepasswordValidation
    );

    if (valid.status) {
      // req.language = request.language;
      return authModule.changePassword(request, res);
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        valid.error,
        null
      );
    }
  },
  async editprofile(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request,
      validationRules.editprofileValidation
    );

    if (valid.status) {
      // req.language = request.language;
      return authModule.editProfile(request, res);
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        valid.error,
        null
      );
    }
  },
};

export default adminAuthController;
