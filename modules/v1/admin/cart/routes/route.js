import express from 'express';
import cartAuthController from "../controllers/cart_controllers.js"

const cartAuthRouter = express.Router();


cartAuthRouter.post('/cartLisitng', cartAuthController.cartListing);


export default cartAuthRouter;