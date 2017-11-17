var inquirer = require("inquirer");
var Table = require('console.table');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon'
});
connection.connect();
function showProducts() {
connection.query('SELECT * FROM products', function(err,data) {
	if (err) throw err;
	console.log("****************************************");
	console.log("Bamazon Inventory")
	console.table(data);
	console.log("****************************************");
	promptBuy();
	});
	
};


function promptBuy() {
	inquirer.prompt ([
	{
		name: "id",
		message: "What is the Item ID of the product you want to buy?"
	}, 
	{
		name: "itemCount",
		message: "How many do you want to buy?"
	}
	]).then(function(purchase){
		console.log("purchase " + purchase);
		if (purchase.id.length === 0) {
			console.log("Please enter an item ID");
			promptBuy();
		} else {
		var itemCount = purchase.itemCount;
		connection.query('SELECT * FROM products WHERE item_id =?', purchase.id, function(err, inventory){
		if (err) throw err;
		if (purchase.itemCount > inventory[0].stock_quantity) {
			console.log("****************************************");
			console.log("Insufficient Stock!");
			console.log("****************************************");
			promptBuy();
		} else if (purchase.itemCount <= inventory[0].stock_quantity) {
			newCount = inventory[0].stock_quantity - purchase.itemCount;
			cost = inventory[0].price * purchase.itemCount
			console.log(newCount);
			connection.query("UPDATE products SET products.stock_quantity=" + newCount + " WHERE item_id=" + purchase.id, function(err, resp){
				if(err) throw err;
				console.log("Your order has been processed! You have been charged $" + cost);
				buyAgain();
			});
			}
		});
	}
	})
};

function buyAgain() {
	inquirer.prompt([
	{
		name: "again",
		type: "confirm",
		message: "Would you like to make another purchase?"
	}]).then(function(resp){
		if (resp.again) {
			showProducts();
		} else {
			console.log("Thank you for shopping. Have a great day!");
			connection.end();
		}
	})
}

showProducts();