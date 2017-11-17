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
	inquirer.prompt([
	{
		name: "item",
		message: "Which product ID do you want to add to inventory?"
	},
	{	
		name: "count",
		message: "How many would you like to add?"
	}
	]).then(function(resp){
		connection.query("UPDATE products SET stock_quantity=" + resp.item + " WHERE item_id="+ resp.count +"'", function(data) {
		console.log("****************************************");
		console.log("Inventory has been updated!");
		console.log("****************************************");
		showProducts()	;
		});
	});
};

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
