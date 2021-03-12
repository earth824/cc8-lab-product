const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/all', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/add', productController.createProduct);
router.put('/edit/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
