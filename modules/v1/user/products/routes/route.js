import express from 'express';
import productsAuthController from "../controllers/products_controllers.js"

const productsAuthRouter = express.Router();

productsAuthRouter.post('/productListing', productsAuthController.productListing);
productsAuthRouter.post('/addProductRating', productsAuthController.addProductRating);

export default productsAuthRouter;