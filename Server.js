require('dotenv').config();
const mysql = require('mysql');
const inquier = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_trackerDB"
  });

  connection.connect(err => {
    if (err) throw err;
    console.log('WELCOME TO EMPLOYEE TRACKER ' + connection.threadId);
    afterConnection();
  });