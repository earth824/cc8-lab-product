const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post(
  '/',
  productController.validateProduct,
  productController.createProduct
);
router.put(
  '/:id',
  productController.validateProduct,
  productController.checkProductIsExist,
  productController.updateProduct
);
router.delete(
  '/:id',
  productController.checkProductIsExist,
  productController.deleteProduct
);

module.exports = router;
