import express from 'express';
import cryptojsHeaderValidator from '../../../middleware/cryptojsValidatorHeaderUser.js';
import userAuthRouter from "../user/auth/routes/route.js"
import ProductRouter from "../user/products/routes/route.js"
import OrderRouter from "../user/order/routes/route.js"
import cartRouter from './cart/routes/route.js';
const router = express.Router();

router.use('/', cryptojsHeaderValidator.extractHeaderLanguage);
router.use('/', cryptojsHeaderValidator.validateHeaderApiKey);
router.use('/', cryptojsHeaderValidator.validateHeaderToken);

router.use("/auth",userAuthRouter)
router.use("/prodcuts",ProductRouter)
router.use("/order",OrderRouter)
router.use("/cart",cartRouter)

export default router;   