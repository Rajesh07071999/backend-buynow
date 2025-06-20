import express from 'express';
import cryptojsHeaderValidator from '../../../middleware/cryptojsValidationHeader.js';
import adminAuthRouter from "../admin/auth/routes/route.js"
import productsAuthRouter from './products/routes/route.js';
import orderAuthRouter from './order/routes/route.js';
import cartRouter from "./cart/routes/route.js"
const router = express.Router();

router.use('/', cryptojsHeaderValidator.extractHeaderLanguage);
router.use('/', cryptojsHeaderValidator.validateHeaderApiKey);
router.use('/', cryptojsHeaderValidator.validateHeaderToken);

router.use("/auth",adminAuthRouter)
router.use("/products",productsAuthRouter)
router.use("/order",orderAuthRouter)
router.use("/cart",cartRouter)

export default router;   