//require mysql and require
var mysql = require ('mysql');
var inquirer = require ('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Bamazon"
});

startManager();

function startManager () {
  inquirer.prompt([{
    name:"Todo",
    type:"list",
    message:"What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]

  }]).then(function(answer){

  switch (answer.Todo) {
  case "View Products for Sale": 
  viewProductSales();
  break;

  case "View Low Inventory":
  viewLowInventory();
  break;

  case "Add to Inventory":
  addInventory();
  break;

  case "Add New Product":
  addProduct();
  break;

  case "Exit":
  console.log("Thank you for using Bamazon, where Bamazon serves you.");

    }
  });
}

///view products that are currently on sale
function viewProductSales() {

  connection.query('SELECT * FROM Bamazon.products', function (err, res) {
  for(var i = 0; i<res.length;i++){
    console.log("ID: " + res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " + res[i].Price + " | " + "QTY: " + res[i].StockQuantity);
    console.log('--------------------------------------------------------------------------------------------------')
  }
  startManager();
});
};

///view currently low inventory below stockquanity of 5
function viewLowInventory() {
  connection.query('SELECT * FROM  Bamazon.products', function(err, res) {
    if (err) throw err;
    console.log('----------------------------------------------------------------------------------------------------')

    for (var i=0; i<res.length; i++) {
      if (res[i].StockQuantity <= 5) {
      console.log("ID: " + res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " + res[i].Price + " | " + "QTY: " + res[i].StockQuantity);
      console.log('--------------------------------------------------------------------------------------------------')
      }
    }

      startManager();
    });
};

////Updates an existing inventory with stock amount
function addInventory () {

  connection.query('SELECT * FROM Bamazon.products', function (err, res) {
    if (err) throw err;
    var itemStorage=[];
  for(var i = 0; i<res.length;i++){
    itemStorage.push(res[i].ProductName);
    console.log("ID: " + res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " + res[i].Price + " | " + "QTY: " + res[i].StockQuantity);
    console.log('--------------------------------------------------------------------------------------------------')
  }


  inquirer.prompt([
  {
    name: "product",
    type: "list",
    choices: itemStorage,
    message: "Which product you would like to update?",
    },
    {
    name: "addStock",
    type: "input",
    message: "Update the quantity of the product to?",
    validate: function (value) {
      if(isNaN(value)=== false){
        return true; 
      } else {
        return false; 
      }

    }
  }
  ]).then(function(answer){
    var stock;
    for (var i=0; i<res.length; i++) {
      if (res[i].ProductName === answer.product) {
        stock = res[i].StockQuantity;
      }
    }


  connection.query('UPDATE Bamazon.Products SET ? WHERE?', [
    {StockQuantity: stock + parseInt(answer.addStock)},
    {ProductName: answer.product}],
    function(err, result) {
      if (err) throw err;
      console.log("You have successfully updated the following: " + answer.product + " with quantity of: " + (stock + parseInt(answer.addStock)));
      startManager();
    });
 })
})
}


//add new product to sale list
function addProduct () {
  var newDepartment=[];

  connection.query('SELECT * FROM Bamazon.products', function(err, res){
    if (err) throw err;
    for (var i=0; i<res.length;i++){
      newDepartment.push(res[i].DepartmentName);
    }
  })

  inquirer.prompt([
  {
    name:"product",
    type:"input",
    message:"Add a product: "
  },
  {
    name:"department",
    type:"list",
    choices: newDepartment,
    message:"Department: "
  },
  {
    name:"price",
    type:"input",
    message:"Price: ",
    validate: function (value) {
      if (isNaN(value)===false) {
        return true;
      } else {
        return false;
      }
    }

  },
  {
    name:"quantity",
    type:"input",
    message:"Quantity: ",
    validate: function (value) {
      if (isNaN(value)===false) {
        return true;
      } else {
        return false;
      }
    }
  }
  ]).then(function(answer){
    connection.query('INSERT INTO Products SET ?', {
      ProductName: answer.product,
      DepartmentName: answer.department,
      Price: answer.price,
      StockQuantity: answer.quantity
    }, function(err, res) {
      if (err) throw err;
      console.log("Item was successfully added into the sales inventory.");
    })
    startManager();
  });
}
// startManager();