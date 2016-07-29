const inquirer = require('inquirer');

const mysql = require('mysql');

var connection = mysql.createConnection({
    user: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    database: 'Bamazon'
});

connection.connect(function(err){
    if(err){
        throw err;
    } 
    console.log('Successfully connected to your DB\n');
    displayItems();
});

function displayItems () {
    connection.query('SELECT * FROM Products', function(err, res){
        if (err){throw err}

        res.forEach(function(row) {
        console.log('Product ID: ' + row.ItemID);
        console.log('Product Name: ' + row.ProductName);
        console.log('DepartmentName: ' + row.DepartmentName);
        console.log('Price: ' + row.Price);
        console.log('Stock Quantity: ' + row.StockQuantity);
        console.log('-------------------------------')
        })
    });
};