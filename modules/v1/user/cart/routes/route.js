import express from 'express';
import cartAuthController from "../controllers/cart_controllers.js"

const cartAuthRouter = express.Router();


cartAuthRouter.post('/addtoCart', cartAuthController.addtoCart);
cartAuthRouter.post('/cartLisitng', cartAuthController.cartListing);
cartAuthRouter.post('/removeCart', cartAuthController.removeCart);

export default cartAuthRouter;