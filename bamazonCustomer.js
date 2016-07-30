const inquirer = require('inquirer');

const mysql = require('mysql');

var id;
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
var question = [{
    message: "Enter the ID of the product you want: ",
    name: "id"
}];

var quantQuest = [{
    message: 'How many would you like to buy?',
    name: 'quant'
}];

var endQuest =[{
    type:'list',
    choices: ['Yes', 'No'],
    message: 'Would you like to keep shopping?',
    name: 'end'
}];

// prompt function that gets the item id from the user 

function promptid() {
    inquirer.prompt(question).then(function(answer){
        if(answer){
            id = answer.id;
            promptQuant(id);
           
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
          
          quantity = parseInt(results[0].StockQuantity);
          name = results[0].ProductName;
          price = parseFloat(results[0].Price);
          
    });
    inquirer.prompt(quantQuest).then(function(answer){
        
        if(quantity >= answer.quant) {
            quantity -= answer.quant; 
           // console.log((quantity - answer.quant));
            connection.query('UPDATE Products SET StockQuantity=' + (quantity) +  ' WHERE ?',{ItemID:id}, function (err, results){
                if (err){throw err}
                console.log("you have purchased " + answer.quant + ' of ' + name + ' for $' + (answer.quant * price)); 
                inquirer.prompt(endQuest).then(function(answer){
                    if (answer.end === 'Yes'){
                        displayItems();
                    } else {
                        connection.end();
                    }
                })
            })
        } else {
            console.log('There is not enough stock for your purchase, there are only ' + quantity + ' in stock');
            promptQuant(id);
    }
    });
}

//'UPDATE products SET StockQuantity=' + (inStock - quantity) + ' WHERE ?', {id: answer.item}