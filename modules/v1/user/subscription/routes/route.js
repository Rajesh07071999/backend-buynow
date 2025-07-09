import express from 'express';
import productsAuthController from "../controllers/subscription_controllers.js"

const productsAuthRouter = express.Router();

productsAuthRouter.post('/addSubscriptionplans', productsAuthController.addSubscriptionplans);
productsAuthRouter.post('/subscriptionListing', productsAuthController.subscriptionListing);
productsAuthRouter.post('/payment', productsAuthController.payment);
productsAuthRouter.post('/paymentCapture', productsAuthController.paymentCapture);

export default productsAuthRouter;