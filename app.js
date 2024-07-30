const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
    //host: 'localhost',
    //user: 'root',
    //password: '',
    //database: 'c237_pcshop'
    host: 'db4free.net',
    user: 'hawmingc237',
    password: 'ng723731',
    database: 'miniprojecthm'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');

// Enable static files
app.use(express.static('public'));

// Enable form processing
app.use(express.urlencoded({ extended: false }));

// Route for PC products
app.get('/pc', (req, res) => {
    const category = 'pc';
    const sql = 'SELECT * FROM products WHERE category = ?';
    connection.query(sql, [category], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving PC products');
        }
        res.render('pc', { products: results });
    });
});

// Route for Laptop products
app.get('/laptop', (req, res) => {
    const category = 'laptop';
    const sql = 'SELECT * FROM products WHERE category = ?';
    connection.query(sql, [category], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving laptop products');
        }
        res.render('laptop', { products: results });
    });
});

// Route for homepage
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving products');
        }
        res.render('index', { products: results });
    });
});

// Route for individual product details
app.get('/product/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    connection.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving product by ID');
        }
        if (results.length > 0) {
            res.render('product', { product: results[0] });
        } else {
            res.status(404).send('Product not found');
        }
    });
});

// Route for products by category
app.get('/category/:category', (req, res) => {
    const category = req.params.category;
    const sql = 'SELECT * FROM products WHERE category = ?';
    connection.query(sql, [category], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send(`Error retrieving products in category: ${category}`);
        }
        res.render('category', { category, products: results });
    });
});

// Route for Accessory products
app.get('/accessory', (req, res) => {
    const category = 'accessory'; 
    const sql = 'SELECT * FROM products WHERE category = ?';
    connection.query(sql, [category], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving accessory products');
        }
        res.render('accessory', { products: results });
    });
});

// Route to post product
app.post('/addProduct', (req, res) => {
    const { productName, category, description, price, image } = req.body;
    const sql = 'INSERT INTO products (productName, category, description, price, image) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [productName, category, description, price, image], (error, results) => {
        if (error) {
            console.error('Database insertion error:', error.message);
            return res.status(500).send('Error adding product');
        }
        res.redirect('/');
    });
});


// Route to delete a product
app.post('/deleteProduct/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'DELETE FROM products WHERE productId = ?';
    connection.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error deleting product');
        }
        res.redirect('/');
    });
});

// Route to render the edit form
app.get('/editProduct/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    connection.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving product');
        }
        if (results.length > 0) {
            res.render('editProduct', { product: results[0] });
        } else {
            res.status(404).send('Product not found');
        }
    });
});

// Route to handle the edit form submission
app.post('/editProduct/:id', (req, res) => {
    const productId = req.params.id;
    const { productName, category, description, price } = req.body;

    const sql = 'UPDATE products SET productName = ?, category = ?, description = ?, price = ? WHERE productId = ?';
    connection.query(sql, [productName, category, description, price, productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error updating product');
        }
        res.redirect(`/product/${productId}`);
    });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/addProduct', (req, res) => {
    res.render('addProduct');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
