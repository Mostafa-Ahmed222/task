import { Router } from "express";
import { auth } from "../../middleware/Auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import validation from './../../middleware/Validation.js';
import * as validators from './product.validation.js';
import * as productController from './controller/product.js';
import { caching } from './../../middleware/Caching.js';
const router = Router()

// add products
router.post("/", myMulter(fileValidation.excel).single("excel"), validation(validators.addProduct), auth(), productController.addProduct)

// get all products
router.get('/', validation(validators.getAllProducts), auth(), caching("products"), productController.getAllProducts)

//search for products
router.get('/search', validation(validators.searchProducts), auth(), productController.searchProducts)

// update product
router.put('/:id', validation(validators.updateProductById), auth(), productController.updateProductById)

// update Quantities from excel sheet
router.patch("/", myMulter(fileValidation.excel).single("excel"), validation(validators.updateQuantities), auth(), productController.updateQuantities)

// delete product
router.delete('/:id', validation(validators.deleteProductByID), auth(), productController.deleteProductById)







export default router