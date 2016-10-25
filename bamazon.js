// SQL SCRIPT

// CREATE DATABASE Bamazon

//   CREATE TABLE Bamazon.products (
//   ItemID INT NOT NULL AUTO_INCREMENT,
//   ProductName VARCHAR(30),
//   DepartmentName VARCHAR(30),
//   Price INT NOT NULL,
//   StockQuantity INT NOT NULL,
//   PRIMARY KEY (ItemID));

// INSERT INTO Bamazon.products (ProductName, DepartmentName, Price, StockQuantity)
// VALUES ("Lego 10196", "Toys", 5000, 2)
// VALUES ("GeForce GTX 1080", "Computer Accessories", 1000, 1)
// VALUES ("Supreme Leather Chair", "Furniture", 1000000, 1)
// VALUES ("Gold Plated toilet seat", "Bath", 100000, 1)
// VALUES ("Ancient Wooden Dresser", "Furniture", 50000, 10)
// VALUES ("Cherry Wood Bed Frame", "Furniture", 67500, 20)
// VALUES ("Exotic Candles", "Home Decor", 51000, 10000)
// VALUES ("Shampoo of Roses", "Bath", 7000, 99)
// VALUES ("Edison Light Bulb", "Appliances", 5000, 100)
// VALUES ("World's Sofest Sofa", "Furniture", 10000000, 1)

// TO DO LIST

// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.


var mysql = require ('mysql')
var inquirer = require ('inquirer')
var buyerAnsId=""
var buyerAnsNum=""

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  // password:""
  database: "Bamazon"
})

// connection.connection(function(err){
//   if (err) throw err;
// })
function startBamazon(){

connection.query('SELECT * FROM Bamazon.products', function (err, res) {
  for(var i = 0; i<res.length;i++){
    console.log("ID: " + res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " + res[i].Price + " | " + "QTY: " + res[i].StockQuantity);
    console.log('--------------------------------------------------------------------------------------------------')
  }

  inquirer.prompt([
  {
    name: "buyId",
    type: "input",
    message: "What is the ID of the product you would like to purchase?",
    validate: function(value){
        if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
          return true;
        } else{
          return false;
      }
    }
  },
  { 
    name: "buyNum",
    type: "input",
    message: "How many quanity would you like to purchase?",
    validate: function (value) {
      if (isNaN(value)) {
        return false;
      } else {
        return true;
      }
    }
  }

  ]).then(function(answer){
    var buyId=(answer.buyId) - 1;
    var buyNum=parseInt(answer.buyNum);
    var total=parseFloat(((res[buyId].Price)*buyNum).toFixed(2));

    if (res[buyId].StockQuantity >= buyNum) {
      connection.query("UPDATE Products SET ? WHERE ?", [
        {StockQuantity: (res[buyId].StockQuantity - buyNum)},
        {ItemID: answer.buyId}
        ],function(err, result) {
          if (err) throw err;
          console.log("Your total is $" + total.toFixed(2) + ". Your item(s) will be shipped within 1-2 buisness days.");
          console.log("  ")
        });
     
      // connection.query("SELECT * FROM Department", function(err, departmentresults){
      //     if(err) throw err;
      //     var index;
      //     for(var i = 0; i < departmentresults.length; i++){
      //       if(departmentresults[i].DepartmentName === res[buyId].DepartmentName){
      //         index = i;
      //       }
      //     }
          
      //     //updates totalSales in departments table
      //     connection.query("UPDATE Department SET ? WHERE ?", [
      //     {TotalSales: departmentresults[index].TotalSales + grandTotal},
      //     {DepartmentName: res[buyId].DepartmentName}
      //     ], function(err, departmentresults){
      //         if(err) throw err;
      //         //console.log("Updated Dept Sales.");
      //     });
      //   });

      } else{
        console.log("The item you have placed is currently out of stock. We appologize for any inconvience this may have caused.");
      }
      console.log("  ")
      reprompt();
    })
})
}

//asks if they would like to purchase another item
function reprompt(){
  inquirer.prompt([{
    type: "confirm",
    name: "reply",
    message: "Would you like to purchase another item?"
  }]).then(function(answer){
    if(answer.reply){
      startBamazon();
    } else{
      console.log("We hope you enjoyed shopping with us! Please come visit us again soon at Bamazon.");
    }
  });
}

startBamazon();