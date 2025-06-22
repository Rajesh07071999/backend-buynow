import express from 'express';
import orderAuthController from "../controllers/order_controllers.js"

const orderAuthRouter = express.Router();

orderAuthRouter.post('/orderPlace', orderAuthController.orderPlace);
orderAuthRouter.post('/orderListing', orderAuthController.orderListing);
orderAuthRouter.post('/cancelOrder', orderAuthController.cancelOrder);


export default orderAuthRouter; 