const inquirer = require('inquirer');

const mysql = require('mysql');

// connection to mysql server using root user @ localhost
var connection = mysql.createConnection({
    user: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    database: 'Bamazon'
});

// starting the connection to the MySql server
connection.connect(function(err){
    if(err){
        throw err;
    } 
    console.log('Successfully connected to your DB\n');
    displayItems();

});

// function that pulls the items from the products table on mysql server
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
        });
        promptid();
    });
};

// prompt function that gets the item id from the user 
function promptid() {
    inquirer.prompt("Enter the ID of the product you want: ").then(function(answer){
        if(answer){
            var id = answer;
           
        }
    });
};

// prompt function that gets the quantity of the item the user wants and then checks it against the stock. 
function promptQuant(id){
    var quantity; 
    var price;
    var name; 
    connection.query('SELECT * FROM Products WHERE ItemID =' + id, function(err, results){
          if (err){throw err}
          quantity = results.StockQuantity;
          name = results.ProductName;
          price = results.Price;
    });
    inquirer.prompt('How many would you like to buy?').then(function(answer){
        if(quantity >= answer) {
            quantity -= answer; 
            connection.query('UPDATE Products SET ? WHERE ?',[{
              StockQuantity: parseInt(quantity)  
            },{
                ItemID: id
            }]), function (err, results){
                if (err){throw err}
                console.log("you have purchased " + quantity) + 'of ' + name + ' for $' + (quantity * price); 
            }
        } else {
            console.log('There is not enough stock for your purchase');
        }   
    });
};