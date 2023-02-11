import { Router } from "express";
import { auth } from "../../middleware/Auth.js";
import validation from './../../middleware/Validation.js';
import * as validators from './order.validation.js';
import * as orderController from './controller/order.js';
import { caching } from './../../middleware/Caching.js';
const router = Router()

// creating order
router.post('/', validation(validators.createOrder), auth(), orderController.createOrder)

// get orders
router.get('/', validation(validators.getOrders),auth(), caching("orders"), orderController.getOrders)

// search for orders
router.get('/search', validation(validators.searchOrders), auth(), orderController.searchOrders)

// delete order by id
router.delete('/:id', validation(validators.deleteOrderById),auth(), orderController.deleteOrderById)

export default router