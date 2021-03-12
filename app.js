const express = require('express');
const productRoute = require('./routes/productRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/product', productRoute);

const port = 8080;
app.listen(port, () => console.log(`server running on port ${port}`));
