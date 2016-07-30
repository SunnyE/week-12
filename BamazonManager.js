const inquirer = require('inquirer');

const mysql = require('mysql');

var Table = require('cli-table');

var id;
// connection to mysql server using root user @ localhost
var connection = mysql.createConnection({
    user: 'root',
    password: '',//actual password removed 
    host: 'localhost',
    port: 3306,
    database: 'Bamazon'
});
//creates table to 
var table = new Table({
    head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'],
    colWidths: [10, 20, 20, 10, 15]
});



// function that pulls the items from the products table on mysql server
function displayItems () {
    emptyTable(table);
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


var firstquest =[{
    type:'list',
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
    message: 'Please select from the following:',
    name: 'firstq'
}];

// function that is the main list menu
function firstprompt(){
    inquirer.prompt(firstquest).then(function(answer){
     if(answer.firstq ==='View Products for Sale'){
         displayItems();
     } else if (answer.firstq === 'View Low Inventory'){
         lowinventor();
     } else if (answer.firstq === 'Add to Inventory'){
         addinventory();
     } else  if (answer.firstq === 'Add New Product') {
         addNewProduct();
     }
    });
}

// function to check for low inventory and then push those items to a table
function lowinventor(){
        emptyTable(table);
       connection.query('SELECT * FROM Products WHERE StockQuantity < 5', function(err, results){
          if (err){throw err}
          results.forEach(function(row) {
            table.push([row.ItemID, row.ProductName, row.DepartmentName, row.Price, row.StockQuantity]);

         });
         console.log(table.toString());
         console.log('');
         // brings back the main menu
          firstprompt();
    });
};

var question = [{
    message: "Enter the ID of the product you want to add inventory: ",
    name: "id"
}];

var quantQuest = [{
    message: 'How many would you like to add?',
    name: 'quant'
}];

// function to add to inventory which gets the item id and quanity through a prompt and feeds then into an update function 
// can be cleaned up a bit

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
                                console.log("you have added " + answer.quant + ' to ' + name + ' for a total of ' + quantity);
                                console.log('');
                                end();
                            });
                        });           
                });
        }
    });
}


var newProd = [{
		message: 'Enter Name:',
		name: 'name'
},
{
		message: 'Enter Department:',
		name: 'department'
},
{
		message: 'Please enter the price of the item: ',
		name: 'price'
},
{
        message: 'Please enter the quantity of the item: ',
		name: 'quantity'
}];

///  add product function that prompts the user for info and then inserts it into the products table
function addNewProduct() {
    inquirer.prompt(newProd).then(function(answer){
        connection.query('INSERT INTO Products SET ?', {
            ProductName:answer.name,
            DepartmentName: answer.department,
            Price: parseFloat(answer.price),
            StockQuantity: parseInt(answer.quantity)
        }, function(err, results){
			if(err) { throw err}
            console.log('Your Product has been added!');
            console.log('');
            end();
		});
    
    })
}

// emptyes the cli-table that the inventory is pushed into so there are no double entries
function emptyTable(arr){
    arr.splice(0, arr.length);
}

var endQuest =[{
    type:'list',
    choices: ['Yes', 'No'],
    message: "Would you like to return to the main menu?",
    name: 'end'
}];

// function that prompts the user to go back to the main menu or end the connection. 
function end(){
    inquirer.prompt(endQuest).then(function(answer){
                    if (answer.end === 'Yes'){
                        firstprompt();
                    } else {
                        connection.end();
                    }
                });
};