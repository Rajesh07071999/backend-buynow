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
  async dashbaord(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request
    );

    if (valid.status) {
      req.language = request.language;
      return authModule.dashbaord(request, res);
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        valid.error,
        null
      );
    }
  },

  async userList(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request

    );

    if (valid.status) {
      req.language = request.language;
      return authModule.userList(request, res);
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        valid.error,
        null
      );
    }
  },

  async userDetails(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request,
      validationRules.userDetasilsValidations

    );
    if (valid.status) {
      req.language = request.language;
      req.user_id = request.user_id
      return authModule.userDetails(request, res);
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        valid.error,
        null
      );
    }
  },

  async deleteUser(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request,
      validationRules.deleteUserValidation
    );
    if (valid.status) {
      return authModule.deleteUser(request, res);
    } else {
      return adminMiddleware.sendResponse(
        res,
        Codes.VALIDATION_ERROR,
        valid.error,
        null
      );
    }
  },

  async ChangeActiveStatus(req, res) {
    const request = await adminMiddleware.decryption(req);
    const valid = await adminMiddleware.checkValidationRules(
      request,
      validationRules.userChangeActiveStatusValidation
    );
    if (valid.status) {
      return authModule.userChangeActiveStatus(request, res);
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
