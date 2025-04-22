// routes/product.route.js
import express from 'express';
//import Product from '../models/product.model.js';
import { getAllProducts, getProduct, addProduct, updatedProduct, deleteProduct } from '../controller/product.controller.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', addProduct);
router.put('/:id', updatedProduct);
router.delete('/:id', deleteProduct);

export default router;