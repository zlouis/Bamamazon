//require mysql and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Bamazon"
})

function startExecutive () {
  inquirer.prompt([{
    name:"action",
    type: "list",
    message:"What would you like to do? ",
    choices:["View Product Sales by Department", "Create New Department", "Exit"]

  }]).then(function(answer){
    switch (answer.action) {
    case "View Product Sales by Department":
    viewProductSalesDept();
    break;

    case "Create New Department":
    createNewDept();
    break;

    case "Exit":
    console.log("Thank you for using Bamazon Executive suite, at Bamazon we serve you.")
    }
  })
};

function viewProductSalesDept () {
  connection.query('SELECT * FROM Departments', function (err, res){
    if (err) throw err;
    console.log("Product sales by  department");

    for (var i=0;i<res.length;i++){
       console.log("Department ID: " + res[i].DepartmentID + " | " + "Department Name: " + res[i].DepartmentName + " | " + "Over Head Cost: " + (res[i].OverHeadCosts).toFixed(2) + " | " + "Product Sales: " + (res[i].TotalSales).toFixed(2) + " | " + "Total Profit: " + (res[i].TotalSales - res[i].OverHeadCosts).toFixed(2));
      console.log('--------------------------------------------------------------------------------------------------')
    }
    startExecutive();
  })
}

function createNewDept () {
  inquirer.prompt([
  {
    name:"department",
    type:"input",
    message:"Department name: "
  },
  {
    name:"overheadcost",
    type:"input",
    message:"Overhead Costs: ",
    validate: function(value){
      if (isNaN(value)===false) {
        return true;
      } else {
        return false;
      }
    }
  },
  {
    name:"productsales",
    type:"input",
    message:"Product sales: ",
    validate: function(value){
      if (isNaN(value)===false) {
        return true;
      } else {
        return false;
      }
    }
  }
  ]).then(function(answer){
    connection.query('INSERT INTO Departments SET ?', {
      DepartmentName: answer.department,
      OverHeadCosts: answer.overheadcost,
      TotalSales: answer.productsales
    }, function (err, res) {
      if (err) throw err;
        console.log("Department item added successsfully")
      })
    startExecutive();

    });
}

startExecutive();