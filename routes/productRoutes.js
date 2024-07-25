import express from 'express';
import { AddProduct, getProduct, updateProductById, DeleteProductById, getProductById, findProductByCategory, countProduct } from '../Controllers/productController.js';
import { addProductValidator } from '../utils/validation.js';
import { upload } from '../utils/uploadImage.js';
const productRouter = express.Router();



productRouter.post('/addProduct', addProductValidator, upload.single('image'), AddProduct);
productRouter.get('/productList', getProduct);
productRouter.put('/updateProduct/:id',updateProductById);
productRouter.get('/productById/:id', getProductById)
productRouter.delete('/delete/:id', DeleteProductById);
productRouter.get('/category/:category', findProductByCategory);
productRouter.get('/productCount', countProduct);

export default productRouter;
