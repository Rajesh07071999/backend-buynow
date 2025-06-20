import express from 'express';
import orderAuthController from "../controllers/order_controllers.js"

const orderAuthRouter = express.Router();

orderAuthRouter.post('/orderPlace', orderAuthController.orderPlace);
orderAuthRouter.post('/orderListing', orderAuthController.orderListing);
orderAuthRouter.post('/updateOrderStatus', orderAuthController.orderUpdateStatas);


export default orderAuthRouter;