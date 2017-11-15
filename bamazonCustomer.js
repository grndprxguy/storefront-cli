var inquirer = require("inquirer");
var Table = require('console.table');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon'
});

// var showProducts = function() {connection.connect();
// connection.query('SELECT * FROM products where item_id = 1' function(err,res) {
// 	if (err) throw err;
// 	console.table(res);
// 	});
// connection.end();
// };

inquirer.prompt ([{
	name: "id",
	message: "What is the Item ID of the product you want to buy?"
}, {
	name: "itemCount",
	message: "How many do you want to buy?"
}]).then(function(purchase){
	var itemCount = purchase.itemCount;
	connection.query('SELECT * FROM products WHERE item_id =1', function(err, inventory){
		if (err) throw err;
	if (purchase.itemCount > inventory[0].stock_quantity) {
		console.log("Insufficient Stock!");
		connection.end();
		start();
	} else if (purchase.itemCount <= inventory[0].stock_quantity) {
		newCount = inventory[0].stock_quantity - purchase.itemCount;
		console.log(newCount);
		connection.query("UPDATE products SET stock_quantity=" + newCount + " WHERE item_id=" + purchase.id, function(err, resp){
			if(err) throw err;
			console.log("Your order has been processed!");
			connection.end();
		});
		}
	});
})

