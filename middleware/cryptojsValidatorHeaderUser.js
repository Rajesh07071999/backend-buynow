import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import Validator from "Validator";
import GLOBALS from "../config/constant.js";
import CODES from "../config/statusCode.js";
import lang from "../config/language.js";
import logger from "../logger.js";
import jwt from "jsonwebtoken";
dotenv.config();

const Key = CryptoJS.enc.Hex.parse(GLOBALS.KEY);
const iv = CryptoJS.enc.Hex.parse(GLOBALS.IV);

const cryptojsHeaderValidatorUser = {
  /**
   * Function to extract the header language and set language environment
   * @param {Request Object} req
   * @param {Response Object} res
   */
  extractHeaderLanguage: async (req, res, next) => {
    try {
      let language;
      if (
        req.headers["accept-language"] !== undefined &&
        req.headers["accept-language"] !== ""
      ) {
        if (
          req.headers["accept-language"] === "en-GB,en-US;q=0.9,en;q=0.8" ||
          req.headers["accept-language"] ===
            "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,gu;q=0.6"
        ) {
          language = "en";
        } else {
          language = req.headers["accept-language"];
        }
      } else {
        language = "en";
      }
      req.language = language;
      logger.info("language set");

      next();
    } catch (error) {
      logger.error(error.message);
      return cryptojsHeaderValidatorUser.sendResponse(
        res,
        CODES.UNAUTHORIZED,
        error.message,
        null
      );
    }
  },

  /**
   * Function to validate API key of header (Note : Header keys are encrypted)
   * @param {Request Object} req
   * @param {Response Object} res
   */
  validateHeaderApiKey: async (req, res, next) => {
    const bypassHeaderKey = new Array("login", "register");
    try {
      const apiKey =
        req.headers["api-key"] !== undefined && req.headers["api-key"] !== ""
          ? req.headers["api-key"]
          : "";
      const pathData = req.path.split("/");

      // const method = pathData[pathData.length - 1];
      if (bypassHeaderKey.indexOf(2) === -1) {
        if (apiKey !== "") {
          // cryptojs
          const decApiKey = CryptoJS.AES.decrypt(apiKey, Key, {
            iv: iv,
          }).toString(CryptoJS.enc.Utf8);

          if (decApiKey === GLOBALS.API_KEY_ORIGINAL) {
            logger.info("api key is set");
            next();
          } else {
            return await cryptojsHeaderValidatorUser.sendResponse(
              res,
              CODES.UNAUTHORIZED,
              lang[req.language].rest_keywords_invalid_api_key,
              null
            );
          }
        } else {
          return await cryptojsHeaderValidatorUser.sendResponse(
            res,
            CODES.UNAUTHORIZED,
            lang[req.language].rest_keywords_apikey_not_found,
            null
          );
        }
      } else {
        next();
      }
    } catch (error) {
      logger.error(error.message);
      return cryptojsHeaderValidatorUser.sendResponse(
        res,
        CODES.ERROR,
        error.message,
        null
      );
    }
  },

  /**
   * Function to validate header token
   * @param {Req} req
   * @param {Res} res
   * @param {Function} callback
   */
  validateHeaderToken: async (req, res, next) => {
    const bypassMethod = new Array("login", "register");

    const pathData = req.path.split("/");
    const method = pathData[pathData.length - 1];
    try {
      const headerToken =
        req.headers.token !== undefined && req.headers.token !== ""
          ? req.headers.token
          : "";

      if (bypassMethod.indexOf(method) === -1) {
        if (headerToken !== "") {
          const token = CryptoJS.AES.decrypt(headerToken, Key, { iv: iv })
            .toString(CryptoJS.enc.Utf8)
            .replace(/\s/g, "");


          if (token != "") {
            jwt.verify(token, GLOBALS.JWT_SECRET, (err, decoded) => {
              if (err) {
                console.log(err);
                
                return cryptojsHeaderValidatorUser.sendResponse(
                  res,
                  CODES.UNAUTHORIZED,
                  lang[req.language]?.rest_keywords_token_notvalid_message,
                  null
                );
              }

              req.user_id = decoded.userId;
              logger.info("token is set");

              return next();
            });
          } else {
            return cryptojsHeaderValidatorUser.sendResponse(
              res,
              CODES.UNAUTHORIZED,
              lang[req.language].rest_keywords_token_notvalid_message,
              null
            );
          }
        } else {
          return cryptojsHeaderValidatorUser.sendResponse(
            res,
            CODES.UNAUTHORIZED,
            lang[req.language].rest_keywords_token_not_found,
            null
          );
        }
      } else {
        console.log("Token Bypass");
        next();
      }
    } catch (error) {
      return cryptojsHeaderValidatorUser.sendResponse(
        res,
        CODES.ERROR,
        error.message,
        null
      );
    }
  },

  /**
   * Function to check validation rules for all api's
   * @param {Request Parameters} request
   * @param {Response Object} response
   * @param {Validattion Rules} rules
   * @param {Messages} messages
   * @param {Keywords} keywords
   */
  checkValidationRules: async (request, rules) => {
    try {
      const v = Validator.make(request, rules);
      const validator = {
        status: true,
      };
      if (v.fails()) {
        const ValidatorErrors = v.getErrors();
        validator.status = false;
        for (const key in ValidatorErrors) {
          validator.error = ValidatorErrors[key][0];
          break;
        }
      }
      return validator;
    } catch (error) {
      logger.error(error.message);
      return true;
    }
  },

  /**
   * Function to return response for any api
   * @param {Response Object} res
   * @param {Response code} responsecode
   * @param {Response Msg} responsemessage
   * @param {Response Data} responsedata
   */
  sendResponse: async (res, resCode, msgKey, resData) => {
    try {
      const responsejson = {
        code: resCode,
        message: msgKey,
      };

      if (resData != null) {
        responsejson.data = resData;
      }
      const result = await cryptojsHeaderValidatorUser.encryption(responsejson);
      res.status(parseInt(resCode)).send(result);
    } catch (error) {
      logger.error(error);
    }
  },

  /**
   * Function to decrypt the data of request body
   * @param {Request Body} req
   * @param {Function} callback
   */
  decryption: async (req) => {
    try {
      if (req.body !== undefined && Object.keys(req).length !== 0) {
        const request = JSON.parse(
          CryptoJS.AES.decrypt(req.body, Key, { iv: iv }).toString(
            CryptoJS.enc.Utf8
          )
        );
        request.language = req.language;
        request.user_id = req.user_id;
        return request;
      } else {
        return {};
      }
    } catch (error) {
      console.log(error);
      
      return {};
    }
  },

  /**
   * Function to encrypt the response body before sending response
   * @param {Response Body} req
   */
  encryption: async (req) => {
    try {
      const response = CryptoJS.AES.encrypt(JSON.stringify(req), Key, {
        iv: iv,
      }).toString();
      return response;
    } catch (error) {
      return {};
    }
  },
};

export default cryptojsHeaderValidatorUser;
