const inquirer = require('inquirer');

const mysql = require('mysql');

var Table = require('cli-table');

var id;
// connection to mysql server using root user @ localhost
var connection = mysql.createConnection({
    user: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    database: 'Bamazon'
});

var table = new Table({
    head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'],
    colWidths: [10, 20, 20, 10, 15]
});

var firstquest =[{
    type:'list',
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
    message: 'Please select from the following:',
    name: 'firstq'
}];
// function that pulls the items from the products table on mysql server
function displayItems () {
    connection.query('SELECT * FROM Products', function(err, res){
        if (err){throw err}

        res.forEach(function(row) {
        table.push([row.ItemID, row.ProductName, row.DepartmentName, row.Price, row.StockQuantity]);

        });
        console.log(table.toString());
	    firstprompt(); 
       
    });
};

// starting the connection to the MySql server
connection.connect(function(err){
    if(err){
        throw err;
    } 
    console.log('Successfully connected to your DB\n');
    firstprompt();
    
});

function firstprompt(){
    inquirer.prompt(firstquest).then(function(answer){
     if(answer.firstq ==='View Products for Sale'){
         displayItems();
     } else if (answer.firstq === 'View Low Inventory'){
         lowinventor();
     }
    });
}

function lowinventor(){
       connection.query('SELECT * FROM Products WHERE StockQuantity < 5', function(err, results){
          if (err){throw err}
          results.forEach(function(row) {
            table.push([row.ItemID, row.ProductName, row.DepartmentName, row.Price, row.StockQuantity]);

         });
         console.log(table.toString());
          firstprompt();
    });
};

function 


