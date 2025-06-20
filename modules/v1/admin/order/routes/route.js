import express from 'express';
import orderAuthController from "../controllers/order_controllers.js"

const orderAuthRouter = express.Router();


orderAuthRouter.post("/orderListing", orderAuthController.orderListing);
orderAuthRouter.post("/orderUpdateStatas", orderAuthController.orderUpdateStatas);

export default orderAuthRouter;