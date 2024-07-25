import express from 'express';
import { createOrder, getAllOrders, getOrdersById, updateOrder, countOrder, deleteOrder, getTotalProductOrders } from '../Controllers/orderController.js';
// import checkUsers from '../middleware/authorisation.js';

const orderRouter = express.Router();


orderRouter.post('/createOrder', createOrder)
orderRouter.get('/listOrder', getAllOrders)
orderRouter.get('/getOrder/:id', getOrdersById)
orderRouter.get('/getTotalProductOrders', getTotalProductOrders)
orderRouter.get('/getOrderCount', countOrder)
orderRouter.put('/updateOrder/:id', updateOrder)
orderRouter.delete('/deleteOrder/:id', deleteOrder)


export default orderRouter