import express from 'express';
import adminAuthController from "../controllers/auth_controller.js"

const adminAuthRouter = express.Router();

adminAuthRouter.post("/login", adminAuthController.login);
adminAuthRouter.post("/logout", adminAuthController.logout);
adminAuthRouter.post("/adminDetails", adminAuthController.adminDetails);
adminAuthRouter.post("/changepassword", adminAuthController.changepassword);
adminAuthRouter.post("/editprofile", adminAuthController.editprofile);


export default adminAuthRouter;  //exportando o router para ser usado em outro arquivo.  //