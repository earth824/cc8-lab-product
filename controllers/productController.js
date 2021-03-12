const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const getAllProducts = async (req, res, next) => {
  try {
    const { name, order } = req.query;

    const data = await readFile('./product.json', 'utf8');
    const products = JSON.parse(data);

    let result = [...products];

    if (name) {
      result = products.filter(product =>
        product.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (order) {
      if (order.startsWith('-')) {
        result.sort((a, b) => (b[order.slice(1)] > a[order.slice(1)] ? 1 : -1));
      } else {
        result.sort((a, b) => (a[order] > b[order] ? 1 : -1));
      }
    }

    res.status(200).json({ products: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await readFile('./product.json', 'utf8');
    const products = JSON.parse(data);
    const filteredProduct = products.filter(product => product.id === +id);
    res
      .status(200)
      .json({ product: filteredProduct.length ? filteredProduct[0] : null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;

    if (!name.trim())
      return res.status(400).json({ message: 'name is required' });
    if (!+price || +price <= 0)
      return res
        .status(400)
        .json({ message: 'price must be numeric and greater than zero' });
    if (!price) return res.status(400).json({ message: 'price is required' });

    const data = await readFile('./product.json', 'utf8');
    const products = JSON.parse(data);
    const newProduct = {
      id: products[products.length - 1].id + 1,
      name: name.trim(),
      price: +price
    };
    products.push(newProduct);
    await writeFile('./product.json', JSON.stringify(products));
    res.status(201).json({
      message: 'Product add successfully',
      product: products[products.length - 1]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }

  // fs.readFile('./product.json', 'utf8', (err, data) => {
  //   if (err) return res.status(500).json({ message: 'Internal server error' });

  //   const products = JSON.parse(data);
  //   const newProduct = {
  //     id: products[products.length - 1].id + 1,
  //     name,
  //     price: +price
  //   };
  //   products.push(newProduct);
  //   fs.writeFile('./product.json', JSON.stringify(products), err => {
  //     if (err)
  //       return res.status(500).json({ message: 'Internal server error' });
  //     res.status(201).json({
  //       message: 'Product add successfully',
  //       product: products[products.length - 1]
  //     });
  //   });
  // });
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (price && +price <= 0)
      return res
        .status(400)
        .json({ message: 'price must be numeric and greater than zero' });

    const data = await readFile('./product.json', 'utf8');
    const products = JSON.parse(data);

    const idx = products.findIndex(product => product.id === +id);
    if (idx === -1)
      return res.status(400).json({ message: 'Invalid product id' });

    if (name && name.trim()) products[idx].name = name.trim();
    if (price) products[idx].price = +price;

    await writeFile('./product.json', JSON.stringify(products));
    res
      .status(200)
      .json({ message: 'Product update successfully', product: products[idx] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await readFile('./product.json', 'utf8');
    const products = JSON.parse(data);

    const idx = products.findIndex(product => product.id === +id);
    if (idx === -1)
      return res.status(400).json({ message: 'Invalid product id' });

    const updatedProducts = products.filter(product => product.id !== +id);
    await writeFile('./product.json', JSON.stringify(updatedProducts));
    res.status(204).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
