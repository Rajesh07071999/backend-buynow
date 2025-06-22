import express from 'express';
import productsAuthController from "../controllers/products_controllers.js"
const productsAuthRouter = express.Router();



productsAuthRouter.post("/addProducts", productsAuthController.addProducts);
productsAuthRouter.post("/productListing", productsAuthController.productListing);
productsAuthRouter.post("/editProduct", productsAuthController.editProduct);
productsAuthRouter.post("/deleteProduct", productsAuthController.deleteProduct);


export default productsAuthRouter;