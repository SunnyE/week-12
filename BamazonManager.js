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

var question = [{
    message: "Enter the ID of the product you want to add inventory: ",
    name: "id"
}];

var quantQuest = [{
    message: 'How many would you like to add?',
    name: 'quant'
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
     } else if ('Add to Inventory'){
         addinventory();
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

function addinventory(){

    var quantity; 
    inquirer.prompt(question).then(function(answer){
        if(answer){
            id = answer.id;
            console.log(id);
            connection.query('SELECT * FROM Products WHERE ItemID =' + id, function(err, results){
            if (err){throw err}
                name = results[0].ProductName;
                quantity = parseInt(results[0].StockQuantity); 
                inquirer.prompt(quantQuest).then(function(answer){
                quantity+= parseInt(answer.quant);
                connection.query('UPDATE Products SET StockQuantity=' + (quantity) +  ' WHERE ?',{ItemID:id}, function (err, results){  
                 if (err){throw err}
                  console.log("you have added " + answer.quant + ' to ' + name + 'for a total of ' + quantity);
                 });
             });
                          
            });
        }
    });
}


