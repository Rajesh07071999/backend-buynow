import express from 'express';
import productsAuthController from "../controllers/products_controllers.js"
import multer from "multer"
const productsAuthRouter = express.Router();


const storageConfig = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        let image = Date.now() + '-rmd-' + file.originalname;
        req.body.image = image;
        cb(null, image);
    }

});

const upload = multer({ 
    storage: storageConfig
}).fields([    
    { name: 'image', maxCount: 1 },
]);

productsAuthRouter.post("/addProducts", productsAuthController.addProducts);
productsAuthRouter.post("/productListing", productsAuthController.productListing);
productsAuthRouter.post("/editProduct", productsAuthController.editProduct);
productsAuthRouter.post("/deleteProduct", productsAuthController.deleteProduct);


export default productsAuthRouter;