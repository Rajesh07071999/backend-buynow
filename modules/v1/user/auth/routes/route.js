import express from 'express';
import userAuthController from "../controllers/auth_controllers.js"

const userAuthRouter = express.Router();

userAuthRouter.post('/register', userAuthController.register);
userAuthRouter.post('/login', userAuthController.login);
userAuthRouter.post('/logout', userAuthController.logout);
userAuthRouter.post('/changePassword', userAuthController.changePassword);
userAuthRouter.post('/editProfile', userAuthController.editProfile);
userAuthRouter.post('/userDetails', userAuthController.userDetails);

export default userAuthRouter;