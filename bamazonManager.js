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
	console.log("Bamazon Product Inventory")
	console.table(data);
	console.log("****************************************");
	userPrompt();
	});
};

function lowInventory() {
connection.query('SELECT * FROM products WHERE stock_quantity < 10', function(err,data) {
	if (err) throw err;
	console.log("****************************************");
	console.log("Bamazon  Low Inventory")
	console.table(data);
	console.log("****************************************");
	userPrompt();
	});
};

function addInventory() {
	connection.query("SELECT * FROM products", function(err,res, fields) {
		if (err) throw err;
		var products = res;
	inquirer.prompt([
	{
		name: "choice",
		type: "list",
		message: "Which product ID do you want to add to inventory?",
		choices: function(value){
			var productsArray = [];
			for (i=0; i < products.length; i++) {
				productsArray.push({
					id: products[i].item_id,
					name: products[i].product_name,
					dept: products[i].department_name,
					price: products[i].price,
					qty: products[i].stock_quantity
				});
			}return productsArray;
		} 
	}]).then(function(answer){
		for (var i=0; i<products.length; i++) {
			if (products[i].item_id == answer.choice) {
				var prodPurchased = products[i];
			}
		}
		inquirer.prompt([
		{
			name: "count",
			type: "input",
			message: "How many of the product would you like to add?"
		}
		]).then(function(resp){
		var newCount = parseInt(products.stock_quantity) + parseInt(resp.count);
		var addItem = [{
			stock_quantity: resp.count,
			item_id: prodPurchased.id
		}];
		connection.query("UPDATE products SET ? WHERE ?", addItem, function(err,data) {
			console.log(data);
			if (err) throw err;
		console.log("****************************************");
		console.log("Inventory has been updated!");
		console.log("****************************************");
		showProducts()	;
		});
	});
});
});
}

function addProduct() {
	inquirer.prompt([
	{
		name: "name",
		message: "What is the name of the product you want to add?"
	},{
		name: "dept",
		message: "What department should the product be listed in?"
	},
	{
		name: "price",
		message: "How much should the product be listed for?"
	},
	{
		name: "qty",
		message: "What quantity of the product would you like to add?"
	}
	]).then(function(newProduct){
		connection.query("INSERT INTO products SET ?", 
		{
			product_name: newProduct.name,
			department_name: newProduct.dept,
			price: newProduct.price,
			stock_quantity: newProduct.qty},
			function(err,res) {
				if (err) throw err;
				console.log("****************************************");
				console.log("Your product " + newProduct.name + " has been added!");
				console.log("****************************************");
				showProducts();
			});
		});
	};


function userPrompt() {
	inquirer.prompt([
	{
		name: "choice",
		type: "list",
		message: "Please select a menu option: ",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
	}
	]).then(function(menu){
		if (menu.choice == "View Products for Sale") {
			showProducts();
		} else if (menu.choice == "View Low Inventory") {
			lowInventory();
		} else if (menu.choice == "Add to Inventory") {
			addInventory();
		} else if (menu.choice == "Add New Product") {
			addProduct();
		} else {
			console.log("Thank you, goodbye!");
			connection.end();
		}
	})
};

userPrompt();
