import express from 'express';
import cryptojsHeaderValidator from '../../../middleware/cryptojsValidatorHeaderUser.js';
import AuthRouter from "../user/auth/routes/route.js"
import SubscriptionRouter from "./subscription/routes/route.js"

const router = express.Router();

router.use('/', cryptojsHeaderValidator.extractHeaderLanguage);
router.use('/', cryptojsHeaderValidator.validateHeaderApiKey);
router.use('/', cryptojsHeaderValidator.validateHeaderToken);

router.use("/auth",AuthRouter)
router.use("/subscription",SubscriptionRouter) 


export default router;   